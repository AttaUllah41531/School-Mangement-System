const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllTeachers = async (req, res) => {
    try {
        const query = `
            SELECT t.*, u.name, u.email 
            FROM teachers t
            JOIN users u ON t.user_id = u.id
        `;
        const [teachers] = await db.execute(query);
        res.json(teachers);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching teachers',
            error: error.message
        });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const query = `
            SELECT t.*, u.name, u.email 
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            WHERE t.id = ?
        `;
        const [teachers] = await db.execute(query, [req.params.id]);
        if (teachers.length === 0) return res.status(404).json({
            message: 'Teacher not found'
        });
        res.json(teachers[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching teacher',
            error: error.message
        });
    }
};

exports.createTeacher = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const {
            name,
            email,
            password,
            employee_id,
            qualification,
            experience_years,
            salary,
            joining_date
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'teacher123', salt);

        const [userResult] = await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'teacher']
        );
        const userId = userResult.insertId;

        await connection.execute(
            'INSERT INTO teachers (user_id, employee_id, qualification, experience_years, salary, joining_date) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, employee_id, qualification, experience_years, salary, joining_date]
        );

        await connection.commit();
        res.status(201).json({
            message: 'Teacher created successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error creating teacher',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

exports.updateTeacher = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const {
            name,
            email,
            employee_id,
            qualification,
            experience_years,
            salary,
            joining_date,
            status
        } = req.body;
        const teacherId = req.params.id;

        const [teachers] = await connection.execute('SELECT user_id FROM teachers WHERE id = ?', [teacherId]);
        if (teachers.length === 0) {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }
        const userId = teachers[0].user_id;

        await connection.execute(
            'UPDATE users SET name = ?, email = ?, status = ? WHERE id = ?',
            [name, email, status || 'active', userId]
        );

        await connection.execute(
            'UPDATE teachers SET employee_id = ?, qualification = ?, experience_years = ?, salary = ?, joining_date = ? WHERE id = ?',
            [employee_id, qualification, experience_years, salary, joining_date, teacherId]
        );

        await connection.commit();
        res.json({
            message: 'Teacher updated successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error updating teacher',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

exports.deleteTeacher = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const teacherId = req.params.id;

        const [teachers] = await connection.execute('SELECT user_id FROM teachers WHERE id = ?', [teacherId]);
        if (teachers.length === 0) {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }
        const userId = teachers[0].user_id;

        await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

        await connection.commit();
        res.json({
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error deleting teacher',
            error: error.message
        });
    } finally {
        connection.release();
    }
};