import Mongoose from "mongoose";

import {
  cartsService,
  productsService,
  ticketService,
} from "../repositories/index.js";

export class CartsController {
  create = async (_req, res) => {
    try {
      const cart = await cartsService.create({ products: [] });
      return res.status(200).send({
        status: "success",
        data: { cartId: cart._id },
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error?.message ?? "",
      });
    }
  };

  getAll = async (_req, res) => {
    const result = await cartsService.getCarts();
    return res.status(200).send({
      status: "success",
      data: { carts: result },
    });
  };

  getOne = async (req, res) => {
    try {
      const cartList = await cartsService.getCart(req.params.cid);
      if (!cartList) {
        return res.status(404).send({
          status: "error",
          error: "carrito no encontrado",
        });
      }
      return res.status(200).send({
        status: "success",
        data: cartList,
      });
    } catch (error) {
      return res.status(error?.message ? 404 : 500).send({
        status: "error",
        error: error?.message ?? "",
      });
    }
  };

  addProduct = async (req, res) => {
    const { quantity } = req.body;

    try {
      const product = await cartsService.addProduct({
        cid: req.params.cid,
        productId: req.params.pid,
        quantity: quantity ?? 1,
      });
      return res.status(200).send({
        status: "success",
        data: product,
      });
    } catch (e) {
      if (e.code === "no-exist-product") {
        return res.status(409).send({
          status: "error",
          error: e,
        });
      } else {
        return res.status(500).send({
          status: "error",
          error: e?.message ?? "",
        });
      }
    }
  };

  updateProducts = async (req, res) => {
    try {
      const products = req.body;
      const cartList = await cartsService.updateProducts({
        cid: req.params.cid,
        products,
      });
      cartList;
      return res.status(200).send({
        status: "success",
        data: cartList,
      });
    } catch (error) {
      return res.status(error?.message ? 404 : 500).send({
        status: "error",
        error: error?.message ?? "",
      });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const product = await cartsService.deleteProduct({
        cid: req.params.cid,
        productId: req.params.pid,
      });
      return res.status(200).send({
        status: "success",
        data: product,
      });
    } catch (e) {
      if (e.code === "no-exist-product") {
        return res.status(409).send({
          status: "error",
          error: e,
        });
      } else {
        return res.status(500).send({
          status: "error",
          error: e?.message ?? "",
        });
      }
    }
  };

  updateProduct = async (req, res) => {
    try {
      const { quantity } = req.body;
      const product = await cartsService.updateProduct({
        cid: req.params.cid,
        productId: req.params.pid,
        quantity,
      });
      return res.status(200).send({
        status: "success",
        data: product,
      });
    } catch (e) {
      if (e.code === "no-exist-product") {
        return res.status(409).send({
          status: "error",
          error: e,
        });
      } else {
        return res.status(500).send({
          status: "error",
          error: e?.message ?? "",
        });
      }
    }
  };

  purchase = async (req, res) => {
    const cartList = await cartsService.getCart(req.params.cid);
    const productsToBuy = cartList.products.filter(({ product }) => !!product);
    if (productsToBuy.length === 0) {
      return res.status(500).send({
        status: "no products to buy",
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

      await productsService.updateProduct(product._id, {
        stock: stock - quantity,
      });
    }

    if (productsWithStock.length === 0) {
      return res.status(500).send({
        status: "insufficient stock",
      });
    }

    await ticketService.create({
      purchaser: req.user.email,
      code: new Mongoose.Types.ObjectId(),
      purchaser_datetime: new Date(),
      amount,
    });

    await cartsService.updateProducts({
      cid: req.params.cid,
      products: productsWithoutStock,
    });

    return res.status(200).redirect(`/carts/${req.user.cartId}`);
  };
}
