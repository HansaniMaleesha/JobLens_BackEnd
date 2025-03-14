
// const mysql = require("mysql2/promise");  // Use mysql2/promise for promise-based queries

// // Create a pool (recommended for multiple queries and better performance)
// const db = mysql.createPool({
//     host: 'localhost',       // MySQL server host
//     user: 'root',            // MySQL username
//     password: 'Hana@0320',            // MySQL password
//     database: 'joblens_db'  // Your database name
// });

// // Test the connection (optional but useful for debugging)
// db.getConnection()
//     .then(() => console.log("✅ Connected to Local MySQL Database"))
//     .catch((err) => console.error("❌ MySQL connection error:", err));

// module.exports = db;

const mysql = require('mysql2')
require('dotenv').config();
// Create the connection to the database
const db = mysql.createConnection(process.env.DATABASE_URL);

// simple query
db.query('show tables', function (err, results, fields) {
    console.log(results) // results contains rows returned by server
    console.log(fields) // fields contains extra metadata about results, if available
})

// Example with placeholders
db.query('select 1 from dual where ? = ?', [1, 1], function (err, results) {
    console.log(results)
})

connection.end()

module.exports = db;
