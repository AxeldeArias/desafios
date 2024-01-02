console.log("index.js");

const socket = io();

socket.emit("message", "hola server");
socket.on("products", (products) => {
  console.log({ product: products.map((product) => product.code) });
});
