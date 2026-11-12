let sign_up = document.querySelector("#sign_up");

const message=document.getElementById("message");

sign_up.addEventListener("click", function()
{
    window.location.href = "Registration.html";
});


let login = document.querySelector("#login");

login.addEventListener("click", async function()
{
    let email = document.querySelector("#correct_name").value;
    let password = document.querySelector("#correct_password").value;
    try
    {

    let response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    
    let data = await response.json();
    if(!response.ok)
        {
            throw new Error(data.error || "Login failed");
        }
        message.textContent = "Login successful!!";
        if(data.token)
            {
                sessionStorage.setItem("token", data.token);
            }
            window.location.href="?/page=dashboard";
        

        if(data.token)

            {
                sessionStorage.setItem("token", data.token);
            }

            //Redirect after successful login 
            window.location.href= "/?page=dashboard";
            console.log("http status:", response.status);
            console.log("Bacend response: ",data);
        }
            catch (error)
            {
                    message.textContent= error.message;
                    console.error("Login error: ", error)
                    alert(error.message);
            }
    
});
