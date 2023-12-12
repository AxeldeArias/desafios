import express from "express";
import { ProductManager } from "./ProductManager.js";

const PORT = 3000;
const PRODUCTS_FILE_PATH = "./src/files/productManager-dev-server.json";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager({
  nombre: "server",
  path: PRODUCTS_FILE_PATH,
});

app.get("/products", async (req, res) => {
  const { limit } = req.query;

  if (limit && (Number.isNaN(limit) || limit <= 0)) {
    return res.status(400).send({
      status: "bad request",
      description: "limit inválido",
    });
  }

  const products = await productManager.getProducts();

  res.status(200).send({
    status: "success",
    products:
      !!limit && products.length > limit ? products.slice(0, limit) : products,
  });
});

app.get("/products/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const product = await productManager.getProductById(Number(uid));
    res.status(200).send({ product });
  } catch (e) {
    console.log(e);
    if (e?.code === "no-exist-product") {
      res.status(404).send({
        status: "success",
        products: e,
      });
    } else {
      res.status(500).send({
        status: "success",
        products: e,
      });
    }
  }
});

app.post("/products", async (req, res) => {
  const { code, description, price, stock, thumbnail, title } = req.body;
  if (
    !req.body ||
    code ||
    description ||
    price ||
    stock ||
    thumbnail ||
    title
  ) {
    return res.status(400).send({
      status: "error",
      error:
        "Falta alguno de estos campos obligatorios: code, description, price, stock, thumbnail, title. ",
    });
  }

  const newProduct = await productManager.addProduct({
    code,
    description,
    price,
    stock,
    thumbnail,
    title,
  });

  res.status(200).send({
    status: "success",
    product: newProduct,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
