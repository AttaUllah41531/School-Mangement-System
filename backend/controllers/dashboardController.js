const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const {
            id: userId,
            role
        } = req.user;

        if (role === 'student') {
            // Fetch student_id first
            const [students] = await db.execute('SELECT id FROM students WHERE user_id = ?', [userId]);
            if (students.length === 0) return res.status(404).json({
                message: 'Student details not found'
            });
            const studentId = students[0].id;

            // 1. Pending Fees
            const [
                [{
                    totalPending
                }]
            ] = await db.execute(
                'SELECT SUM(amount) as totalPending FROM fees WHERE student_id = ? AND status != "paid"',
                [studentId]
            );

            // 2. Attendance Stats
            const [
                [{
                    totalDays
                }]
            ] = await db.execute(
                'SELECT COUNT(*) as totalDays FROM attendance WHERE student_id = ?',
                [studentId]
            );
            const [
                [{
                    presentDays
                }]
            ] = await db.execute(
                'SELECT COUNT(*) as presentDays FROM attendance WHERE student_id = ? AND status = "present"',
                [studentId]
            );
            const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '0';

            // 3. Upcoming Exams
            const [
                [{
                    examCount
                }]
            ] = await db.execute(
                'SELECT COUNT(*) as examCount FROM exams WHERE start_date >= CURDATE()'
            );

            // 5. Attendance Trend (Last 5 days)
            const [attendanceTrend] = await db.execute(`
                SELECT 
                    DATE_FORMAT(date, '%a') as name,
                    CASE WHEN status = "present" THEN 100 ELSE 0 END as value
                FROM attendance 
                WHERE student_id = ? 
                ORDER BY date DESC 
                LIMIT 5
            `, [studentId]);

            // 6. Performance Trend (Last 5 Exams)
            const [performanceTrends] = await db.execute(`
                SELECT 
                    e.name,
                    ROUND(AVG((m.marks_obtained / m.total_marks) * 100), 1) as value
                FROM marks m
                JOIN exams e ON m.exam_id = e.id
                WHERE m.student_id = ?
                GROUP BY e.id
                ORDER BY e.start_date DESC
                LIMIT 5
            `, [studentId]);

            // 4. Library Books (Placeholder for now)
            const libraryBooks = 0;

            return res.json({
                role: 'student',
                pendingFees: totalPending || 0,
                attendanceRate: `${attendanceRate}%`,
                upcomingExams: examCount,
                libraryBooks: libraryBooks,
                attendanceTrend: attendanceTrend.reverse(),
                performanceTrends: performanceTrends.reverse()
            });
        }

        // Admin Stats (Original logic)
        const [
            [{
                count: studentCount
            }]
        ] = await db.execute('SELECT COUNT(*) as count FROM students');
        const [
            [{
                count: teacherCount
            }]
        ] = await db.execute('SELECT COUNT(*) as count FROM teachers');

        const [
            [{
                count: totalAttendancePresent
            }]
        ] = await db.execute(
            'SELECT COUNT(*) as count FROM attendance WHERE date = CURDATE() AND status = "present"'
        );
        const attendanceRateAdmin = studentCount > 0 ? ((totalAttendancePresent / studentCount) * 100).toFixed(1) : '0';

        const [
            [{
                total: revenueMonth
            }]
        ] = await db.execute(
            'SELECT SUM(amount) as total FROM fees WHERE status = "paid" AND MONTH(paid_date) = MONTH(CURDATE())'
        );

        const [enrollmentTrends] = await db.execute(`
            SELECT 
                DATE_FORMAT(admission_date, '%b') as name, 
                COUNT(*) as students 
            FROM students 
            WHERE admission_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY name
            ORDER BY MIN(admission_date)
        `);

        res.json({
            role: 'admin',
            totalStudents: studentCount,
            totalTeachers: teacherCount,
            dailyAttendance: `${attendanceRateAdmin}%`,
            totalRevenue: revenueMonth || 0,
            enrollmentTrends: enrollmentTrends.length > 0 ? enrollmentTrends : [{
                    name: 'Jan',
                    students: 0
                },
                {
                    name: 'Feb',
                    students: 0
                },
                {
                    name: 'Mar',
                    students: 0
                },
                {
                    name: 'Apr',
                    students: 0
                },
                {
                    name: 'May',
                    students: 0
                },
            ],
            attendanceTrend: [{
                    name: 'Mon',
                    value: 92
                },
                {
                    name: 'Tue',
                    value: 88
                },
                {
                    name: 'Wed',
                    value: 95
                },
                {
                    name: 'Thu',
                    value: 91
                },
                {
                    name: 'Fri',
                    value: 94
                },
            ]
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};