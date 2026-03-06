const db = require('../config/db');
const fs = require('fs');

async function debug() {
    try {
        const [rows] = await db.execute('DESCRIBE students');
        fs.writeFileSync('table_structure.json', JSON.stringify(rows, null, 2));
        console.log('Table structure saved to table_structure.json');
        process.exit(0);
    } catch (error) {
        console.error('Debug failed:', error);
        process.exit(1);
    }
}

debug();