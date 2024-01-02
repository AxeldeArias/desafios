import { Router } from "express";
import { CART_PATH } from "../utils/filenameUtils.js";
import { CartsManager } from "../managers/CartsManager.js";

const cartsRouter = Router();

const carts = new CartsManager({ path: CART_PATH });

cartsRouter.post("/", async (_req, res) => {
  try {
    const cartId = await carts.createCart();
    return res.status(200).send({
      status: "success",
      data: { cartId },
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      error: error?.message ?? "",
    });
  }
});

cartsRouter.get("/", async (_req, res) => {
  const result = await carts.getCarts();
  return res.status(200).send({
    status: "success",
    data: { carts: result },
  });
});

cartsRouter.get("/:cid", async (req, res) => {
  const cid = Number(req.params.cid);

  if (Number.isNaN(cid)) {
    return res.status(400).send({
      status: "error",
      error: "cid no es numérico",
    });
  }
  try {
    const cartList = await carts.getCart(cid);
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
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  const { quantity } = req.body;

  if (Number.isNaN(cid)) {
    return res.status(400).send({
      status: "error",
      error: "cid no es numérico",
    });
  }

  if (Number.isNaN(pid)) {
    return res.status(400).send({
      status: "error",
      error: "pid no es numérico",
    });
  }

  try {
    const product = await carts.addProduct({
      cid,
      productId: Number(pid),
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
