let username = document.querySelector(".username");
let password = document.querySelector(".password");
let confirm = document.querySelector(".confirm");

let con = document.querySelector("#con");

let output = document.querySelector("#output");
let hidden = document.querySelector("#hidden");
let repeated = document.querySelector("#repeated");

con.addEventListener("click", async function()
{
    let email = username.value;
    let first_password = password.value;
    let confirmed = confirm.value;

    if (confirmed == first_password && first_password.length >= 8)
    {
        let response = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: first_password
            })
        });

        let data = await response.json();

        if (response.ok)
        {
            window.location.href = "Login.html";
        }
        else
        {
            output.innerHTML = data.message;
        }

        hidden.innerHTML = "";
        repeated.innerHTML = "";
    }
    else if (confirmed == first_password && first_password.length < 8)
    {
        hidden.innerHTML = "Your password must have at least 8 characters ";
        repeated.innerHTML = "";
    }
    else if (confirmed != first_password && first_password.length >= 8)
    {
        hidden.innerHTML = "";
        repeated.innerHTML = "Make sure your passwords match ";
    }
    else
    {
        hidden.innerHTML = "Your password must have at least 8 characters ";
        repeated.innerHTML = "Make sure your passwords match ";
    }
});

window.onload = function()
{
    const canvas = document.getElementById("pet_display");
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 200;
    const petField = new PetCanvas(ctx, canvas.width, canvas.height);
}

class PetCanvas
{
    #ctx;
    #width;
    #height;

    constructor(ctx, width, height)
    {
        this.#ctx = ctx;
        this.#ctx.strokeStyle = "white";
        this.#width = width;
        this.#height = height;
        this.#draw(100, 100);
        this.#draw(-100, -100);
        this.#draw(300, 300);
        this.#draw(400, 200);
        this.#draw(100, 10);
    }
    #draw(x,y)
    {
        const length = 300;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x,y);
        this.#ctx.lineTo(x - length, y / length);
        this.#ctx.stroke();
    }
    
}
ctx.beginPath();
ctx.strokeStyle= "green";
ctx.arc(50, 20, 50, Math.PI * 2,false);
ctx.stroke();
ctx.closePath();
ctx.fillRect(100, 0, 50, 100);