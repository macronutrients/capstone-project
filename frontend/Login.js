let input = document.querySelector("input");

let user = document.querySelector("#user");
let pass = document.querySelector("#pass");
let con = document.querySelector("#con");

let output = document.querySelector("#output");
let hidden = document.querySelector("#hidden");
let good = document.querySelector("#good");

user.addEventListener("click", function(){
    output.innerHTML = "That's your username";
});

pass.addEventListener("click", function(){
    hidden.innerHTML = "That's your password";
});

con.addEventListener("click", function(){
    good.innerHTML = "Passwords match";
});

