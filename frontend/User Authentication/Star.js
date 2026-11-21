let amount = document.querySelector("#amount");
let button = document.querySelector("button");

let currency = 0;
button.addEventListener("click", function()
{
currency = currency + 1;
amount.innerHTML = currency;
}
);