CREATE TABLE if not exists Store
(      
  street		VARCHAR(95) NOT NULL,
  postalCode	INT NOT NULL CHECK (postalCode > 0) ,
  city			VARCHAR(95) NOT NULL,
  state 	VARCHAR(95) NOT NULL ,
  longitude DOUBLE NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  latitude DOUBLE NOT NULL CHECK (latitude BETWEEN -90 AND 90) ,
  PRIMARY KEY		(street, city, state)
  
);
  

CREATE TABLE if not exists Item
(
	itemID				INT NOT NULL UNIQUE CHECK (itemID>0)
);
  
  
CREATE TABLE if not exists Customer
(	
  firstName		VARCHAR(30) NOT NULL,
  lastName		VARCHAR(30) NOT NULL,
  homePhone		DOUBLE NOT NULL CHECK(homePhone>0),
  email			VARCHAR(30) NOT NULL CHECK (email REGEXP '[@]') UNIQUE ,
  street		VARCHAR(95) NOT NULL,
  postalCode	VARCHAR(95) NOT NULL,
  city			VARCHAR(95) NOT NULL,
  state		VARCHAR(95) NOT NULL,
  cardNumber	INT NOT NULL CHECK(cardNumber BETWEEN 10000000 AND 99999999),
  CVC			INT NOT NULL CHECK(CVC BETWEEN 0 AND 999),
  cardType		VARCHAR(100) NOT NULL,
  expiryDate	DATE NOT NULL CHECK (expiryDate>"2021-11-23") ,
  longitude DOUBLE NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  latitude DOUBLE NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  PRIMARY KEY   (email)
  
  
);



CREATE TABLE if not exists Employee
(

	firstName	VARCHAR(30) NOT NULL,
    lastName	VARCHAR(30) NOT NULL,
    email	VARCHAR(30) NOT NULL CHECK (email REGEXP '[@]'),
    employeePassword	VARCHAR(30) NOT NULL,
    salary		INT NOT NULL CHECK (salary>0),
	storeStreet		VARCHAR(95) NOT NULL,
	storeState 	VARCHAR(95) NOT NULL,
	storeCity			VARCHAR(95) NOT NULL,
	FOREIGN KEY (storeStreet, storeCity, storeState) REFERENCES Store(street, city, state),
    PRIMARY KEY(email) 

);




CREATE TABLE if not exists Socks
(

	brand	VARCHAR(30) NOT NULL,
    price	DOUBLE NOT NULL CHECK(price>0.0),
    color	VARCHAR(100) NOT NULL,
	size	VARCHAR(10) NOT NULL,
    cut 	VARCHAR(50) NOT NULL,
    material	VARCHAR(50) NOT NULL,
    sockID	INT NOT NULL UNIQUE,
	FOREIGN KEY (sockID) REFERENCES Item(itemID),
    PRIMARY KEY (sockID)
);



CREATE TABLE if not exists Shoes
(
	brand	VARCHAR(30) NOT NULL,
    price	DOUBLE NOT NULL CHECK(price>0.0),
    size	INT NOT NULL,
    shoeType	VARCHAR(15) NOT NULL ,
	color	VARCHAR(100) NOT NULL,
    shoeID	INT NOT NULL UNIQUE,
	FOREIGN KEY (shoeID) REFERENCES Item(itemID),
	PRIMARY KEY (shoeID)
);

CREATE TABLE if not exists Stock
(
    stockCount	INT NOT NULL CHECK (stockCount>0),
	storeStreet		VARCHAR(95) NOT NULL,
	storeState 	VARCHAR(30) NOT NULL,
	storeCity			VARCHAR(28) NOT NULL,
	itemID				INT NOT NULL CHECK (itemID>0),
    FOREIGN KEY (storeStreet, storeCity, storeState) REFERENCES Store(street, city, state),
    FOREIGN KEY (itemID) REFERENCES Item(itemID),
    PRIMARY KEY (itemID, storeStreet, storeCity, storeState)
);



CREATE TABLE if not exists Sales
(
	totalSaleAmount		DOUBLE NOT NULL CHECK(totalSaleAmount>0),
    saleType			VARCHAR(15) NOT NULL,
    saleID				INT	NOT NULL CHECK (saleID>0),
	employeeEmail	VARCHAR(30) NOT NULL CHECK (employeeEmail REGEXP '[@]'),
    customerEmail   VARCHAR(30) NOT NULL CHECK (customerEmail REGEXP '[@]'),
	itemID	INT NOT NULL CHECK (itemID>0),
    FOREIGN KEY	(employeeEmail) REFERENCES Employee(email),
    FOREIGN KEY (customerEmail) REFERENCES Customer(email),
    FOREIGN KEY (itemID) REFERENCES Stock(itemID),
    PRIMARY KEY	(saleID)
); 





CREATE TABLE if not exists Orders
(	courierServer 	VARCHAR(30) NOT NULL,
    dateShipped		DATE NOT NULL CHECK (dateShipped>"2021-11-23") ,
	saleID			INT NOT NULL CHECK (saleID>0) UNIQUE,
	customerEmail			VARCHAR(30) NOT NULL CHECK (customerEmail REGEXP '[@]') UNIQUE ,
    FOREIGN KEY (saleID) REFERENCES Sales (saleID),
    FOREIGN KEY (customerEmail) REFERENCES Customer (email),
	PRIMARY KEY (saleID, customerEmail) 
);