import { Router } from "express";
import { ABSOLUTE_PATHS } from "../utils/filenameUtils.js";
import { ProductsBDManager } from "../dao/ProductsBDManager.js";
import { emitSocketEventToAll } from "../utils/socketUtils.js";

const productRouter = Router();

const productsManager = new ProductsBDManager({
  nombre: "server",
});

productRouter.get("/", async (req, res) => {
  const { limit, page, sort, query } = req.query;

  if (!!limit && (Number.isNaN(Number(limit)) || limit <= 0)) {
    return res.status(400).send({
      status: "bad request",
      description: "limit inválido",
    });
  }

  if (sort && !["asc", "desc"].includes(sort)) {
    return res.status(400).send({
      status: "bad request",
      description: "invalid sort query",
    });
  }

  const sortQuery = sort === "asc" ? { _id: 1 } : { _id: -1 };

  const products = await productsManager.getProducts({
    limit,
    page,
    sort,
    query,
    sort: sortQuery,
  });

  res.status(200).send({
    status: "success",
    products: products,
  });
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const product = await productsManager.getProductById(req.params.pid);
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
    await productsManager.addProduct({
      code,
      description,
      price,
      stock,
      thumbnail,
      title,
    });

    const products = await productsManager.getProducts();

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
    const newProduct = await productsManager.updateProduct(req.params.pid, {
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
    await productsManager.deleteProduct(req.params.pid, {
      ...req.body,
    });

    const products = await productsManager.getProducts();

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
