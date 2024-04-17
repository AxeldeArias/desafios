import { Router } from "express";
import { CartsBDManager } from "../dao/CartsBDManager.js";

const cartsRouter = Router();

const cartManager = new CartsBDManager();

cartsRouter.post("/", async (_req, res) => {
  try {
    const cart = await cartManager.create({ products: [] });
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
});

cartsRouter.get("/", async (_req, res) => {
  const result = await cartManager.getCarts();
  return res.status(200).send({
    status: "success",
    data: { carts: result },
  });
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartList = await cartManager.getCart(req.params.cid);
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
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const { quantity } = req.body;

  try {
    const product = await cartManager.addProduct({
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
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const products = req.body;
    const cartList = await cartManager.updateProducts({
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
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const product = await cartManager.deleteProduct({
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
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await cartManager.updateProduct({
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
});

export default cartsRouter;
