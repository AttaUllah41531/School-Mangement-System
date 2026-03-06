const db = require('../config/db');

exports.getAllFees = async (req, res) => {
    try {
        const {
            id: userId,
            role
        } = req.user;
        let query = `
            SELECT f.*, u.name as student_name, s.admission_no, c.name as class_name
            FROM fees f
            JOIN students s ON f.student_id = s.id
            JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
        `;
        let params = [];

        if (role === 'student') {
            query += ' WHERE u.id = ?';
            params.push(userId);
        }

        query += ' ORDER BY f.due_date DESC';

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching fees',
            error: error.message
        });
    }
};

exports.getFeesByStudent = async (req, res) => {
    try {
        const {
            studentId
        } = req.params;
        const [rows] = await db.execute('SELECT * FROM fees WHERE student_id = ? ORDER BY due_date DESC', [studentId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching student fees',
            error: error.message
        });
    }
};

exports.createFee = async (req, res) => {
    try {
        const {
            student_id,
            amount,
            type,
            due_date
        } = req.body;
        const {
            id: userId,
            role
        } = req.user;

        // If student, verify they are creating for themselves
        if (role === 'student') {
            const [student] = await db.execute('SELECT id FROM students WHERE user_id = ?', [userId]);
            if (!student.length || student[0].id !== Number(student_id)) {
                return res.status(403).json({
                    message: 'You can only generate invoices for yourself'
                });
            }
        }

        const [result] = await db.execute(
            'INSERT INTO fees (student_id, amount, type, due_date, status) VALUES (?, ?, ?, ?, ?)',
            [student_id, amount, type, due_date, 'pending']
        );
        res.status(201).json({
            id: result.insertId,
            message: 'Fee invoice created successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating fee invoice',
            error: error.message
        });
    }
};

exports.payFee = async (req, res) => {
    try {
        const {
            paid_date,
            transaction_id,
            payment_method,
            status // 'paid', 'partial'
        } = req.body;
        await db.execute(
            'UPDATE fees SET paid_date = ?, transaction_id = ?, payment_method = ?, status = ? WHERE id = ?',
            [paid_date, transaction_id, payment_method, status, req.params.id]
        );
        res.json({
            message: 'Fee payment recorded successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error recording fee payment',
            error: error.message
        });
    }
};

exports.getFeeByPaymentId = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT f.*, u.name as student_name, s.admission_no 
            FROM fees f
            JOIN students s ON f.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE f.id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Fee record not found'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching fee details',
            error: error.message
        });
    }
};

exports.deleteFee = async (req, res) => {
    try {
        await db.execute('DELETE FROM fees WHERE id = ?', [req.params.id]);
        res.json({
            message: 'Fee record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting fee record',
            error: error.message
        });
    }
};