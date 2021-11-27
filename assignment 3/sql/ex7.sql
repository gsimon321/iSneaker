CREATE VIEW employeeOrders (employeeEmail, saleID, dateShipped, courierServer, customerEmail) AS
SELECT E.employeeEmail, O.saleID , O.dateShipped, O.courierServer, O.customerEmail
FROM orders O
JOIN sales E
ON O.saleID = E.saleID
WHERE O.saleID = E.saleID
GROUP BY O.saleID

CREATE VIEW customerShoePurchaseDetails (customerEmail,brand,price,size,shoeType,color,shoeID) AS
SELECT S.customerEmail,O.brand,O.price,O.size,O.shoeType,O.color,O.shoeID
FROM sales S
JOIN shoes O
ON s.itemID = O.shoeID

CREATE VIEW employeeOrders (firstName,lastName,email,salesMade) AS
SELECT  firstName,lastName,employeeEmail, COUNT(*)
FROM Sales s, Employee e
WHERE e.email = s.employeeEmail
GROUP BY firstName,lastName,e.email
