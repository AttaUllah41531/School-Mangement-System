const db = require('../config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        console.log('Starting seeding...');

        // 1. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);

        await db.execute(
            'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin User', 'admin@school.com', adminPassword, 'admin']
        );
        console.log('Admin user created');

        // 2. Create Classes
        const classes = ['Class 10', 'Class 11', 'Class 12'];
        for (const cls of classes) {
            await db.execute('INSERT IGNORE INTO classes (name) VALUES (?)', [cls]);
        }
        console.log('Classes created');

        // 3. Create Sections
        const [rows] = await db.execute('SELECT id FROM classes');
        for (const row of rows) {
            await db.execute('INSERT IGNORE INTO sections (class_id, name) VALUES (?, ?)', [row.id, 'Section A']);
            await db.execute('INSERT IGNORE INTO sections (class_id, name) VALUES (?, ?)', [row.id, 'Section B']);
        }
        console.log('Sections created');

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();