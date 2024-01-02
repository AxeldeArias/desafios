import { addClickEventListener } from "./addClickEventListener.js";

const form = document.getElementById("product-form");

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

addClickEventListener();

form.addEventListener("submit", handleFormSubmit);
