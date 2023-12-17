import { Router } from "express";
import { PRODUCTS_FILE_PATH } from "../filenameUtils.js";
import { ProductManager } from "../models/ProductManager.js";

const productRouter = Router();

const productManager = new ProductManager({
  nombre: "server",
  path: PRODUCTS_FILE_PATH,
});

productRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  if (!!limit && (Number.isNaN(Number(limit)) || limit <= 0)) {
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

productRouter.get("/:uid", async (req, res) => {
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

productRouter.post("/", async (req, res) => {
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

export default productRouter;
