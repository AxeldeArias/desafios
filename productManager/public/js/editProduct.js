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
      } class="buttons" data-id="${product._id}">Delete</button></div></li>`
  );

  olProducts.innerHTML = htmlProducts.join("");
  addDeleteEventListener();
  addEditEventListener();
});
