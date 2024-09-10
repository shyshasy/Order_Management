const mysql = require('mysql2/promise');

// Create the connection pool with a higher connection limit
const connPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "shyshamoi",
  database: "abc_database",
  waitForConnections: true,
  port: 3306,
  connectionLimit: 20, 
  connectTimeout: 60000
  
});

// Test the connection pool
// async function testConnection() {
//   try {
//     const connection = await connPool.getConnection();
//     console.log("Connected to the database!");
//     connection.release(); // Important to release the connection back to the pool
//   } catch (error) {
//     console.error("Error connecting to the database:", error.message);
//   }
// }

// // Test the connection when the module is loaded
// testConnection();

module.exports = connPool;
