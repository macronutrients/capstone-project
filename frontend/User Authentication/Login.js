const sign_up = document.querySelector("#sign_up");

const message=document.getElementById("message");

sign_up.addEventListener("click", function()
{
    window.location.href = "Registration.html";
});


const login = document.querySelector("#login");

login.addEventListener("click", async function()
{
    const email = document.querySelector("#correct_name").value;
    const password = document.querySelector("#correct_password").value;
    try
    {

    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    
    const data = await response.json();
    if(!response.ok)
        {
            throw new Error(data.message || "Login failed");
        }
        message.textContent = "Login successful!!";
        if(data.token)
            {
                sessionStorage.setItem("token", data.token);
            }
            window.location.href="?/page=dashboard";
        

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
