require("dotenv").config();
const mysql = require("mysql2/promise");  // Use mysql2/promise for promise-based queries

// Create a pool (recommended for multiple queries and better performance)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Test the connection (optional but useful for debugging)
db.getConnection()
    .then(() => console.log("✅ Connected to Local MySQL Database"))
    .catch((err) => console.error("❌ MySQL connection error:", err));

module.exports = db;
