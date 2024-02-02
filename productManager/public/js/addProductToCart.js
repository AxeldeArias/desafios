"seeButton";

const seeButton = document.querySelector("#seeButton");
let cartId = document.getElementById("selectCart").value;
seeButton.href = `/carts/${cartId}`;

document.getElementById("selectCart").addEventListener("change", (event) => {
  cartId = event.target.value;
  seeButton.href = `/carts/${cartId}`;
});

seeButton.addEventListener;

document.querySelectorAll(".addToCart").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const productId = event.target.getAttribute("data-id");
    try {
      await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
      });
      alert("se agrego correctamente");
    } catch (error) {
      alert("error");
    }
  });
});
