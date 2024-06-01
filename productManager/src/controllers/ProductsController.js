import { emitSocketEventToAll } from "../utils/socketUtils.js";
import { productsService } from "../repositories/index.js";
import {
  generateAddProductRequiredPropertiesError,
  generateAddProductThumbailError,
} from "../errors/info/ProductInfo.js";
import EErrors from "../errors/ErrorsList.js";
import CustomError from "../errors/CustomError.js";

export class ProductsController {
  getAll = async (req, res, next) => {
    try {
      const { limit, page, sort } = req.query;
      const query = req.query.query ? JSON.parse(req.query.query) : undefined;

      if (!!limit && (Number.isNaN(Number(limit)) || limit <= 0)) {
        CustomError.createError({
          name: "Products Controller - getAll",
          code: EErrors.INVALID_PRODUCT_PARAMS,
          cause: "invalid limit param",
          message: "INVALID_PRODUCT_PARAMS",
        });
      }

      if (sort && !["asc", "desc"].includes(sort)) {
        CustomError.createError({
          name: "Products Controller - getAll",
          code: EErrors.INVALID_PRODUCT_PARAMS,
          cause: "invalid sort param",
          message: "INVALID_PRODUCT_PARAMS",
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
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req, res, next) => {
    try {
      const product = await productsService.getProductById(req.params.pid);
      res.status(200).send({ product });
    } catch (e) {
      if (e?.code === "no-exist-product") {
        CustomError.createError({
          name: "Products Controller - getOne",
          code: EErrors.NO_EXIST_PRODUCT,
          cause: e.description,
          message: "NO_EXIST_PRODUCT",
        });
      } else {
        next(e);
      }
    }
  };

  addProduct = async (req, res, next) => {
    try {
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
        CustomError.createError({
          name: "Products Controller - addProduct",
          code: EErrors.INVALID_PRODUCT_PARAMS,
          cause: generateAddProductRequiredPropertiesError(),
          message: "INVALID_PRODUCT_PARAMS",
        });
      }

      if (typeof thumbnail !== "object" || thumbnail.length <= 0) {
        CustomError.createError({
          name: "Products Controller - addProduct",
          code: EErrors.INVALID_PRODUCT_THUMBNAIL,
          cause: generateAddProductThumbailError(),
          message: "INVALID_PRODUCT_PARAMS",
        });
      }

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

      req.logger.debug("product created");
      return res.status(200).send({
        status: "success",
      });
    } catch (error) {
      next(error);
    }
  };

  updateOne = async (req, res, next) => {
    try {
      const newProduct = await productsService.updateProduct(req.params.pid, {
        ...req.body,
      });

      req.logger.debug("product updated");
      return res.status(200).send({
        status: "success",
        product: newProduct,
      });
    } catch (error) {
      next(error);
    }
  };

  isOwnerPremiumOrAdmin = async (req, _res, next) => {
    console.log({ req });
    if (req.user.role === "PREMIUM") {
      const product = await this.productsBDManager
        .getProductById(req.params.pid)
        .lean();
      if (product.owner !== req.user.email) {
        CustomError.createError({
          name: "Dele product",
          code: EErrors.NOT_AUTHORIZED,
          message: "You are not the owner of this product",
        });
      }
    }
    next();
  };

  deleteOne = async (req, res, next) => {
    try {
      if (req.user.role === "PREMIUM") {
        const product = await this.productsBDManager
          .getProductById(req.params.pid)
          .lean();
        if (product.owner !== req.user.email) {
          CustomError.createError({
            name: "Dele product",
            code: EErrors.NOT_AUTHORIZED,
            message: "You are not the owner of this product",
          });
        }
      }
      await productsService.deleteProduct(req.params.pid, {
        ...req.body,
      });

      const products = await productsService.getProducts();
      emitSocketEventToAll(req, res, "products", products.docs);

      req.logger.debug("product deleted");
      return res.status(200).send({
        status: "success",
        product: products,
      });
    } catch (error) {
      next(error);
    }
  };
}
