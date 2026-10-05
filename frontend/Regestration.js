let username = document.querySelector(".username");
let password = document.querySelector(".password");
let confirm = document.querySelector(".confirm");


let con = document.querySelector("#con");

let output = document.querySelector("#output");
let hidden = document.querySelector("#hidden");
let repeated = document.querySelector("#repeated");


con.addEventListener("click", function()
{
    //take in values that are to be compared.
    let first_password = password.value;
    let confirmed = confirm.value;

    if(confirmed == first_password && first_password.length > 7)
    {
        window.location.href = "file:///Users/theoorecchio/Downloads/Habit%20Login/capstone-project/frontend/Login.html";
        hidden.innerHTML="";
        repeated.innerHTML="";
    }
    else if(confirmed == first_password && first_password.length < 8)
    {
        hidden.innerHTML= "Your password must have at least 8 characters ";
        repeated.innerHTML="";
    }
    else if(confirmed != first_password && first_password.length > 7)
    {
        hidden.innerHTML="";
        repeated.innerHTML= "Make sure your passwords match ";
    }
   else
   {
    hidden.innerHTML= "Your password must have at least 8 characters ";
    repeated.innerHTML= "Make sure your passwords match ";
   }
});



