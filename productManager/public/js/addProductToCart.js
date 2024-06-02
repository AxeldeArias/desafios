document.querySelectorAll(".addToCart").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const [productId, cartId] = event.target.getAttribute("data-id").split("|");

    try {
      const result = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
      });
      if (result.ok) {
        alert("se agrego correctamente");
      } else {
        alert("no se pudo agregar el producto al carrito");
      }
    } catch (error) {
      alert("no se pudo agregar el producto al carrito");
    }
  });
});
