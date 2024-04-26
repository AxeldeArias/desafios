import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController.js";
import { JWTStrategy } from "../middlewares/auth.js";

const productRouter = Router();

const productsController = new ProductsController();

productRouter.get(
  "/",
  JWTStrategy[("USER", "ADMIN")],
  productsController.getAll
);

productRouter.post("/", JWTStrategy["ADMIN"], productsController.addProduct);

productRouter.get(
  "/:pid",
  JWTStrategy[("USER", "ADMIN")],
  productsController.getOne
);
productRouter.put("/:pid", JWTStrategy["ADMIN"], productsController.updateOne);
productRouter.delete(
  "/:pid",
  JWTStrategy["ADMIN"],
  productsController.deleteOne
);

export default productRouter;
