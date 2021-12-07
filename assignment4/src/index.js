const express =  require("express")
const app  = express();
app.listen(80); // listening on port 80.
const newConnection = require("./DBConnection");
const mysql = require('mysql2');




app.use(express.static("static")); // routing the static files of the express app to the static file.



//    aaron16@yahoo.com
 //   &x1#M)LeI+

 let employee={};
 

app.get("/login", (req,res)=>{

    let  conn = newConnection();

  

   
    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })

    var sql = 'SELECT * FROM Employee WHERE email = ' + mysql.escape(req.query.username);
    conn.query(sql, (err, rows, fields)=>{

        if(err)
            console.log(err)
        let content = '';

  


        if(rows.length==0||req.query.password!=rows[0].employeePassword)
        {
            res.send("Incorrect Credentials Please Try Again!")
        }
        else
        {
           
    
            employee=rows[0];
            res.sendFile(__dirname +  "/static/homePage.html")

        }

      

    });


    

    conn.end()

    
});

app.get("/store", (req, res)=>{

    let  conn = newConnection();

    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })
    conn.query("select * from Store", (err, rows, fields)=>{

        let content = '';

      

        for(let i = 0; i <rows.length;i++)
        {
            content+=`<div>${rows[i].street} : ${rows[i].city} : ${rows[i].state}</div>`
        }

        res.send(content);

    });

    
   

    conn.end()
});

app.get("/employee", (req, res)=>{

    let content='';

    content+=`<h1> Welcome  ${employee.firstName} ${employee.lastName}</h1>`
   res.send(content)

});


app.get("/addShoe", (req, res)=>{

    let shoes =  JSON.parse(req.query.shoeItems);

    let  conn = newConnection();

   
    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })

    var sql = 'SELECT * FROM Item;'
    conn.query(sql, (err, rows, fields)=>{

        if(err)
            console.log(err)

        let lastItemNum = rows[rows.length-1];

        let newItemNum = lastItemNum.itemID+1;

        let idQuery = `INSERT INTO Item(itemID) VALUES (${newItemNum}); 
                        INSERT INTO Shoes(brand, price, size, shoeType, color, shoeID) VALUES("${shoes.brand}", ${shoes.price}, ${shoes.size}, "${shoes.type}", "${shoes.color}", ${newItemNum});
                        INSERT INTO Stock(stockCount, storeStreet, storeState, storeCity, itemID) VALUES(${shoes.stock}, "${employee.storeStreet}", "${employee.storeState}", "${employee.storeCity}", ${newItemNum});`

      

        conn.query(idQuery, (err, results)=>{

            if(err)
                console.log(err)

            
        if(!Array.isArray(results) || !results)
        {
            res.send("Please Input a Valid Shoe Item Attributes!")

        }
        else
        {
            
                let getQuery =    `SELECT * FROM Shoes WHERE shoeID = ${newItemNum};
                SELECT *  FROM Stock WHERE itemID = ${newItemNum};`




                conn.query(getQuery, (err, results)=>{
                    if(err)
                        console.log(err)


                        let shoeData = results[0][0];
                        let stockData = results[1][0];

                        content= "<div style='margin-top:10px; margin-bottom: 10px'>Success! Here is your Data Entry.</div>"
                        content+=`<div style='margin-bottom: 10px'>Shoe Data:</div>`
                     
                       
                        content+=`<table cellpadding="5px" cellspacing="5px">
                        <tr>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Size</th>
                        <th>Shoe Type</th>
                        <th>Color</th>
                        <th>Shoe ID</th>
                        </tr>`
                 
                        
                       
                    
                         content+=`
                                     <tr>
                                     <td>${shoeData.brand}</td>
                                     <td>$${shoeData.price}</td>
                                     <td>${shoeData.size}
                                     <td>${shoeData.shoeType}</td>
                                     <td>${shoeData.color}</td>
                                     <td>${shoeData.shoeID}</td>
                                     </tr>
                                     </table>
                         
                         
                         
                         `

                         content+=`<div style='margin-bottom: 10px; margin-top:10px'>Stock Data:</div>`

                         content+=`<table cellpadding="5px" cellspacing="5px" style="margin-top:10px">
                         <tr>
                         <th>Item  ID</th>
                         <th>Store Street</th>
                         <th>Store City</th>
                         <th>Store State</th>
                         <th>Stock Count</th>
                         </tr>`
                  
                         
                        
                     
                          content+=`
                                      <tr>
                                      <td>${stockData.itemID}</td>
                                      <td>${stockData.storeStreet}</td>
                                      <td>${stockData.storeCity}
                                      <td>${stockData.storeState}</td>
                                      <td>${stockData.stockCount}</td>
                                
                                      </tr>
                                      </table>
                          
                          
                          
                          `
                 
                        
                       

                        res.send(content)

                });

            }

                conn.end()
               
           

        

        });

        
        

      

    });


    


})


app.get('/distance', (req, res)=>{

    let info =  JSON.parse(req.query.info);

    let query = `Select C.email as email, C.longitude as customerLong, C.latitude as customerLat, S.longitude,
    S.latitude, S.city, S.street, S.state, S.postalCode, SQRT(POW(69.1 * (S.latitude - C.latitude), 2) +POW(69.1 *
    (C.longitude - S.longitude) * COS(S.latitude / 57.3), 2)) AS distance
    from customer C, store S
    JOIN stock
    ON storeStreet = S.street AND storeCity = S.city AND storeState = S.state AND itemID = ${info.itemID}
    WHERE email = '${info.email}'
    GROUP BY S.postalCode, C.email
    ORDER BY distance ASC`

    let  conn = newConnection();

    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })

    conn.query(query, (err, rows, fields)=>{


        if(err)
            console.log(err)

        

        if(!Array.isArray(rows) || !rows.length)
        {
            res.send("Please Input a Valid Email Address and Item ID!")

        }
        else
        {
            let content=``;

      

            content= `<div  style='margin-bottom: 10px'>Closest Stores to Customer: ${rows[0].email} that have ItemID: ${info.itemID} </div>`
            content+= "<div  style='margin-bottom: 10px'> Store Information: </div>"
     
            content+=`<table cellpadding="5px" cellspacing="5px">
            <tr>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Postal Code</th>
            <th>Distance</th>
            </tr>`
     
            for(let i = 0; i<rows.length;i++)
            {
                
           
        
             content+=`
                         <tr>
                         <td>${rows[i].street}</td>
                         <td>${rows[i].city}</td>
                         <td>${rows[i].state}
                         <td>${rows[i].postalCode}</td>
                         <td>${rows[i].distance}</td>
                         </tr>
             
             
             
             `
     
            }
         
            
     
            content+="</table>"
     
     
             res.send(content);

        }
    

     

    });

    
   

    conn.end()

})


app.get('/order', (req, res)=>{


    let query = `START TRANSACTION;
    CREATE OR REPLACE VIEW employeeOrders (employeeEmail, saleID, dateShipped, courierServer, customerEmail) AS
    SELECT E.employeeEmail, O.saleID , O.dateShipped, O.courierServer, O.customerEmail
    FROM orders O
    JOIN sales E
    ON O.saleID = E.saleID
    WHERE O.saleID = E.saleID
    GROUP BY O.saleID;
    COMMIT;
    SELECT  * FROM employeeorders`

    let  conn = newConnection();


    let content=``
    

    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })


         conn.query(query, (err, results, fields)=>{

             if(err)
                console.log(err)
              
                content= `<div  style='margin-bottom: 10px'>iSneaker Active Order:  </div>`
                content+= "<div  style='margin-bottom: 10px'>Order Information: </div>"
        
                content+=`<table cellpadding="5px" cellspacing="5px">
                <tr>
                <th>Employee  Email</th>
                <th>Sale ID</th>
                <th>Date Shipped</th>
                <th>Courier Service</th>
                <th>Customer Email</th>
                </tr>`


                let rows = results[results.length-1]
           
        

               
                    for(let i = 0; i<rows.length;i++)
                    {
        
            
                        content+=`
                                    <tr>
                                    <td>${rows[i].employeeEmail}</td>
                                    <td>${rows[i].saleID}</td>
                                    <td>${rows[i].dateShipped}
                                    <td>${rows[i].courierServer}</td>
                                    <td>${rows[i].customerEmail}</td>
                                    </tr>
                        
                        
                        
                        `
                        
                    }
            
                 content+="</table>"
        
        
                res.send(content);

                conn.end();
        
               
            
        

            })

        

        


})

app.get('/employeeStats', (req, res)=>{




    let query = `SELECT employeeEmail, SUM(S.totalSaleAmount)/salary as marginBroughtIn
    From sales S
        JOIN employee
        ON employeeEmail = employee.email AND employee.storeStreet = '${employee.storeStreet}' AND employee.storeCity = '${employee.storeCity}' AND employee.storeState ='${employee.storeState}'
    Group By S.employeeEmail
    Order by marginBroughtIn desc`

    let  conn = newConnection();

    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })

    conn.query(query, (err, rows, fields)=>{


        if(err)
            console.log(err)
        
    

       let content=``;

      

       content= `<div  style='margin-bottom: 10px'>Employee Efficiency Metrics: Sales to Salary Ratio </div>`

       content+=`<table cellpadding="5px" cellspacing="5px">
       <tr>
       <th>Employee Email</th>
       <th>Margin Brought In</th>
       
       </tr>`

       for(let i = 0; i<rows.length;i++)
       {
           
      
   
        content+=`
                    <tr>
                    <td>${rows[i].employeeEmail}</td>
                    <td>${rows[i].marginBroughtIn}</td>
                    </tr>
        
        
        
        `

       }
    
       

       content+="</table>"


        res.send(content);

    });

    
   

    conn.end()
})


app.get("/itemsSold", (req, res)=>{


    let query = `SELECT Brand, count(brand) as sold
    From sales S
        JOIN shoes
        ON S.itemID = shoeID
    Group by brand
    Order by sold desc`

    let  conn = newConnection();

    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })

    conn.query(query, (err, rows, fields)=>{


        if(err)
            console.log(err)
        
    

       let content=``;

      

       content= `<div  style='margin-bottom: 10px'>Highest Selling Shoe Brand: </div>`

       content+=`<table cellpadding="5px" cellspacing="5px">
       <tr>
       <th>Brand</th>
       <th>Amount Sold</th>
       
       </tr>`

       console.log(rows[0])

       for(let i = 0; i<rows.length;i++)
       {
           
      
   
        content+=`
                    <tr>
                    <td>${rows[i].Brand}</td>
                    <td>${rows[i].sold}</td>
                    </tr>
        `

       }
    
       

       content+="</table>"


        res.send(content);

    });

    
   

    conn.end()

    
})


app.get('/customerInfo', (req, res)=>{

    console.log(req.query.email)

    let query = `SELECT * FROM Customer WHERE email="${req.query.email}"`

    let  conn = newConnection();

    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })

    conn.query(query, (err, rows, fields)=>{


        if(err)
            console.log(err)
        
    

       let content=``;

       console.log(rows);

       let expDate = new Date(rows[0].expiryDate);
       expDate=expDate.toISOString().split("T")[0]
    

       content= `<div  style='margin-bottom: 10px; margin-top:10px'>Customer Update Form: </div>`
        content+=`      <form action="javascript:updateCustomer()" id="updateCustomerForm" >
                                    <p>
                                    <label for="fName"  >First Name: </label>
                                    <input type="text" id="fName" required value=${rows[0].firstName} ></input>
                                    </p>

                                    <p>
                                    <label for="lName"  >Last Name: </label>
                                    <input type="text"  id="lName" required value=${rows[0].lastName} ></input>
                                    </p>

                                    <p>
                                    <label for="phone">Home Phone: </label>
                                    <input type=number id="phone"  value=${rows[0].homePhone} required min=0></input>
                                    </p>


                                    <p>
                                    <label for="email">Email: </label>
                                    <input type="text" id="email"  value=${rows[0].email} required disabled></input>
                                    </p>

             

                                    <p>
                                    <label for="street">Street: </label>
                                    <input type="text" id="street"  value="${rows[0].street}" required></input>
                                    </p>
                                    <p>
                                    <label for="postalCode">Postal Code: </label>
                                    <input type="text" id="postalCode"  value=${rows[0].postalCode} required></input>
                                    </p>
                                    <p>
                                    <label for="city">City: </label>
                                    <input type="text" id="city"  value="${rows[0].city}" required></input>
                                    </p>
                                    <p>
                                    <label for="state">State: </label>
                                    <input type="text" id="state"  value="${rows[0].state}" required></input>
                                    </p>
                                    <p>
                                    <label for="cardNum">Card Number :</label>
                                    <input type=number id="cardNum"  value=${rows[0].cardNumber} min=10000000 max=99999999 required></input>
                                    </p>
                                    <p>
                                    <label for="cvc">CVC: </label>
                                    <input type=number id="cvc"  value=${rows[0]["CVC"]} required min=0  max=999></input>
                                    </p>
                                    <p>
                                    <label for="cardType">Card Type: </label>
                                    <input type="text" id="cardType"  value="${rows[0].cardType}" required></input>
                                    </p>
                                    <p>
                                    <label for="expiry">Expiry: </label>
                                    <input type="date" id="expiry"  value="${expDate}" required></input>
                                    </p>

                                    <p>
                                    <label for="long">Longitude: </label>
                                    <input type=number id="long"  value=${rows[0].longitude} required min=-180 max =180 step=any></input>
                                    </p>

                                    <p>
                                    <label for="lat">Latitude: </label>
                                    <input type=number id="lat"  value=${rows[0].latitude} required min=-90 max=90 step=any></input>
                                    </p>

                                    <p>
                                  
                                    <input type="submit"></input>
                                    </p>

                                   
                                
                                </form>

`

         
      
   
     
    
       




        res.send(content);

    });

    
   

    conn.end()


})

app.get('/updateCustomer', (req, res)=>{

    let customerEntry =  JSON.parse(req.query.customer);

    let  conn = newConnection();


    console.log(customerEntry);

   

   
    conn.connect((err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Connected!")
        }
    })

  
    var sql = `START TRANSACTION;
    UPDATE Customer 
    SET firstName = "${customerEntry.fName}" , lastName = "${customerEntry.lName}" , homePhone=${customerEntry.phone}, email =  "${customerEntry.email}",  street = "${customerEntry.street}",  postalCode="${customerEntry.postalCode}", city = "${customerEntry.city}" , state = "${customerEntry.state}", cardNumber=${customerEntry.cardNum}, CVC=${customerEntry.cvc}, cardType="${customerEntry.cardType}", expiryDate=CAST("${customerEntry.expiry}" AS DATE), longitude = ${customerEntry.long}, latitude=${customerEntry.lat}
    WHERE email = "andersonjeremy@hotmail.com";
    COMMIT;
    SELECT  * FROM Customer WHERE email = "${customerEntry.email}" `
    conn.query(sql, (err, results, fields)=>{

        if(err)
            console.log(err)

      
       
    
        if(!Array.isArray(results) || !results)
        {
            res.send("Please Input a Valid Customer Attributes!")
        }
        else
        {

        let updateResult = results[results.length-1];

        console.log(results)
  


       let content=``;

      

       content= `<div  style='margin-bottom: 10px'>Customer Updated: </div>`

       content+=`<table cellpadding="5px" cellspacing="5px">
       <tr>
       <th>First Name</th>
       <th>Last Name</th>
       <th>Email</th>
       <th>Home Phone</th>
       <th>Street</th>
       <th>Postal Code</th>
       <th>City</th>
       <th>State</th>
       <th>Card Number</th>
       <th>CVC</th>
       <th>Card Type</th>
       <th>Expiry</th>
       <th>Longitude</th>
       <th>Latitude</th>
       
       </tr>`

     
      
   
        content+=`
                    <tr>
                    <td>${updateResult[0].firstName}</td>
                    <td>${updateResult[0].lastName}</td>
                    <td>${updateResult[0].email}</td>
                    <td>${updateResult[0].homePhone}</td>
                    <td>${updateResult[0].street}</td>
                    <td>${updateResult[0].postalCode}</td>
                    <td>${updateResult[0].city}</td>
                    <td>${updateResult[0].state}</td>
                    <td>${updateResult[0].cardNumber}</td>
                    <td>${updateResult[0]["CVC"]}</td>
                    <td>${updateResult[0].cardType}</td>
                    <td>${updateResult[0].expiryDate}</td>
                    <td>${updateResult[0].longitude}</td>
                    <td>${updateResult[0].latitude}</td>
                  
                 
                    </tr>
        `

    
       

       content+="</table>"


        res.send(content);

        }


     
        
        

      

    });


    

})


app.get('/logout',  (req, res)=>{

    res.redirect("index.html")
})