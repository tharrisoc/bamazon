'use strict';
var mysql      = require('mysql');
var inquirer   = require('inquirer');
var accounting = require('accounting');
var formatter  = require('./JSONToTable.js');

var resultSet;
var connection;
const ALL_PRODUCT_COLUMN_QUERY = "SELECT * FROM products";
const ALL_DEPARTMENT_QUERY     = "SELECT * FROM departments";
const ALL_PRODUCT_SALE_QUERY   = "SELECT item_id, product_name, price FROM products";
const PRODUCT_CHECK_QUERY      = "SELECT item_id, department_name, price, " 
                                      + "stock_quantity, product_name FROM products "
                                      + "WHERE ?";
const PRODUCT_SALE_QUERY       = "UPDATE products SET ? WHERE ?";

connection = mysql.createConnection({
    host: "localhost",
    user: "tom",
    password: "J2MeDev",
    database: "bamazon"
});

// Note: errors will be "handled" by displaying the text that is associated
//       with the error, and then passing the error object up the call stack
//       to determine whether there is any other stack frame that actually
//       wants to handle the error

connection.connect(function(err) {
  if (err) {
    console.log(err.message);
    throw err;
  }

  console.log("Connected!");

  // Display all of the products available for sale (item_id, product_name, price)
  //   Then take the user's order,
  //     Then attempt to fullfill the order
  displayAllProducts()
});

function displayAllProducts() {
  connection.query(
     ALL_PRODUCT_SALE_QUERY,
     function(err, res, fields) {
       if (err) {
         console.log(err.message);
         connection.end();
         throw err;
       }

       var tableString = formatter.format(res, fields);
       console.log(tableString);

       takeOrder();
     });
}

function takeOrder() {
  inquirer.prompt([
    {
      name: "productID",
      message: "What is the ID of the product that you would like to order?"
    }, {
      name: "numberOfUnits",
      message: "How many units of the product would you like to order?"
    }
  ]).then(function(answers) {
       var idCheck = Number(answers.productID);
       var qCheck  = Number(answers.numberOfUnits);
       var regexp = /^\d+$/;

       if (isNaN(idCheck) || !regexp.test(answers.productID) || (idCheck === 0) ) {
         console.log('The ID must be a whole number between 1 and the highest number shown above under item_id.');
         connection.end();
         process.exit()
       }

       if (isNaN(qCheck) || !regexp.test(answers.numberOfUnits) || (qCheck === 0 ) ) {
         console.log('The number of units must be a whole number that is 1 or greater.');
         connection.end();
         process.exit();
       }

       connection.query(
         PRODUCT_CHECK_QUERY,
         {
           item_id : answers.productID 
         },
         function(err, res, fields) {
           if (err) {
             console.log(err.message);
             connection.end();
             throw err;
            }

            var item_id = res[0]['item_id'];
            var price   = res[0]['price'];
            var inStock = res[0]['stock_quantity'];
            var product = res[0]['product_name'];

            if ( (inStock - qCheck) < 0 ) {
              console.log("There is insufficient quantity in stock to fulfill your order.");
              connection.end();
              process.exit();
            }

            placeOrder(item_id, qCheck, price, inStock, product);
         }
       );
  });
}

function placeOrder(id, quantity, price, inStock, product) {
  var newInStock = inStock - quantity;

  connection.query(
    PRODUCT_SALE_QUERY,
    [
      {
        stock_quantity : newInStock,
      },
      {
        item_id : id
      }
    ],
    function(err, res) {
      if (err) {
        console.log(err.message);
        connection.end();
        throw err;
      }

      console.log('Your order has been placed successfully.');
      console.log('You have ordered ' + quantity + ' ' + product);
      console.log('Unit price is ' + accounting.formatMoney(price));
      console.log('Total order price is ' + accounting.formatMoney( (quantity * price) ));
      connection.end();
    }
  );
}
