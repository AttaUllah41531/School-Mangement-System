const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllStudents = async (req, res) => {
    try {
        const query = `
            SELECT s.*, u.name, u.email, c.name as class_name, sec.name as section_name 
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN sections sec ON s.section_id = sec.id
        `;
        const [students] = await db.execute(query);
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching students',
            error: error.message
        });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const query = `
            SELECT s.*, u.name, u.email, u.status, c.name as class_name, sec.name as section_name, p.user_id as parent_user_id
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN sections sec ON s.section_id = sec.id
            LEFT JOIN parents p ON s.parent_id = p.id
            WHERE s.id = ?
        `;
        const [students] = await db.execute(query, [req.params.id]);
        if (students.length === 0) return res.status(404).json({
            message: 'Student not found'
        });
        res.json(students[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching student',
            error: error.message
        });
    }
};

exports.createStudent = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const {
            name,
            email,
            password,
            admission_no,
            phone,
            parent_name,
            parent_phone,
            occupation,
            class_id,
            section_id,
            dob,
            gender,
            address
        } = req.body;

        // Validation
        if (!name || !email || !admission_no) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Name, email, and admission number are required'
            });
        }

        // Check if admission_no already exists
        const [existingStudent] = await connection.execute(
            'SELECT id FROM students WHERE admission_no = ?',
            [admission_no]
        );
        if (existingStudent.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Admission number already exists'
            });
        }

        // Check if email already exists
        const [existingUser] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'student123', salt);

        // 1. Create User
        const [userResult] = await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'student']
        );
        const userId = userResult.insertId;

        // 2. Create Student
        const [studentResult] = await connection.execute(
            'INSERT INTO students (user_id, admission_no, phone, parent_name, parent_phone, occupation, class_id, section_id, dob, gender, address, admission_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())',
            [userId, admission_no, phone || null, parent_name || null, parent_phone || null, occupation || null, class_id || null, section_id || null, dob || null, gender || 'male', address || null]
        );
        const studentId = studentResult.insertId;

        await connection.commit();

        // Fetch the created student with all details
        const [newStudent] = await connection.execute(`
            SELECT s.*, u.name, u.email, c.name as class_name, sec.name as section_name 
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN sections sec ON s.section_id = sec.id
            WHERE s.id = ?
        `, [studentId]);

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: newStudent[0]
        });
    } catch (error) {
        await connection.rollback();
        console.error('Create student error:', error);
        res.status(500).json({
            success: false,
            message: `Error creating student: ${error.message}`,
            error: error.message
        });
    } finally {
        connection.release();
    }
};

exports.updateStudent = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const {
            name,
            email,
            admission_no,
            phone,
            parent_name,
            parent_phone,
            occupation,
            class_id,
            section_id,
            dob,
            gender,
            address,
            status
        } = req.body;
        const studentId = req.params.id;

        // Find student and user_id
        const [students] = await connection.execute('SELECT user_id FROM students WHERE id = ?', [studentId]);
        if (students.length === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }
        const userId = students[0].user_id;

        // 1. Update User
        const userUpdates = ['name = ?', 'email = ?', 'status = ?'];
        const userParams = [name, email, status || 'active'];

        if (req.body.password && req.body.password.trim() !== '') {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            userUpdates.push('password = ?');
            userParams.push(hashedPassword);
        }

        userParams.push(userId);
        await connection.execute(
            `UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`,
            userParams
        );

        // 2. Update Student
        await connection.execute(
            'UPDATE students SET admission_no = ?, phone = ?, parent_name = ?, parent_phone = ?, occupation = ?, class_id = ?, section_id = ?, dob = ?, gender = ?, address = ? WHERE id = ?',
            [admission_no, phone, parent_name, parent_phone, occupation, class_id, section_id, dob, gender, address, studentId]
        );

        await connection.commit();
        res.json({
            message: 'Student updated successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error updating student',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

exports.deleteStudent = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const studentId = req.params.id;

        // Find user_id
        const [students] = await connection.execute('SELECT user_id FROM students WHERE id = ?', [studentId]);
        if (students.length === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }
        const userId = students[0].user_id;

        // Delete Student (user deletion will cascade if foreign keys are set correctly, but we'll be explicit or soft delete)
        // Based on schema, ON DELETE CASCADE is set for students -> users
        await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

        await connection.commit();
        res.json({
            message: 'Student deleted successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error deleting student',
            error: error.message
        });
    } finally {
        connection.release();
    }
};