document.querySelectorAll(".addToCart").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const [productId, cartId] = event.target.getAttribute("data-id").split("|");

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
