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


    let query= `CREATE OR REPLACE VIEW employeeOrders (employeeEmail, saleID, dateShipped, courierServer, customerEmail) AS
    SELECT E.employeeEmail, O.saleID , O.dateShipped, O.courierServer, O.customerEmail
    FROM orders O
    JOIN sales E
    ON O.saleID = E.saleID
    WHERE O.saleID = E.saleID
    GROUP BY O.saleID
   `

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



         conn.query(query, (err, rows, fields)=>{

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

                let query2 = 'SELECT  * FROM employeeorders'

                conn.query(query2, (err, rows, fields)=>{
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

                })
        
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