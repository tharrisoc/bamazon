# bamazon
An Amazon-like storefront implemented using node and MySQL.

### About This Script
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

`![Screenshot showing the contents of initDB.sql] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot001.png)`

`![Screenshot showing the creation and populating of the products table] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot002.png)`

`![Screenshot showing the initial state of the products table] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot003.png)`

`![Screenshot showing an order that cannot be fulfilled because of insufficient stock] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot004.png)`

`![Screenshot showing invalid Item ID entry] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot005.png)`

`![Screenshot showing invalid quantity entry] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot006.png)`

`![Screenshot showing the product record before a successful purchase] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot007.png)`

`![Screenshot showing a successful purchase] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot008.png)`

`![Screenshot showing the product record after a successful purchase] (https://github.com/tharrisoc/bamazon/screenshots/ScreenShot009.png)`



