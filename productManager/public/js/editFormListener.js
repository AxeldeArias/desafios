export function editFormListener() {
  const form = document.getElementById("edit-product-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputs = form.elements;

    const id = inputs["id"].value;
    const title = inputs["title"].value;
    const description = inputs["description"].value;
    const price = inputs["price"].value;
    const thumbnail = inputs["thumbnail"].value;
    const code = inputs["code"].value;
    const stock = inputs["stock"].value;

    fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Puedes añadir otras cabeceras según sea necesario
      },
      body: JSON.stringify({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return alert("error al actualizar");
        }
        alert("producto actualizado");
        // Procesar la respuesta si es necesario
      })
      .catch((error) => {
        alert("error al actualizar");
        // Manejar el error apropiadamente
      });
  });
}

editFormListener();
