with avt
AS
(SELECT itemID , avg(stockCount) as mid
FROM stock
GROUP BY itemID) 

UPDATE stock
Inner Join avt on stock.itemID = avt.itemID
SET stockCount = IF (mid > stockCount, stockCount + 100, stockCount + 0)
Where stock.itemID > 0;

DELETE FROM socks
WHERE size = 'XL';

UPDATE shoes
set price = price * 0.75
WHERE brand = 'Nfiniy';