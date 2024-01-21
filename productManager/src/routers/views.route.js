import { Router } from "express";
import { ProductsFSManager } from "../Dao/ProductsFSManager.js";
import { ABSOLUTE_PATHS } from "../utils/filenameUtils.js";

const viewsRouter = Router();

const productsFSManager = new ProductsFSManager({
  nombre: "views",
  path: ABSOLUTE_PATHS.productsFiles,
});

viewsRouter.get("/", async (req, res) => {
  const products = await productsFSManager.getProducts();
  res.render("index.handlebars", { products });
});
viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productsFSManager.getProducts();
  res.render("realtimeproducts.handlebars", { products });
});

export default viewsRouter;
