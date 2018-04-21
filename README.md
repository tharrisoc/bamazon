# bamazon
An Amazon-like storefront implemented using node and MySQL.

### About bamazonCustomer.js
When the user runs this script, it will display the current inventory of the store. 

The customer is then asked which product he/she would like to order. The customer is then asked the quantity of the product that should be ordered. These two input values are checked to make sure that they are positive integers. If either input value is not a positive integer, an appropriate error message is displayed. 

If both input values are valid, the script then retrieves the row for the product from the database. If the quantity of the product that the customer wants to purchase exceeds the number of that item that is in stock, an appropriate error message is displayed.

If there is enough inventory to satisfy the customer's request, the quantity that is being ordered is subtracted from the quantity in the inventory, and the updated inventory size is written back to the database. A confirmation message is displayed for the customer, showing the name of the product, the quantity ordered, the unit price of the product and the final total.

### Dependencies
This script requires the following npm packages:

* mysql
* inquirer
* accounting

### How to Run This Script
Enter the following at the command line of your terminal or shell:  ``node bamazonCustomer.js``

### Screenshots
The set of screenshots shown below document the use of this script, starting with the creation and populating of the products table. Each state that the customer can be in is shown.

Hover over a screenshot to see a summary of its contents.

![Screenshot showing the contents of initDB.sql](screenshots/ScreenShot001.png "initDB.sql -- Automates creation of the products table")

![Screenshot showing the creation and populating of the products table](screenshots/ScreenShot002.png "Creation/Populating of products Table")

![Screenshot showing the initial state of the products table](screenshots/ScreenShot003.png "Initial State of products Table")

![Screenshot showing an order that cannot be fulfilled because of insufficient stock](screenshots/ScreenShot004.png "Order Cannot be Fulfilled Because of Insufficient Stock")

![Screenshot showing invalid Item ID entry](screenshots/ScreenShot005.png "Customer Has Entered an Invalid Item ID")

![Screenshot showing invalid quantity entry](screenshots/ScreenShot006.png "Customer Has Entered an Invalid Quantity")

![Screenshot showing the product record before a successful purchase](screenshots/ScreenShot007.png "State of ID 5 Before Successful Purchase")

![Screenshot showing a successful purchase](screenshots/ScreenShot008.png "A Purchase of Item ID 5 Has Been Successful")

![Screenshot showing the product record after a successful purchase](screenshots/ScreenShot009.png "State of ID 5 After Successful Purchase")

### About bamazonManager.js

This script provides a Manager view of the store. To run the script, simply type:  ``node bamazonManger.js``.

### Dependencies
This script requires the following npm packages:

* mysql
* inquirer
* accounting
* sqlstring


##### Manager's Menu #####
You will be presented with a menu of the available operations.

![Screenshot showing the Manager's menu](screenshots/ScreenShot010.png "Manager's Menu")

Make a selection by following the directions on the screen.

##### View Products for Sale #####

If you choose *View Products for Sale*, a table of all of the products in the inventory will be displayed. **[Note that currently there is a slight bug in the way that the table is displayed.]** 

![Screenshot showing all of the products in the inventory](screenshots/ScreenShot011.png "Table of all the prodcts available for sale")

##### View Low Inventory #####

If you choose *View Low Inventory*, a table containing those products whose inventory count is less than five will be displayed. If there are no such products, the message "There are currently no products for which there are less than five in stock." will be displayed.

![Screenshot showing no low inventory status](screenshots/ScreenShot012.png "There is no product with an inventory count of less than five")

![Screenshot showing products with low inventory status](screenshots/ScreenShot013.png "There are two products that need to be reordered")

##### Add to Inventory #####
 
If you choose *Add to Inventory*, you will be prompted for the item_id of the product and the number of items of that product that are being added to the inventory.

![Screenshot showing Add to Inventory Error Messages](screenshots/ScreenShot014.png "Error checking for the Add to Inventory command")

![Screenshot showing ID 5 BEFORE Add to Inventory](screenshots/ScreenShot015.png "Error checking for the Add to Inventory command")

![Screenshot showing ID 5 DURING Add To Inventory](screenshots/ScreenShot016.png "Run Add to Inventory command")

![Screenshot showing ID 5 AFTER Add To Inventory](screenshots/ScreenShot017.png "Run Add to Inventory command")

##### Add New Product #####

If you choose *Add New Product*, you will be prompted to enter the Product Name, Department, price and initial stock quantity. If errors are detected in the Manager's input, appropriate error messages are displayed.

A confirmation message is displayed if the product is actually added to the database.

![Screenshot showing Add New Product error messages](screenshots/ScreenShot018.png "All errors are detected at one time")

![Screenshot showing a successful product add](screenshots/ScreenShot019.png "Successful Product Add")

![Screenshot showing that the new product has been added](screenshots/ScreenShot020.png "The new product has been added as item_id 12")

![Screenshot showing correction of product spelling error](screenshots/ScreenShot021.png "The name of the new product has been corrected")
