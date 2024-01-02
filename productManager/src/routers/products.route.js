import { Router } from "express";
import { PRODUCTS_FILE_PATH } from "../utils/filenameUtils.js";
import { ProductsManager } from "../managers/ProductsManager.js";
import { emitSocketEvent } from "../utils/socketUtils.js";

const productRouter = Router();

const productManager = new ProductsManager({
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

productRouter.get("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  if (Number.isNaN(pid)) {
    return res.status(400).send({
      status: "error",
      error: "pid no es numérico",
    });
  }

  try {
    const product = await productManager.getProductById(pid);
    res.status(200).send({ product });
  } catch (e) {
    if (e?.code === "no-exist-product") {
      res.status(404).send({
        status: "success",
        products: e,
      });
    } else {
      res.status(500).send({
        status: "success",
        products: e?.message ?? "",
      });
    }
  }
});

productRouter.post("/", async (req, res) => {
  const { code, description, price, stock, thumbnail, title } = req.body;
  if (
    !req.body ||
    !code ||
    !description ||
    !price ||
    !stock ||
    !thumbnail ||
    !title
  ) {
    return res.status(400).send({
      status: "error",
      error:
        "Falta alguno de estos campos obligatorios: code, description, price, stock, thumbnail, title. ",
    });
  }

  if (typeof thumbnail !== "object" || thumbnail.length <= 0) {
    return res.status(400).send({
      status: "error",
      error: "thumbnail debe ser un array de strings ",
    });
  }

  try {
    const products = await productManager.addProduct({
      code,
      description,
      price,
      stock,
      thumbnail,
      title,
    });

    emitSocketEvent(req, res, "products", products);

    res.status(200).send({
      status: "success",
      product: products,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      error: error?.message ?? "",
    });
  }
});

productRouter.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  if (Number.isNaN(pid)) {
    return res.status(400).send({
      status: "error",
      error: "pid no es numérico",
    });
  }

  try {
    const newProduct = await productManager.updateProduct(pid, {
      ...req.body,
    });
    return res.status(200).send({
      status: "success",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      error: error?.message ?? "",
    });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  if (Number.isNaN(pid)) {
    return res.status(400).send({
      status: "error",
      error: "pid no es numérico",
    });
  }

  try {
    const newProduct = await productManager.deleteProduct(pid, {
      ...req.body,
    });
    return res.status(200).send({
      status: "success",
      product: newProduct,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      error: error?.message ?? "",
    });
  }
});
export default productRouter;
