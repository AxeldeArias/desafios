import { Router } from "express";
import { ProductsBDManager } from "../Dao/ProductsBDManager.js";
import { ABSOLUTE_PATHS } from "../utils/filenameUtils.js";

const viewsRouter = Router();

const productsBDManager = new ProductsBDManager({
  nombre: "views",
  path: ABSOLUTE_PATHS.productsFiles,
});

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

export default viewsRouter;
