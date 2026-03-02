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
            SELECT s.*, u.name, u.email, c.name as class_name, sec.name as section_name, p.user_id as parent_user_id
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
            class_id,
            section_id,
            dob,
            gender,
            address
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'student123', salt);

        // 1. Create User
        const [userResult] = await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'student']
        );
        const userId = userResult.insertId;

        // 2. Create Student
        await connection.execute(
            'INSERT INTO students (user_id, admission_no, class_id, section_id, dob, gender, address, admission_date) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())',
            [userId, admission_no, class_id, section_id, dob, gender, address]
        );

        await connection.commit();
        res.status(201).json({
            message: 'Student created successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error creating student',
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
        await connection.execute(
            'UPDATE users SET name = ?, email = ?, status = ? WHERE id = ?',
            [name, email, status || 'active', userId]
        );

        // 2. Update Student
        await connection.execute(
            'UPDATE students SET admission_no = ?, class_id = ?, section_id = ?, dob = ?, gender = ?, address = ? WHERE id = ?',
            [admission_no, class_id, section_id, dob, gender, address, studentId]
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