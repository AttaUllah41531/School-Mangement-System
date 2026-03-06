const db = require('../config/db');

async function migrate() {
    try {
        console.log('🔄 Starting Student Migration...');

        // Add phone number to students
        console.log('Adding Phone Number column...');
        try {
            await db.execute('ALTER TABLE students ADD COLUMN phone VARCHAR(20) AFTER admission_no');
        } catch (err) {
            console.log('⚠️ Phone Number column might already exist.');
        }

        // Add parent details to students
        console.log('Adding Parent details columns...');
        try {
            await db.execute('ALTER TABLE students ADD COLUMN parent_name VARCHAR(100) AFTER phone');
        } catch (err) {
            console.log('⚠️ parent_name column might already exist.');
        }

        try {
            await db.execute('ALTER TABLE students ADD COLUMN parent_phone VARCHAR(20) AFTER parent_name');
        } catch (err) {
            console.log('⚠️ parent_phone column might already exist.');
        }

        try {
            await db.execute('ALTER TABLE students ADD COLUMN occupation VARCHAR(255) AFTER parent_phone');
        } catch (err) {
            console.log('⚠️ occupation column might already exist.');
        }

        console.log('✅ Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();