const db = require('../config/db');

// Exams
exports.getAllExams = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM exams ORDER BY start_date DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching exams',
            error: error.message
        });
    }
};

exports.createExam = async (req, res) => {
    try {
        const {
            name,
            term,
            academic_year,
            start_date,
            end_date
        } = req.body;
        const [result] = await db.execute(
            'INSERT INTO exams (name, term, academic_year, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [name, term, academic_year, start_date, end_date]
        );
        res.status(201).json({
            id: result.insertId,
            name,
            term,
            academic_year,
            start_date,
            end_date
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating exam',
            error: error.message
        });
    }
};

exports.updateExam = async (req, res) => {
    try {
        const {
            name,
            term,
            academic_year,
            start_date,
            end_date
        } = req.body;
        await db.execute(
            'UPDATE exams SET name = ?, term = ?, academic_year = ?, start_date = ?, end_date = ? WHERE id = ?',
            [name, term, academic_year, start_date, end_date, req.params.id]
        );
        res.json({
            message: 'Exam updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating exam',
            error: error.message
        });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        await db.execute('DELETE FROM exams WHERE id = ?', [req.params.id]);
        res.json({
            message: 'Exam deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting exam',
            error: error.message
        });
    }
};

// Marks
exports.getMarksByExam = async (req, res) => {
    try {
        const {
            examId
        } = req.params;
        const query = `
            SELECT m.*, s.admission_no, u.name as student_name, sub.name as subject_name
            FROM marks m
            JOIN students s ON m.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN subjects sub ON m.subject_id = sub.id
            WHERE m.exam_id = ?
        `;
        const [rows] = await db.execute(query, [examId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching marks',
            error: error.message
        });
    }
};

exports.getStudentMarks = async (req, res) => {
    try {
        const {
            studentId
        } = req.params;
        const query = `
            SELECT m.*, e.name as exam_name, sub.name as subject_name
            FROM marks m
            JOIN exams e ON m.exam_id = e.id
            JOIN subjects sub ON m.subject_id = sub.id
            WHERE m.student_id = ?
        `;
        const [rows] = await db.execute(query, [studentId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching student marks',
            error: error.message
        });
    }
};

exports.upsertMarks = async (req, res) => {
    try {
        const {
            student_id,
            exam_id,
            subject_id,
            marks_obtained,
            total_marks,
            grade,
            comments
        } = req.body;

        // Check if marks already exist
        const [existing] = await db.execute(
            'SELECT id FROM marks WHERE student_id = ? AND exam_id = ? AND subject_id = ?',
            [student_id, exam_id, subject_id]
        );

        if (existing.length > 0) {
            await db.execute(
                'UPDATE marks SET marks_obtained = ?, total_marks = ?, grade = ?, comments = ? WHERE id = ?',
                [marks_obtained, total_marks, grade, comments, existing[0].id]
            );
            res.json({
                message: 'Marks updated successfully'
            });
        } else {
            const [result] = await db.execute(
                'INSERT INTO marks (student_id, exam_id, subject_id, marks_obtained, total_marks, grade, comments) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [student_id, exam_id, subject_id, marks_obtained, total_marks, grade, comments]
            );
            res.status(201).json({
                id: result.insertId,
                message: 'Marks added successfully'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error saving marks',
            error: error.message
        });
    }
};