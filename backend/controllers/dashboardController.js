const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        // 1. Total Students
        const [
            [{
                count: studentCount
            }]
        ] = await db.execute('SELECT COUNT(*) as count FROM students');

        // 2. Total Teachers
        const [
            [{
                count: teacherCount
            }]
        ] = await db.execute('SELECT COUNT(*) as count FROM teachers');

        // 3. Enrollment Trends (Last 6 months)
        const [enrollmentTrends] = await db.execute(`
            SELECT 
                DATE_FORMAT(admission_date, '%b') as name, 
                COUNT(*) as students 
            FROM students 
            WHERE admission_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY name
            ORDER BY MIN(admission_date)
        `);

        // 4. Role Distribution
        const [roleDistribution] = await db.execute('SELECT role as name, COUNT(*) as value FROM users GROUP BY role');

        res.json({
            totalStudents: studentCount,
            totalTeachers: teacherCount,
            dailyAttendance: '94.2%', // Placeholder for now
            totalRevenue: '$42,500', // Placeholder for now
            enrollmentTrends: enrollmentTrends.length > 0 ? enrollmentTrends : [{
                    name: 'Mon',
                    students: 0
                },
                {
                    name: 'Tue',
                    students: 0
                },
                {
                    name: 'Wed',
                    students: 0
                },
                {
                    name: 'Thu',
                    students: 0
                },
                {
                    name: 'Fri',
                    students: 0
                },
            ],
            attendanceRate: [{
                    name: 'Jan',
                    value: 92
                },
                {
                    name: 'Feb',
                    value: 88
                },
                {
                    name: 'Mar',
                    value: 95
                },
                {
                    name: 'Apr',
                    value: 91
                },
                {
                    name: 'May',
                    value: 94
                },
            ]
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};