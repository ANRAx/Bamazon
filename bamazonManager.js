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
                addToInventory(products);
                break;
            case "Add New Product":
                addNewProduct(products);
                break;
            default:
                console.log("Goodbye!");
                process.exit(0);
                break;
        }
    });
}

// Query DB for low inventory products
function loadLowInventory() {
    // Select all of the produycts that have a quantity of 5 or less
    connection.query("SELECT * FROM products WHERE stockquantity <=5",
    function(err, res) {
        if (err) throw err;
        // Draw table in terminal with response and load manager menu
        console.table(res);
        loadManagerMenu();
    });
}

// Prompt the manager for a product to replenish 
function addToInventory(inventory) {
    console.table(inventory);
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "What is the ID of the item you would like to add to?",
            validate: function(val) {
                return !isNaN(val);
            }
        }
    ]).then(function(val) {
        let choiceId = parseInt(val.choice);
        let product = checkInventory(choiceId, inventory);

        // If a product can be found with the choice id pass chosen product to promptCustomerForQuantity else let the user know and reload the managermenu
        if (product) {
            promptManagerForQuantity(product);
        } else {
            console.log("\nThat item is not in the inventory.");
            loadManagerMenu();
        }
    });
}

// Ask for the quantity that should be added to the chosen product
function promptManagerForQuantity(product) {
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to add?",
            validate: function(val) {
                return val > 0;
            }
        }
    ]).then(function(val) {
        let quantity = parseInt(val.quantity);
        addQuantity(product, quantity);
    });
}

// Adds chosen quantity to specified product
function addQuantity(product, quantity) {
    connection.query(
        "UPDATE products SET stockquantity = ? Where itemid = ?",
        [product.stockquantity + quantity, product.itemid],
        function(err, res) {
            // let the user know the purchase was successful, re-run loadProducts
            console.log("\nSuccessfully added " + quantity + " " + product.productname + "'s\n");
            loadManagerMenu();
        }
    );
}

// Gets all departments, then gets the new product info and inserts the new product into DB
function addNewProduct() {
    getDepartments(function(err, departments) {
        getProductInfo(departments).then(insertNewProduct);
    });
}

// Prompts manager for new product info, then adds new product
function getProductInfo(departments) {
    return inquirer.prompt([
        {
            type: "input",
            name: "productname",
            message: "What is the name of the product you would like to add?"
        },
        {
            type: "list",
            name: "departmentname",
            choices: getDepartmentNames(departments),
            message: "Which department does this product fall into?"
        },
        {
            type: "input",
            name: "price",
            message: "How much does it cost?",
            validate: function(val) {
                return val > 0;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many do we have?",
            validate: function(val) {
                return !isNaN(val);
            }
        }
    ]);
}

// adds new product to the db
function insertNewProduct(val) {
    connection.query(
        "INSERT INTO products (productname, departmentname, price, stockquantity) VALUES (?, ?, ?, ?)",
        [val.productname, val.departmentname, val.price, val.quantity],
        function(err, res) {
            if (err) throw err;
            console.log(val.productname + " ADDED TO BAMAZON!\n");
            // When done, rerun loadManagerMenu to restart app
            loadManagerMenu();
        }
    );
}

// Gets all of the departments and runs a callback function when done 
function getDepartments(cb) {
    connection.query("SELECT * FROM departments", cb);
}

// Is passed an array of departments from the db and returns an array of ONLY dept names
function getDepartmentNames(departments) {
    return departments.map(function(department) {
        return department.departmentname;
    });
}

// Check to see if the product the user chose exists int he inventory 
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