import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController.js";

const productRouter = Router();

const productsController = new ProductsController();

productRouter.get("/", productsController.getAll);
productRouter.post("/", productsController.addProduct);

productRouter.get("/:pid", productsController.getOne);
productRouter.put("/:pid", productsController.updateOne);
productRouter.delete("/:pid", productsController.deleteOne);

export default productRouter;
