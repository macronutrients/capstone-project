window.onload = function()
{
    const canvas = document.getElementById("pet_display");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
    }
    #draw(x,y)
    {
        const length = 300;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x,y);
        this.#ctx.lineTo(x + length, y + length);
        this.#ctx.stroke();
    }
}