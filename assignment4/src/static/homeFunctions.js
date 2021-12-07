
function getEmployee()
{
    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = display; 

  
    xReq.open('GET', `/employee`, true)  

    xReq.send(); 
}


function logout()
{
    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = display; 

  
    xReq.open('GET', `/logout`, true)  

    xReq.send(); 

}


function order()
{ 
    let response  = document.getElementById("response");
    response.style.display= "none"
    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = displayResponse; 

  
    xReq.open('GET', `/order`, true)  

    xReq.send(); 

}

function addShoe()
{
    let response = document.getElementById("response");
    response.style.display = "block"

    let display  = document.getElementById("confirm");
    display.style.visibility = "hidden"

    response.innerHTML= "<div style='margin-top:20px'> Shoe Input Form </div>"
    response.innerHTML+=`      <form action="javascript:addShoeDatabase()" id="addShoeForm" >
                                    <p>
                                    <label for="brand"  >Brand: </label>
                                    <input type="text" id="brand" required value="Nike" ></input>
                                    </p>

                                    <p>
                                    <label for="price"  >Price: </label>
                                    <input type="number" step="0.01" id="price" min=0 required value=1 ></input>
                                    </p>


                                    <p>
                                    <label for="size">Shoe Size: </label>
                                    <input type="number"  step="1" id="size" min=1 value=1 required></input>
                                    </p>

                                    <p>
                                   <label for="type">Shoe Type: </label>
                                    <input type="text" id="type" required value="basketball"></input>
                                    </p>

                                    <p>
                                    <label for="color">Color: </label>
                                    <input type="text" id="color" required value="blue"></input>
                                    </p>

                                    <p>
                                    <label for="stock">Stock Count: </label>
                                    <input type="number" step="1" id="stock" min=1  required value=1></input>
                                    </p>

                                    <p>
                                  
                                    <input type="submit"></input>
                                    </p>

                                   
                                
                                </form>

`



}


function addShoeDatabase()
{
    
    let shoe = document.getElementById("addShoeForm").elements;

    let shoeObject={}

    for(let i = 0; i<shoe.length-1;i++)
    {
        shoeObject[`${shoe[i].id}`] = shoe[i].value
    }


    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = displayResponse; 

  
    xReq.open('GET', `/addShoe?shoeItems=${JSON.stringify(shoeObject)}`, true)  

    xReq.send(); 
}

function displayResponse()
{
   
    if(this.readyState==4 && this.status == 200)
    {
        let display  = document.getElementById("confirm");
        display.style.visibility = "visible"
        display.innerHTML=this.responseText;
        
        
    }
}




function showClosest()
{
    
    let response = document.getElementById("response");
    response.style.display = "block"

    let display  = document.getElementById("confirm");
    display.style.visibility = "hidden"

    response.innerHTML= "<div style='margin-top:20px'>Please Input the Following Information: </div>"
    response.innerHTML+=`      <form action="javascript:getClosest()" id="closestStore" >
                                    <p>
                                    <label for="customerEmail"  >Customer Email: </label>
                                    <input type="text" id="email" required value="linda81@yahoo.com" ></input>
                                    </p>
                                    
                                    <p>
                                    <label for="itemID"  >Item  ID: </label>
                                    <input type="number" id="itemID" required value=3 min=1 ></input>
                                    </p>

                                    <p>
                                    <input type="submit"></input>
                                    </p>

                                
                                </form>

`




}


function getClosest()
{

    let display  = document.getElementById("confirm");
    display.style.visibility = "hidden"
      
    let closest = document.getElementById("closestStore").elements;

    let closestObject={}

    for(let i = 0; i<closest.length-1;i++)
    {
        closestObject[`${closest[i].id}`] = closest[i].value
    }


    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = displayClosest; 

  
    xReq.open('GET', `/distance?info=${JSON.stringify(closestObject)}`, true)  

    xReq.send(); 

   

}

function display()
{
    if(this.readyState==4 && this.status == 200)
    {
        let display  = document.getElementById("greeting");
        display.innerHTML=this.responseText;
        
        
    }

}

function displayClosest()
{
   
    if(this.readyState==4 && this.status == 200)
    {
        let display  = document.getElementById("confirm");
        display.style.visibility = "visible"
        display.innerHTML=this.responseText;
        
        
    }
}

function metrics()
{
    let response  = document.getElementById("response");
    response.style.display= "none"

    let display  = document.getElementById("confirm");
    display.style.visibility = "hidden"
      


    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = displayResponse; 

  
    xReq.open('GET', `/employeeStats`, true)  

    xReq.send(); 

}

function  items()
{
    let response  = document.getElementById("response");
    response.style.display= "none"
    let display  = document.getElementById("confirm");
    display.style.visibility = "hidden"
      


    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = displayResponse; 

  
    xReq.open('GET', `/itemsSold`, true)  

    xReq.send(); 

}


function showUpdate()
{
    let response = document.getElementById("response");
    response.style.display = "block"

    let display  = document.getElementById("confirm");
    display.style.visibility = "hidden"


    response.innerHTML= "<div style='margin-top:20px'> Customer Update Form Form </div>"
    response.innerHTML+=`      <form action="javascript:getUpdateForm()" id="customerEmailForm" >

                                    <p>
                                    <label for="email"  >Customer Email: </label>
                                    <input type="text" required id="email" value="andersonjeremy@hotmail.com"></input>
                                    </p>
                                    

                                    <p>
                                  
                                    <input type="submit"></input>
                                    </p>

                                   
                                
                                </form>

`


    

}

function getUpdateForm()
{
   
    let response  = document.getElementById("response");
    response.style.display= "block"
    let display  = document.getElementById("confirm");
    display.style.visibility = "hidden"
            
    let customerEmailForm = document.getElementById("customerEmailForm").elements;
   
    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = displayForm; 

  
    xReq.open('GET', `/customerInfo?email=${customerEmailForm[0].value}`, true)  

    xReq.send(); 

}


function updateCustomer()
{
        
    let customer = document.getElementById("updateCustomerForm").elements;

    let customerObject={}

    for(let i = 0; i<customer.length-1;i++)
    {
        customerObject[`${customer[i].id}`] = customer[i].value
    }


    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = displayResponse; 

  
    xReq.open('GET', `/updateCustomer?customer=${JSON.stringify(customerObject)}`, true)  

    xReq.send(); 

}

function displayForm()
{
    if(this.readyState==4 && this.status == 200)
    {
        let display  = document.getElementById("response");
        display.style.visibility = "visible"
        display.innerHTML=this.responseText;
        
        
    }
}


getEmployee();