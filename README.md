# Bamazon

## Description

Bamazon implements a simple command line based storefront using the `NPM Inquirer Package` and `MySQL` along with the `NPM MySQL` package for the database backend. Three interfaces will be presented: **Customer** and  **Manager**.

### Customer Interface

Allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located and price. The user is then able to purchase one of the existing items by entering the item ID and the desired quantity. If the selected quantity is currently in stock, the user's order is fulfilled, displaying the total purchase price and updating the store database. If the desired quantity is not available, the user is prompted to modify their order.

      How to run
      
      * git clone [repo-name]
      * cd bamazon 
      * npm install
      * node bamazonCustomer.js

### Manager Interface

The manager interface presents a list of four options, as below. 

      ? Please select an option: (Use arrow keys)
      > View Products for Sale
        View Low Inventory
        Add to Inventory 
        Add New Products
 
The **View Products for Sale** option allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located, price, and the quantity available in stock. 

The **View Low Inventory** option shows the user the items which currently have fewer than 100 units available.

The **Add to Inventory** option allows the user to select a given item ID and add additional inventory to the target item.

The **Add New Product** option allows the user to enter details about a new product which will be entered into the database upon completion of the form.

      How to run
      
      * git clone [repo-name]
      * cd bamazon
      * npm install
      * node bamazonManager.js
      
### Screenshots

      Customer Interface
     

      Manager Interface
      
