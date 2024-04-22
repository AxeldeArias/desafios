import { ProductsBDManager } from "../dao/mongo/ProductsBDManager.js";
import { emitSocketEventToAll } from "../utils/socketUtils.js";
import { productsService } from "../repositories/index.js";

export class ProductsController {
  getAll = async (req, res) => {
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

    const products = await productsService.getProducts({
      limit,
      page,
      sort,
      query,
      sort: sortQuery,
    });

    res.status(200).send({
      status: "success",
      products: products.docs,
    });
  };

  getOne = async (req, res) => {
    try {
      const product = await productsService.getProductById(req.params.pid);
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
  };

  addProduct = async (req, res) => {
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
      await productsService.addProduct({
        code,
        description,
        price,
        stock,
        thumbnail,
        title,
      });

      const products = await productsService.getProducts();

      emitSocketEventToAll(req, res, "products", products.docs);

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
  };

  updateOne = async (req, res) => {
    try {
      const newProduct = await productsService.updateProduct(req.params.pid, {
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
  };

  deleteOne = async (req, res) => {
    try {
      await productsService.deleteProduct(req.params.pid, {
        ...req.body,
      });

      const products = await productsService.getProducts();
      emitSocketEventToAll(req, res, "products", products.docs);

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
  };
}
