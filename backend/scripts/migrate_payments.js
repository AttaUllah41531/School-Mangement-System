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
        console.log('Starting payments table migration...');

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS payments (
                id VARCHAR(36) PRIMARY KEY,
                fee_id INT,
                method ENUM('easypaisa', 'jazzcash', 'bank', 'cash') NOT NULL,
                transaction_ref VARCHAR(255) UNIQUE,
                amount DECIMAL(10, 2) NOT NULL,
                status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
                gateway_response TEXT,
                received_by VARCHAR(255),
                screenshot_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (fee_id) REFERENCES fees(id) ON DELETE CASCADE
            )
        `);
        console.log('Successfully created payments table.');

    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await connection.end();
        process.exit();
    }
};

migrate();