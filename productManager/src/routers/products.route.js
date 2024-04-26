import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController.js";
import { authorization, JWTStrategy } from "../middlewares/auth.js";

const productRouter = Router();

const productsController = new ProductsController();

productRouter.get("/", JWTStrategy, productsController.getAll);

productRouter.post(
  "/",
  JWTStrategy,
  authorization(["ADMIN"]),
  productsController.addProduct
);

productRouter.get("/:pid", JWTStrategy, productsController.getOne);
productRouter.put(
  "/:pid",
  JWTStrategy,
  authorization(["ADMIN"]),
  productsController.updateOne
);
productRouter.delete(
  "/:pid",
  JWTStrategy,
  authorization(["ADMIN"]),
  productsController.deleteOne
);

export default productRouter;
