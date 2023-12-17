import { Router } from "express";
import { CART_PATH, PRODUCTS_FILE_PATH } from "../filenameUtils.js";
import { ProductManager } from "../models/ProductManager.js";
import { Carts } from "../models/Carts.js";

const cartsRouter = Router();

const carts = new Carts({ path: CART_PATH });

cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  const productList = await carts.getCart(cid);
  return res.status(400).send({
    status: "success",
    data: productList,
  });
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const product = await carts.addProduct({
      cid,
      productId: Number(pid),
      quantity: 1,
    });
    return res.status(400).send({
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
        error: e,
      });
    }
  }
});

export default cartsRouter;
