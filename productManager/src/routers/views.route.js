import { Router } from "express";
import { ProductsBDManager } from "../Dao/ProductsBDManager.js";
import { ABSOLUTE_PATHS } from "../utils/filenameUtils.js";
import { CartsBDManager } from "../Dao/CartsBDManager.js";

const viewsRouter = Router();

const productsBDManager = new ProductsBDManager({
  nombre: "views",
});

const cartManager = new CartsBDManager();

viewsRouter.get("/", async (_req, res) => {
  const products = await productsBDManager.getProducts();
  res.render("index.handlebars", { products });
});
viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productsBDManager.getProducts();
  res.render("realtimeproducts.handlebars", { products });
});
viewsRouter.get("/chat", async (_req, res) => {
  res.render("chat.handlebars");
});
viewsRouter.get("/products", async (req, res) => {
  const { limit = 1, pageQuery = 1 } = req.query;
  const products = await productsBDManager.getProducts({
    limit,
    page: pageQuery,
  });
  const carts = await cartManager.getCarts();
  res.render("products.handlebars", {
    ...products,
    products: products.docs,
    carts: carts,
  });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCart(req.params.cid);
  res.render("cart.handlebars", {
    cart,
  });
});

export default viewsRouter;
