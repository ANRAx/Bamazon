
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
function promptCustomerForItem(inventory) {
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

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many " + product.productname + "(s) would you like? [Quit with Q]",
            validate: function(val) {
                return val > 0 || val.toLowerCase() === "q";
            }
        }
    ]).then(function(val) {
        // Check if the user wants to quit the program 
        checkIfShouldExit(val.quantity);
        let quantity = parseInt(val.quantity);

        // If there isn't enough of the chosen product and quantity, alert user and re-run LoadProducts
        if (quantity > product.stockquantity) {
            console.log("\nInsufficient quantity!");
            loadProducts();
        } else {
            makePurchase(product, quantity);
        }
    });
}

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {
    connection.query(
        "UPDATE products SET stockquantity = stockquantity - ?, productsales = productsales + ? WHERE itemid = ?",
        [quantity, product.price * quantity, product.itemid],
        function(err, res) {
            console.log("\nSuccessfully purchased " + quantity + " " + product.productname + "'s!");
            loadProducts();
        }
    );
}

// Check chosen product against inventory
function checkInventory(choiceId, inventory) {
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].itemid === choiceId) {
            // if a matching product is found, return the product
            return inventory[i];
        }
    }
    // Otherwise return null
    return null;
}

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
        // Log a message and exit the current node process
        console.log("Goodbye!");
        process.exit(0);
    }
}