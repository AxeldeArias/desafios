import { Router } from "express";
import { ABSOLUTE_PATHS } from "../utils/filenameUtils.js";
import { ProductsFSManager } from "../Dao/ProductsFSManager.js";
import { emitSocketEventToAll } from "../utils/socketUtils.js";
import { ProductsBDManager } from "../Dao/ProductsBDManager.js";

const productRouter = Router();

const productsFSManager = new ProductsBDManager({
  nombre: "server",
  path: ABSOLUTE_PATHS.productsFiles,
});

productRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  if (!!limit && (Number.isNaN(Number(limit)) || limit <= 0)) {
    return res.status(400).send({
      status: "bad request",
      description: "limit inválido",
    });
  }

  const products = await productsFSManager.getProducts();

  res.status(200).send({
    status: "success",
    products:
      !!limit && products.length > limit ? products.slice(0, limit) : products,
  });
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const product = await productsFSManager.getProductById(req.params.pid);
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
    const products = await productsFSManager.addProduct({
      code,
      description,
      price,
      stock,
      thumbnail,
      title,
    });

    emitSocketEventToAll(req, res, "products", products);

    return res.status(200).send({
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
  try {
    const newProduct = await productsFSManager.updateProduct(req.params.pid, {
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
  try {
    const products = await productsFSManager.deleteProduct(req.params.pid, {
      ...req.body,
    });

    emitSocketEventToAll(req, res, "products", products);

    return res.status(200).send({
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
export default productRouter;
