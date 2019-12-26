require("dotenv").config();
// Initialize npm packages
let mysql = require("mysql");
let inquirer = require("inquirer");

// require("console.table");

// Initialize the connection (stored in a variable) to sync with a MySQL DB
let connection = mysql.createConnection({
    host: process.env.host,
    port: 3306,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database
});

// Create the connection with the server and load the product data on success
connection.connect(function(err) {
    if(err) throw err;
    console.log("Connection successful");
    
   
    // if (err) {
    //     console.error("error connecting: " + err.stack);
    // }
    // loadProducts();
});

