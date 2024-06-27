export function editFormListener() {
  const form = document.getElementById("ticket-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const cartId = event.target.getAttribute("data-id");

    fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          return alert(body.error ?? "error al comprar carrito");
        }
        alert(`Cart purchased - Ticket #${body.ticket._id}`);
        window.location.href = `/products`;
        // Procesar la respuesta si es necesario
      })
      .catch((error) => {
        alert("error al comprar carrito");
        // Manejar el error apropiadamente
      });
  });
}

export function addRemoveEventListener() {
  document.querySelectorAll("#removeButton").forEach((button) => {
    const handleClick = (event) => {
      const pid = event.target.getAttribute("data-pid");
      const cid = event.target.getAttribute("data-cid");

      fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "DELETE",
      })
        .then(() => {
          alert("producto eliminado");
          window.location.href = `/carts/${cid}`;
        })
        .catch((e) => {
          console.log("e", e);
        });
    };

    button.addEventListener("click", handleClick);
  });
}

editFormListener();
addRemoveEventListener();
