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


con.addEventListener("click", async function() //we need further information and we send a request out to the backend so we have to wait for that request to come in when we call for the wait using await
{
    let first_password = password.value;
    valid(first_password);
    let confirmed = confirm.value;
    if(confirmed == first_password)
    {
        good.innerHTML = "Passwords match";

        try{ //sending frontend info to backend
            const response = await fetch("http://localhost:3000/auth/register",{ //fetch gets address we want along with how exactly we want to interact with the address that we get using fetch which is a function built in API which came from the browser
                method: "POST", headers:{"Content-Type": "application/json"}, //method letting the reciever know that were sending info, header the type of info it is warns them its JSON and the body which includes the actual information that were sending with all of its variable names
                body:JSON.stringify({ //stringy then used so that fetch knows how to deal with it doesn't exactly know how to deal with javascript object
                    email:username.value, //the variables fetch actually not only retreives the addresses using post, but also tells server the type and also sends it back
                    password: password.value
                })
            });
            const data = await response.json(); //awaiting for fetch kind of already waited for it more like the server so that we can turn it into a json object

            output.innerHTML = data.message; //saves the backend message to this section of the frontend
        }
        catch(error){//if risky try function failed internally
            output.innerHTML = "Unable to connect to backend"; //the message of failure
        }
    }
    else
    {
        good.innerHTML = "Make sure passwords match. Your password was not " + confirmed; 
    }
});


