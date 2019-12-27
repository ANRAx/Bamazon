// Initialize npm packages
require("dotenv").config();
let mysql = require("mysql");
let inquirer = require("inquirer");
require("console.table");
// console.log("PROCESS IS: ", process)
// console.log({ env: process.env})
// Initialize the connection (stored in a variable) to sync with a MySQL DB
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATA
});

// Create the connection with the server and load the product data on success
connection.connect(function(err) {
    // if(err) throw err;
    // console.log("Connection successful");
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    loadManagerMenu();
});