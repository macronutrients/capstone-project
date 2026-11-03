let sign_up = document.querySelector("#sign_up");

sign_up.addEventListener("click", function()
{
    window.location.href = "Registration.html";
});


let login = document.querySelector("#login");

login.addEventListener("click", async function()
{
    let email = document.querySelector("#correct_name").value;
    let password = document.querySelector("#correct_password").value;

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

    console.log(data);
});