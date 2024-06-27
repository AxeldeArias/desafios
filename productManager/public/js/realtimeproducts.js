import {
  addDeleteEventListener,
  addEditEventListener,
} from "./addClickEventListener.js";

const socket = io();

const olProducts = document.querySelector("#ol-products");

socket.on("products", (products) => {
  const htmlProducts = products.map(
    (product) =>
      `<li><div class="row"><ul><li>id: ${product._id}</li><li>code: ${
        product.code
      }</li><li>title: ${product.title}</li><li>description: ${
        product.description
      }</li><li>price: ${product.price}</li><li>thumbnail: ${
        product.thumbnail
      }</li><li>stock: ${product.stock}</li></ul><button ${
        product.role === "PREMIUM" ? "disabled" : ""
      } class="deleteButton" data-id="${product._id}">Delete</button>
      <button ${
        product.role === "PREMIUM" ? "disabled" : ""
      } class="
      " data-id="${product._id}">Edit</button>
      </div></li>`
  );

  olProducts.innerHTML = htmlProducts.join("");
  addDeleteEventListener();
  addEditEventListener();
});

const handleFormSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      thumbnail: formData.get("thumbnail").split(";"),
      code: formData.get("code"),
      stock: Number(formData.get("stock")),
    }),
  });
};

addDeleteEventListener();
addEditEventListener();

const form = document.getElementById("product-form");
form.addEventListener("submit", handleFormSubmit);
