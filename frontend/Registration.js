let username = document.querySelector(".username");
let password = document.querySelector(".password");
let confirm = document.querySelector(".confirm");

let user = document.querySelector("#user");
let pass = document.querySelector("#pass");
let con = document.querySelector("#con");

let output = document.querySelector("#output");
let hidden = document.querySelector("#hidden");
let good = document.querySelector("#good");

function valid(words)
{

    if (words.length < 8)
    {
        hidden.innerHTML= "Your password must have at least 8 characters";
    }
    else
    {
        hidden.innerHTML= "";
    }
}


con.addEventListener("click", function()
{
    let first_password = password.value;
    valid(first_password);
    let confirmed = confirm.value;
    if(confirmed == first_password)
    {
        good.innerHTML = "Passwords match";
    }
    else
    {
        good.innerHTML = "Make sure passwords match. Your password was not " + confirmed; 
    }
});


