
function login()
{
    let xReq = new XMLHttpRequest(); // creating a new XML request.
    xReq.onreadystatechange = displayCategories; 

    let  username = document.getElementById("username").value
    let password = document.getElementById("password").value

    password = encodeURIComponent(password)

   
    xReq.open('GET', `/login?username=${username}&password=${password}`, true)  // gets the questions from the index.js file in the /questions method.
//  xReq.open('GET', `/store`, true)
    xReq.send(); // sends the questions back to the front end.
}



function displayCategories()
{
    let display = document.getElementById("display")
    if(this.readyState==4 && this.status == 200)
    {
        if(this.responseText=="Incorrect Credentials Please Try Again!")
        {

            display.innerHTML=this.responseText

        }
        else
        {
            document.open();
            document.write(this.responseText);
            document.close();

        }
     
        
        
    }

}
