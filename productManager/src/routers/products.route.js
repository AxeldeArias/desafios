import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController.js";
import { authorization, JWTStrategy } from "../middlewares/auth.js";

const productRouter = Router();

const productsController = new ProductsController();

productRouter.get("/", JWTStrategy, productsController.getAll);

productRouter.post(
  "/",
  JWTStrategy,
  authorization(["ADMIN", "PREMIUM"]),
  productsController.addProduct
);

productRouter.get("/:pid", JWTStrategy, productsController.getOne);
productRouter.put(
  "/:pid",
  JWTStrategy,
  authorization(["ADMIN"]),
  productsController.isOwnerPremiumOrAdmin,
  productsController.updateOne
);
productRouter.delete(
  "/:pid",
  JWTStrategy,
  authorization(["ADMIN", "PREMIUM"]),
  productsController.isOwnerPremiumOrAdmin,
  productsController.deleteOne
);

export default productRouter;
