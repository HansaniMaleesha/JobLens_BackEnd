
const mysql = require("mysql2/promise");  // Use mysql2/promise for promise-based queries

// Create a pool (recommended for multiple queries and better performance)
const db = mysql.createPool({
    host: 'localhost',       // MySQL server host
    user: 'root',            // MySQL username
    password: 'Hana@0320',            // MySQL password
    database: 'joblens_db'  // Your database name
});

// Test the connection (optional but useful for debugging)
db.getConnection()
    .then(() => console.log("✅ Connected to Local MySQL Database"))
    .catch((err) => console.error("❌ MySQL connection error:", err));

module.exports = db;
