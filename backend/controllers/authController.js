const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        // Check if user exists
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'student']
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Find user
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Generate JWT
        const token = jwt.sign({
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: '24h'
            }
        );

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // Add specific IDs based on role
        if (user.role === 'student') {
            const [students] = await db.execute('SELECT id FROM students WHERE user_id = ?', [user.id]);
            if (students.length > 0) userData.student_id = students[0].id;
        } else if (user.role === 'teacher') {
            const [teachers] = await db.execute('SELECT id FROM teachers WHERE user_id = ?', [user.id]);
            if (teachers.length > 0) userData.teacher_id = teachers[0].id;
        }

        res.json({
            token,
            user: userData
        });
    } catch (error) {
        res.status(500).json({
            message: 'Login failed',
            error: error.message
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        const [users] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        if (role === 'student') {
            const [students] = await db.execute('SELECT id FROM students WHERE user_id = ?', [userId]);
            if (students.length > 0) {
                user.student_id = students[0].id;
            }
        } else if (role === 'teacher') {
            const [teachers] = await db.execute('SELECT id FROM teachers WHERE user_id = ?', [userId]);
            if (teachers.length > 0) {
                user.teacher_id = teachers[0].id;
            }
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Fetch user failed',
            error: error.message
        });
    }
};