import { Router } from "express";
import { ABSOLUTE_PATHS } from "../utils/filenameUtils.js";
import { CartsBDManager } from "../Dao/CartsBDManager.js";
import { cartModel } from "../Dao/models/cart.model.js";

const cartsRouter = Router();

const carts = new CartsBDManager({ path: ABSOLUTE_PATHS.cart });

cartsRouter.post("/", async (_req, res) => {
  try {
    const cart = await cartModel.create({ products: [] });
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
  const result = await cartModel.find();
  return res.status(200).send({
    status: "success",
    data: { carts: result },
  });
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartList = await cartModel.findById(req.params.cid);
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
    const product = await carts.addProduct({
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

export default cartsRouter;
