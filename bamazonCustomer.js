require("dotenv").config();
// Initialize npm packages
let mysql = require("mysql");
let inquirer = require("inquirer");

// require("console.table");

// Initialize the connection (stored in a variable) to sync with a MySQL DB
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Dharma4321420!",
    database: "bamazon"
});

// Create the connection with the server and load the product data on success
connection.connect(function(err) {
    // if(err) throw err;
    // console.log("Connection successful");
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    loadProducts();
});

// Func to load products table from DB and print results to console  
function loadProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Draw table in terminal using reponse
    console.table(res);
    // Promp user for their choise of product(pass all products to promptCustomerForItem)
    promptCustomerForItem(res);
  });  
}

// Func to prompt the customer for product ID 
function promptCustomer(inventory) {
    // use inquirerr package to ask user what they want to purchase
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "What is the ID of the item you would like to purchase? [Quit with Q]",
            validate: function(val) {
                return !isNaN(val) || val.toLowerCase() === "q";
            }
        }
    ]).then(function(val) {
        // Check if the user want to quit the program
        checkIfShouldExit(val.choice);
        let choiceId = parseInt(val.choice);
        let product = checkInventory(choiceId, inventory);

        // If there is a product with the user chosen id, prompt user for a desired quantity
        if (product) {
            promptCustomerForQuantity(product);
        } else {
            console.log("\nThat item is not in the inventory.");
            loadProducts();
        }
    });
}