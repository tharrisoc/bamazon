DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(60) NOT NULL,
    department_name VARCHAR(40) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity MEDIUMINT UNSIGNED NOT NULL,
    product_sales DECIMAL(13,2) DEFAULT NULL,
    PRIMARY KEY(item_id)
) ENGINE = InnoDB;

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Sony 48-inch Flat Screen Television',  'Electronics',  1026.00,  46 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Airborne Chewable Tablets 60 Count',  'Pharmacy',  7.95,  61 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Whirlpool Vertical Washer and Dryer',  'Appliances',  857.00,  9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Craftsman Circular Saw',  'Hardware',  39.95, 15 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Welchs\' Sparkling Grape Juice',  'Foods',  3.59, 200 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Barbasol Shave Cream',  'Health \& Beauty',  2.95, 103 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Winter Insulated Goose Down Jacket',  'Clothing',  98.50, 40 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Schwinn 26 Inch Boys Bicycle',  'Toys', 76.49, 17 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Microsoft Surface Pro III Laptop Computer',  'Electronics', 520.50, 16 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES( 'Child\'s Size 6 Air Jordan Sneakers',  'Clothing', 135.95, 12 );
            

DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    department_id INTEGER AUTO_INCREMENT,
    department_name VARCHAR(40) NOT NULL,
    overhead_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id)
) ENGINE = InnoDB;

INSERT INTO departments (department_name, overhead_costs)
            values('Hardware' , 50000);

INSERT INTO departments (department_name, overhead_costs)
            values('Foods' , 85000);

INSERT INTO departments (department_name, overhead_costs)
            values( 'Toys', 70000);

INSERT INTO departments (department_name, overhead_costs)
            values('Clothing' , 100000);

INSERT INTO departments (department_name, overhead_costs)
            values( 'Health & Beauty', 75000);

INSERT INTO departments (department_name, overhead_costs)
            values( 'Appliances', 200000);

INSERT INTO departments (department_name, overhead_costs)
            values('Electronics' , 250000);

INSERT INTO departments (department_name, overhead_costs)
            values('Pharmacy', 120000 );


