const db = require('../config/db');

// Books
exports.getAllBooks = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM books ORDER BY title');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching books',
            error: error.message
        });
    }
};

exports.createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            isbn,
            category,
            quantity,
            publisher,
            rack_number
        } = req.body;
        const [result] = await db.execute(
            'INSERT INTO books (title, author, isbn, category, quantity, available_quantity, publisher, rack_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, author, isbn, category, quantity, quantity, publisher, rack_number]
        );
        res.status(201).json({
            id: result.insertId,
            message: 'Book added successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding book',
            error: error.message
        });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const {
            title,
            author,
            isbn,
            category,
            quantity,
            available_quantity,
            publisher,
            rack_number
        } = req.body;
        await db.execute(
            'UPDATE books SET title = ?, author = ?, isbn = ?, category = ?, quantity = ?, available_quantity = ?, publisher = ?, rack_number = ? WHERE id = ?',
            [title, author, isbn, category, quantity, available_quantity, publisher, rack_number, req.params.id]
        );
        res.json({
            message: 'Book updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating book',
            error: error.message
        });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await db.execute('DELETE FROM books WHERE id = ?', [req.params.id]);
        res.json({
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting book',
            error: error.message
        });
    }
};

// Book Issuing
exports.issueBook = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const {
            book_id,
            student_id,
            issue_date,
            due_date
        } = req.body;

        // Check availability
        const [books] = await connection.execute('SELECT available_quantity FROM books WHERE id = ?', [book_id]);
        if (books.length === 0 || books[0].available_quantity <= 0) {
            await connection.rollback();
            return res.status(400).json({
                message: 'Book not available'
            });
        }

        // Issue book
        await connection.execute(
            'INSERT INTO book_issues (book_id, student_id, issue_date, due_date) VALUES (?, ?, ?, ?)',
            [book_id, student_id, issue_date, due_date]
        );

        // Update book availability
        await connection.execute('UPDATE books SET available_quantity = available_quantity - 1 WHERE id = ?', [book_id]);

        await connection.commit();
        res.status(201).json({
            message: 'Book issued successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error issuing book',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

exports.returnBook = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const {
            issueId,
            return_date,
            fine_amount
        } = req.body;

        // Get issue details
        const [issues] = await connection.execute('SELECT book_id FROM book_issues WHERE id = ?', [issueId]);
        if (issues.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: 'Issue record not found'
            });
        }
        const bookId = issues[0].book_id;

        // Update issue record
        await connection.execute(
            'UPDATE book_issues SET return_date = ?, fine_amount = ?, status = ? WHERE id = ?',
            [return_date, fine_amount, 'returned', issueId]
        );

        // Update book availability
        await connection.execute('UPDATE books SET available_quantity = available_quantity + 1 WHERE id = ?', [bookId]);

        await connection.commit();
        res.json({
            message: 'Book returned successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error returning book',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

exports.getAllIssuedBooks = async (req, res) => {
    try {
        const query = `
            SELECT bi.*, b.title as book_title, u.name as student_name, s.admission_no
            FROM book_issues bi
            JOIN books b ON bi.book_id = b.id
            JOIN students s ON bi.student_id = s.id
            JOIN users u ON s.user_id = u.id
            ORDER BY bi.issue_date DESC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching issued books',
            error: error.message
        });
    }
};