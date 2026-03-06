const mysql = require('mysql2/promise');
require('dotenv').config();

const migrate = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'school_db'
    });

    try {
        console.log('Starting migration...');

        // Check if column exists
        const [columns] = await connection.execute('SHOW COLUMNS FROM fees LIKE "payment_method"');

        if (columns.length === 0) {
            await connection.execute(`
                ALTER TABLE fees 
                ADD COLUMN payment_method ENUM('cash', 'bank', 'easypaisa', 'jazzcash') DEFAULT NULL
                AFTER transaction_id
            `);
            console.log('Successfully added payment_method column to fees table.');
        } else {
            console.log('payment_method column already exists.');
        }

    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await connection.end();
        process.exit();
    }
};

migrate();