import express from "express";
import productRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
