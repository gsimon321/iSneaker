-- 1.
select * from sales where employeeEmail = 'donnagreen@hotmail.com'
order by totalSaleAmount DESC

-- 2.
Select C.email as email, C.longitude as customerLong, C.latitude as customerLat, S.longitude, S.latitude, S.city, S.street, S.state, SQRT(POW(69.1 * (S.latitude - C.latitude), 2) +POW(69.1 * (C.longitude - S.longitude) * COS(S.latitude / 57.3), 2)) AS distance
from customer C, store S
	JOIN stock
	ON storeStreet = S.street AND storeCity = S.city AND storeState = S.state AND itemID = 3
WHERE email = 'linda81@yahoo.com'
GROUP BY S.postalCode, C.email
ORDER BY distance ASC

-- 3.
SELECT employeeEmail, SUM(S.totalSaleAmount)/salary as marginBroughtIn
From sales S
	JOIN employee
    ON employeeEmail = employee.email AND employee.storeStreet = '336 Robert Trace'
Group By S.employeeEmail
Order by marginBroughtIn desc

-- 4.
SELECT SUM(S.totalSaleAmount) as totalForCourier
From sales S
	JOIN orders
    ON S.saleID = orders.saleID
WHERE courierServer = 'DHL' AND dateShipped > CURDATE()
Group By courierServer


-- 5.
SELECT Brand, count(brand) as amountSold
From sales S
	JOIN shoes
    ON S.itemID = shoeID
Group by brand
Order by amountSold


-- 6.
Select saleType, count(*) * 100/ sum(count(*)) over() as percentage
From sales
where customerEmail = 'hmeyer@gmail.com'
group by saleType

-- 7.
SELECT customerEmail, SUM(S.totalSaleAmount) totalSpentAtStore, storeStreet
From sales S
	JOIN employee
    ON employeeEmail = employee.email
where customerEmail = 'bwallace@gmail.com'
Group By storeStreet
Order by totalSpentAtStore desc
