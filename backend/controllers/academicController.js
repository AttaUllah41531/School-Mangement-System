const db = require('../config/db');

// Classes
exports.getAllClasses = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM classes ORDER BY name');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching classes',
            error: error.message
        });
    }
};

exports.createClass = async (req, res) => {
    try {
        const {
            name,
            description
        } = req.body;
        const [result] = await db.execute(
            'INSERT INTO classes (name, description) VALUES (?, ?)',
            [name, description]
        );
        res.status(201).json({
            id: result.insertId,
            name,
            description
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating class',
            error: error.message
        });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const {
            name,
            description
        } = req.body;
        await db.execute(
            'UPDATE classes SET name = ?, description = ? WHERE id = ?',
            [name, description, req.params.id]
        );
        res.json({
            message: 'Class updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating class',
            error: error.message
        });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        await db.execute('DELETE FROM classes WHERE id = ?', [req.params.id]);
        res.json({
            message: 'Class deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting class',
            error: error.message
        });
    }
};

// Sections
exports.getAllSections = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT s.*, c.name as class_name 
            FROM sections s 
            JOIN classes c ON s.class_id = c.id 
            ORDER BY c.name, s.name
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching sections',
            error: error.message
        });
    }
};

exports.createSection = async (req, res) => {
    try {
        const {
            class_id,
            name
        } = req.body;
        const [result] = await db.execute(
            'INSERT INTO sections (class_id, name) VALUES (?, ?)',
            [class_id, name]
        );
        res.status(201).json({
            id: result.insertId,
            class_id,
            name
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating section',
            error: error.message
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const {
            class_id,
            name
        } = req.body;
        await db.execute(
            'UPDATE sections SET class_id = ?, name = ? WHERE id = ?',
            [class_id, name, req.params.id]
        );
        res.json({
            message: 'Section updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating section',
            error: error.message
        });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        await db.execute('DELETE FROM sections WHERE id = ?', [req.params.id]);
        res.json({
            message: 'Section deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting section',
            error: error.message
        });
    }
};

// Subjects
exports.getAllSubjects = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM subjects ORDER BY name');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching subjects',
            error: error.message
        });
    }
};

exports.createSubject = async (req, res) => {
    try {
        const {
            name,
            code,
            type
        } = req.body;
        const [result] = await db.execute(
            'INSERT INTO subjects (name, code, type) VALUES (?, ?, ?)',
            [name, code, type]
        );
        res.status(201).json({
            id: result.insertId,
            name,
            code,
            type
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating subject',
            error: error.message
        });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const {
            name,
            code,
            type
        } = req.body;
        await db.execute(
            'UPDATE subjects SET name = ?, code = ?, type = ? WHERE id = ?',
            [name, code, type, req.params.id]
        );
        res.json({
            message: 'Subject updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating subject',
            error: error.message
        });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await db.execute('DELETE FROM subjects WHERE id = ?', [req.params.id]);
        res.json({
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting subject',
            error: error.message
        });
    }
};