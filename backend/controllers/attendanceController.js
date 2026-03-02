const db = require('../config/db');

exports.getAttendanceByClassAndDate = async (req, res) => {
    try {
        const {
            class_id,
            section_id,
            date
        } = req.query;

        // Get all students in this class/section
        const [students] = await db.execute(`
            SELECT s.id, u.name, u.email, s.admission_no 
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.class_id = ? AND s.section_id = ?
        `, [class_id, section_id]);

        // Get attendance for these students on this date
        const [attendance] = await db.execute(`
            SELECT student_id, status, remarks 
            FROM attendance 
            WHERE date = ? AND student_id IN (
                SELECT id FROM students WHERE class_id = ? AND section_id = ?
            )
        `, [date, class_id, section_id]);

        // Map attendance to students
        const attendanceMap = attendance.reduce((acc, curr) => {
            acc[curr.student_id] = {
                status: curr.status,
                remarks: curr.remarks
            };
            return acc;
        }, {});

        const studentsWithAttendance = students.map(student => ({
            ...student,
            attendance: attendanceMap[student.id] || {
                status: null,
                remarks: ''
            }
        }));

        res.json(studentsWithAttendance);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching attendance',
            error: error.message
        });
    }
};

exports.markAttendance = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const {
            date,
            attendanceData
        } = req.body; // attendanceData: [{student_id, status, remarks}]

        for (const record of attendanceData) {
            // Check if attendance already exists for this student and date
            const [existing] = await connection.execute(
                'SELECT id FROM attendance WHERE student_id = ? AND date = ?',
                [record.student_id, date]
            );

            if (existing.length > 0) {
                // Update
                await connection.execute(
                    'UPDATE attendance SET status = ?, remarks = ? WHERE id = ?',
                    [record.status, record.remarks || '', existing[0].id]
                );
            } else {
                // Insert
                await connection.execute(
                    'INSERT INTO attendance (student_id, date, status, remarks) VALUES (?, ?, ?, ?)',
                    [record.student_id, date, record.status, record.remarks || '']
                );
            }
        }

        await connection.commit();
        res.json({
            message: 'Attendance marked successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error marking attendance',
            error: error.message
        });
    } finally {
        connection.release();
    }
};