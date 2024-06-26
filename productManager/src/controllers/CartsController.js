import Mongoose from "mongoose";

import {
  cartsService,
  productsService,
  ticketService,
} from "../repositories/index.js";
import EErrors from "../errors/ErrorsList.js";
import CustomError from "../errors/CustomError.js";

export class CartsController {
  create = async (_req, res, next) => {
    try {
      const cart = await cartsService.create({ products: [] });
      return res.status(200).send({
        status: "success",
        data: { cartId: cart._id },
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req, res) => {
    const result = await cartsService.getCarts();
    return res.status(200).send({
      status: "success",
      data: { carts: result },
    });
  };

  getOne = async (req, res, next) => {
    try {
      const cartList = await cartsService.getCart(req.params.cid);
      if (!cartList) {
        CustomError.createError({
          name: "Carts Controller - getOne",
          code: EErrors.NO_EXIST_CART,
          message: "NO_EXIST_CART",
        });
      }
      return res.status(200).send({
        status: "success",
        data: cartList,
      });
    } catch (error) {
      next(error);
    }
  };

  addProduct = async (req, res, next) => {
    try {
      const { quantity } = req.body;
      if (req.user.role === "PREMIUM") {
        const { owner } = await productsService.getProductById(req.params.pid);
        if (owner === req.user.email) {
          CustomError.createError({
            name: "Add product to cart",
            code: EErrors.NOT_AUTHORIZED,
            message: "You can not add your own product",
          });
        }
      }
      try {
        const product = await cartsService.addProduct({
          cid: req.params.cid,
          productId: req.params.pid,
          quantity: quantity ?? 1,
        });

        req.logger.debug("product added");
        return res.status(200).send({
          status: "success",
          data: product,
        });
      } catch (e) {
        if (e.code === "no-exist-product") {
          CustomError.createError({
            name: "Carts Controller - add Product",
            code: EErrors.NO_EXIST_PRODUCT,
            message: e.description,
          });
        }
        throw e;
      }
    } catch (error) {
      next(error);
    }
  };

  updateProducts = async (req, res, next) => {
    try {
      const products = req.body;
      const cartList = await cartsService.updateProducts({
        cid: req.params.cid,
        products,
      });
      return res.status(200).send({
        status: "success",
        data: cartList,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      try {
        const product = await cartsService.deleteProduct({
          cid: req.params.cid,
          productId: req.params.pid,
        });

        req.logger.debug("product deleted");
        return res.status(200).send({
          status: "success",
          data: product,
        });
      } catch (e) {
        if (e.code === "no-exist-product") {
          CustomError.createError({
            name: "Carts Controller - deleteProduct",
            code: EErrors.NO_EXIST_PRODUCT,
            message: e.description,
          });
        }
        throw e;
      }
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      try {
        const { quantity } = req.body;
        const product = await cartsService.updateProduct({
          cid: req.params.cid,
          productId: req.params.pid,
          quantity,
        });

        req.logger.debug("product updated");
        return res.status(200).send({
          status: "success",
          data: product,
        });
      } catch (e) {
        if (e.code === "no-exist-product") {
          throw CustomError.createError({
            name: "Carts Controller - updateProduct",
            code: EErrors.NO_EXIST_PRODUCT,
            message: e.description,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  purchase = async (req, res, next) => {
    try {
      const cartList = await cartsService.getCart(req.params.cid);
      const productsToBuy = cartList.products.filter(
        ({ product }) => !!product
      );

      if (productsToBuy.length === 0) {
        CustomError.createError({
          name: "Carts Controller - purchase",
          code: EErrors.INSUFFICIENT_STOCK,
          message:
            "The products you want to purchase do not exist. They have been deleted.p",
        });
      }

      let productsWithStock = [];
      let productsWithoutStock = [];
      let amount = 0;

      for (const currentProduct of productsToBuy) {
        const { product, quantity } = currentProduct;

        const { stock, price } = await productsService.getProductById(
          product._id
        );

        if (stock - quantity > 0) {
          amount += price * quantity;
          productsWithStock.push(currentProduct);
        } else {
          productsWithoutStock.push(currentProduct);
        }

        if (stock - quantity >= 0) {
          await productsService.updateProduct(product._id, {
            stock: stock - quantity,
          });
        }
      }

      if (productsWithStock.length === 0) {
        CustomError.createError({
          name: "Carts Controller - purchase",
          code: EErrors.INSUFFICIENT_STOCK,
          message: `Insufficient stock for some products. Products without sufficient stock: ${productsWithoutStock.map(
            ({ product }, index, array) =>
              `${product.description} ${
                index === array.length - 1 ? "." : ", "
              }`
          )} Please remove these products.`,
        });
      }

      const ticket = await ticketService.create({
        purchaser: req.user.email,
        code: new Mongoose.Types.ObjectId(),
        purchaser_datetime: new Date(),
        amount,
      });

      await cartsService.updateProducts({
        cid: req.params.cid,
        products: productsWithoutStock,
      });

      req.logger.info("purchase done");
      return res.status(200).send({ ticket });
    } catch (error) {
      next(error);
    }
  };
}
