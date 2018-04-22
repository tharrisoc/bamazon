// Note: this script is partially-completed.
//       Some portions of it use PSEUDOCODE
//       The Create New Department code is working

'use strict';

var mysql      = require('mysql');
var inquirer   = require('inquirer');
var accounting = require('accounting');
var SQLString  = require('sqlstring');
var formatter  = require('./JSONToTable.js');

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
    // indicated by the supervisor's selection
    doSupervisorOperations();
  });
  

function doSupervisorOperations() {
  inquirer.prompt([
    {
      message: "What operation do you want to perform?"
             + "\n  (use Up/Down arrow keys to make a selection"
             + "\n  then, press Enter)",
      type: "list",
      name: "operation",
      choices: ["View Product Sales by Department",
                "Create New Department"]
    }
  ]).then(function(answer) {
            var selection = answer.operation;
            switch (selection) {
              case "View Product Sales by Department" :
                viewProdSalesByDept();
                break;

              case "Create New Department" :
                createNewDept();
                break;

              default:
                console.log("Control should never get here.");
                connection.end();
                process.exit();
            }
    });
  }

  function viewProdSalesByDept() {
    // This is a query that will JOIN the products and department tables
    // on department_name, sum the sales in each department and compute
    // the total profit.
    // N.B. this is a first draft of the query. It can probably be improved.

    const PRODUCT_SALES_BY_DEPT_QUERY =
      "SELECT department_id, departments.department_name AS DeptName, "
            + "overhead_costs AS OverheadCosts, " 
            + "SUM(products.product_sales) AS ProductSales,"
            + " (SUM(products.product_sales) - overhead_costs) AS TotalProfit "
            + "FROM departments, products "
            + "WHERE departments.department_name = products.department_name "
            + "GROUP BY departments.department_name ORDER BY department_id";

/*
   This is the result of running the above query in the MySQL 
   command line client.

mysql> SELECT * FROM  products;
+---------+-------------------------------------------+-----------------+---------+----------------+---------------+
| item_id | product_name                              | department_name | price   | stock_quantity | product_sales |
+---------+-------------------------------------------+-----------------+---------+----------------+---------------+
|       1 | Sony 48-inch Flat Screen Television       | Electronics     | 1026.00 |             44 |       2052.00 |
|       2 | Airborne Chewable Tablets 60 Count        | Pharmacy        |    7.95 |             56 |         39.75 |
|       3 | Whirlpool Vertical Washer and Dryer       | Appliances      |  857.00 |             11 |        857.00 |
|       4 | Craftsman Circular Saw                    | Hardware        |   39.95 |             14 |         39.95 |
|       5 | Welchs' Sparkling Grape Juice             | Foods           |    3.59 |            244 |         21.54 |
|       6 | Barbasol Shave Cream                      | Health & Beauty |    2.95 |             99 |         11.80 |
|       7 | Winter Insulated Goose Down Jacket        | Clothing        |   98.50 |             17 |        197.00 |
|       8 | Schwinn 26 Inch Boys Bicycle              | Toys            |   76.49 |             15 |        152.98 |
|       9 | Microsoft Surface Pro III Laptop Computer | Electronics     |  520.50 |             13 |       2082.00 |
|      10 | Child's Size 6 Air Jordan Sneakers        | Clothing        |  135.95 |              9 |        407.85 |
|      11 | Radio Controlled Car                      | Toys            |   29.95 |              8 |        119.80 |
|      12 | Apple iPod 80GB                           | Electronics     |  335.95 |             18 |        671.90 |
+---------+-------------------------------------------+-----------------+---------+----------------+---------------+
12 rows in set (0.00 sec)

mysql> SELECT * FROM departments;
+---------------+-----------------+----------------+
| department_id | department_name | overhead_costs |
+---------------+-----------------+----------------+
|             1 | Hardware        |       50000.00 |
|             2 | Foods           |       85000.00 |
|             3 | Toys            |       70000.00 |
|             4 | Clothing        |      100000.00 |
|             5 | Health & Beauty |       75000.00 |
|             6 | Appliances      |      200000.00 |
|             7 | Electronics     |      250000.00 |
|             8 | Pharmacy        |      120000.00 |
+---------------+-----------------+----------------+
8 rows in set (0.00 sec)

mysql> SELECT department_id, departments.department_name AS DeptName, overhead_costs AS OverheadCosts, SUM(products.product_sales) AS ProductSales, (SUM(products.product_sales) - overhead_costs) AS TotalProfit FROM departments, products WHERE departments.department_name = products.department_name GROUP BY departments.department_name ORDER BY department_id;
+---------------+-----------------+---------------+--------------+-------------+
| department_id | DeptName        | OverheadCosts | ProductSales | TotalProfit |
+---------------+-----------------+---------------+--------------+-------------+
|             1 | Hardware        |      50000.00 |        39.95 |   -49960.05 |
|             2 | Foods           |      85000.00 |        21.54 |   -84978.46 |
|             3 | Toys            |      70000.00 |       272.78 |   -69727.22 |
|             4 | Clothing        |     100000.00 |       604.85 |   -99395.15 |
|             5 | Health & Beauty |      75000.00 |        11.80 |   -74988.20 |
|             6 | Appliances      |     200000.00 |       857.00 |  -199143.00 |
|             7 | Electronics     |     250000.00 |      4805.90 |  -245194.10 |
|             8 | Pharmacy        |     120000.00 |        39.75 |  -119960.25 |
+---------------+-----------------+---------------+--------------+-------------+
8 rows in set (0.01 sec)

 */

 /*
    PSEUDOCODE
      1. Execute the query shown above.
      2. Format the result set into a table
      3. Display the table to the supervisor
      4. Exit the script
 */

    console.log("Not Implemented Yet!!!");
    connection.end();
    process.exit();
  }

  function createNewDept() {
    const CREATE_DEPT_QUERY_PREFIX =
      "INSERT INTO departments (department_name, overhead_costs) "
                             + "VALUES( ";

    const CREATE_DEPT_QUERY_SUFFIX = " );";

    inquirer.prompt([
      {
        name: "deptname",
        message: "Enter the name of the new department: "
      }, {
        name: "overheadcost",
        message: "Enter the starting Overhead Cost Value (ddddd.cc): "
      }
    ]).then(function(answers) {
         var dept = answers.deptname;
         var ovhd = answers.overheadcost;
         var regexp = /^\d+\.\d{2}$/;
         var sql;

         if ( (dept === undefined) || (dept === null) || (dept === '')) {
           console.log("Department Name cannot be blank");
           connection.end();
           process.exit();
         }
         dept = SQLString.escape(dept);
         
         // TODO make sure that this name is not already in the database

         if ( (isNaN(ovhd)) || !regexp.test(ovhd) ) {
           console.log("Overhead Cost must be a dollar figure");
           connection.end();
           process.exit();
         }
         
         ovhd = Number(ovhd);

         sql = CREATE_DEPT_QUERY_PREFIX
                 + dept + ', ' + ovhd.toString()
                 + CREATE_DEPT_QUERY_SUFFIX;

         connection.query(
           sql,
           function(err, res) {
             if (err) {
               console.log(err.message);
               throw err;
             }

             console.log("Department added successfully");
             connection.end();
             process.exit()
           }
         );
    });
  }

