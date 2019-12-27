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

// Get product data from db
function loadManagerMenu() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        loadManagerOptions(res);
    });
}

// Load manager options and pass product data from DB
function loadManagerOptions(products) {
    inquirer.prompt({
        type: "list",
        name: "choice",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Quit"
        ],
        message: "What would you like to do?"
    }).then(function(val) {
        switch (val.choice) {
            case "View Products for Sale":
                console.table(products);
                loadManagerMenu();
                break;
            case "View Low Inventory":
                loadLowInventory();
                break;
            case "Add to Inventory":
                addNewProduct(products);
                break;
            default:
                console.log("Goodbye!");
                process.exit(0);
                break;
        }
    });
}



