import express from "express";
import productRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter);
app.use("/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
