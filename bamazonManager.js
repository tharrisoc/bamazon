'use strict';

var mysql      = require('mysql');
var inquirer   = require('inquirer');
var accounting = require('accounting');
var SQLString  = require('sqlstring');
var formatter  = require('./JSONToTable.js');

var connection;

var connection;

connection = mysql.createConnection({
    host: "localhost",
    user: "tom",
    password: "J2MeDev",
    database: "bamazon"
});

connection.connect(function(err) {
  if (err) {
    console.log(err.message);
    throw err;
  }

  console.log("Connected!");

  // List a set of menu options and perform the operation
  // indicated by the manager's selection
  doManagerOperations();
});

function doManagerOperations() {
  inquirer.prompt([
    {
      message: "What operation do you want to perform?"
             + "\n  (use Up/Down arrow keys to make a selection"
             + "\n  then, press Enter)",
      type: "list",
      name: "operation",
      choices: ["View Products for Sale", "View Low Inventory",
                "Add to Inventory", "Add New Product"]
    }
  ]).then(function(answer) {
            var selection = answer.operation;
            switch (selection) {
              case "View Products for Sale" :
                viewProductsForSale();
                break;

              case "View Low Inventory" :
                viewLowInventory();
                break;

              case "Add to Inventory" :
                addToInventory();
                break;

              case "Add New Product" :
                addNewProduct();
                break;

              default:
                console.log("Control should never get here.");
                connection.end();
                process.exit();
            }
          }
     )
}

function viewProductsForSale() {
  const VIEW_PRODUCTS_QUERY = 
    "SELECT item_id, product_name, price, stock_quantity FROM products";

  connection.query(
    VIEW_PRODUCTS_QUERY,
    function(err, res, fields) {
      if ( err)  {
        console.log(err.message);
        connection.end();
        throw err;
      }

      var tableString = formatter.format(res, fields);
      console.log(tableString);
      connection.end();
      process.exit();
    });
}

function viewLowInventory() {
  const VIEW_LOW_INVENTORY_QUERY =
    "SELECT item_id, product_name, price, stock_quantity FROM products"
 + " WHERE stock_quantity < 5";

  connection.query(
    VIEW_LOW_INVENTORY_QUERY,
    function(err, res, fields) {
      if ( err)  {
        console.log(err.message);
        connection.end();
        throw err;
      }

      if ((res === undefined) || (res === null ) || (res.length <= 0)) {
        console.log("There are currently no products for which there"
                  + "\nare less than five in stock.\n");
      } else{
        var tableString = formatter.format(res, fields);
        console.log(tableString);
      }

      connection.end();
      process.exit();
    });
}

function addToInventory() {
  const GET_QUANTITY_QUERY =
    "SELECT item_id, product_name, stock_quantity FROM products WHERE ?";

  inquirer.prompt([
    {
      name: "productID",
      message: "What is the ID of the product that you would like to update?"
    }, {
      name: "quantityToAdd",
      message: "How many units of the product would you like to add?"
    }
  ]) .then(function(answers) {
        var idCheck = Number(answers.productID);
        var qCheck  = Number(answers.quantityToAdd);
        var regexp = /^\d+$/;

        if (isNaN(idCheck) || !regexp.test(answers.productID) || (idCheck === 0) ) {
          console.log('The ID must be a whole number between 1 and the highest item_id in the table.');
          connection.end();
          process.exit()
        }
   
        if (isNaN(qCheck) || !regexp.test(answers.quantityToAdd) || (qCheck === 0 ) ) {
          console.log('The quantity to add must be a whole number that is 1 or greater.');
          connection.end();
          process.exit();
        }

        connection.query(
          GET_QUANTITY_QUERY,
          {
            item_id : answers.productID
          },
          function(err, res, fields) {
            if (err) {
              console.log(err.message);
              throw err;
            }

            var productName = res[0]['product_name'];
            var item_id = res[0]['item_id'];
            var inStock = res[0]['stock_quantity'];

            updateQuantity(item_id, inStock, qCheck, productName);
          }
        );
  });
}

function updateQuantity(item_id, oldQuantity, quantityToAdd, productName) {
  const UPDATE_ITEM_QUANTITY_QUERY = "UPDATE products SET ? WHERE ?";
  var newQuantity = oldQuantity + quantityToAdd;

  connection.query(
    UPDATE_ITEM_QUANTITY_QUERY,
    [
      {
        stock_quantity : newQuantity
      },
      {
        item_id : item_id
      }
    ],
    function(err, res,fields) {
      if (err) {
        console.log(err.message);
        connection.end();
        throw err;
      }

      console.log("Item ID " + item_id + "  Name: " + productName);
      console.log("     Old count: " + oldQuantity 
               + "  Quantity added: " + quantityToAdd
               + "  New count: " + newQuantity + "\n");
      connection.end();
      process.exit();
    }
  );
}

function addNewProduct() {
  inquirer.prompt([
    {
      name: "productName",
      message: "What is the name of the new product?"
    },
    {
      name: "departmentName",
      message: "What is the name of the department?"
    },
    {
      name: "price",
      message: "What is the unit price of the new product?"
    },
    {
      name: "quantity",
      message: "How many units of the new product have been stocked?"
    }
  ]).then(function(answers) {
       validateAndAdd(answers);
  });
}

function validateAndAdd(answers) {
  const ADD_PRODUCT_QUERY_PREFIX = 
    "INSERT INTO products (product_name, department_name, price, "
                        + "stock_quantity) VALUES( ";

  const ADD_PRODUCT_QUERY_SUFFIX = " )";

  var validDepartments = [ 'Appliances',
                           'Clothing',
                           'Electronics',
                           'Foods',
                           'Hardware',
                           'Health & Beauty',
                           'Pharmacy',
                           'Toys',
                         ];

  var productName, departmentName, unitPrice, quantityInStock;
  var moneyRegex   = /^\d+\.\d{2}$/;
  var integerRegex = /^\d+$/;
  var errorStrings = [];

  productName = answers.productName;
  departmentName = answers.departmentName;
  unitPrice = answers.price;
  quantityInStock = answers.quantity;

  if ( (productName === undefined) || (productName === null)
    || (productName === '') ) {
    errorStrings.push("Product name cannot be blank. Please enter the name of the product");
  } else {
      productName = SQLString.escape(productName);
  }

  if ( (departmentName === undefined) || (departmentName === null)
    || (departmentName === '') ) {
    errorStrings.push("Department name cannot be blank. Please enter the name of the department");
  } else if ( validDepartments.indexOf(departmentName) === -1) {
    var depts = validDepartments.join(', ');
    errorStrings.push("Department name must be one of:\n" + depts );
  } else {
      departmentName = SQLString.escape(departmentName);
  }

  if ( (unitPrice === undefined) || (unitPrice === null) || (unitPrice === '') ) {
    errorStrings.push("Unit price cannot be blank. Please enter the unit price (dd.cc");
  } else if ( !moneyRegex.test(unitPrice) ) {
    errorStrings.push("Unit price must be in dollars/cents format: dd.cc");
  } 

  if ( (quantityInStock === undefined) || (quantityInStock === null)
    || (quantityInStock === '') ) {
    errorStrings.push("Quantity stocked cannot be blank. Please enter the quantity stocked");
  } else if ( !integerRegex.test(quantityInStock) ) {
    errorStrings.push("Quantity stocked must be whole number that is at least 1");
  } 

  if ( errorStrings.length > 0) {
    console.log("The following error(s) must be corrected:");
    var numErrors = errorStrings.length;
    for (var i = 0; i < numErrors; i++) {
      console.log("    " + errorStrings[i] + '\n');
    }
    connection.end();
    process.exit();
  }

  var sql = ADD_PRODUCT_QUERY_PREFIX;

  sql += ( productName + ", " );
  sql += ( departmentName + ", " );
  sql += ( unitPrice + ", ");
  sql += ( quantityInStock + ADD_PRODUCT_QUERY_SUFFIX );

  connection.query(
    sql,
    function(err, res) {
      if (err) {
        console.log(err.message);
        connection.end();
        throw err;
      }

      console.log("Product added successfully");
      connection.end();
      process.exit();
    }
  ); 
}