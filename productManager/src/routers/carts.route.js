import { Router } from "express";
import { CartsController } from "../controllers/CartsController.js";
import { JWTStrategy } from "../middlewares/auth.js";

const cartsRouter = Router();

const cartsController = new CartsController();

cartsRouter.post("/", JWTStrategy, cartsController.create);
cartsRouter.get("/", JWTStrategy, cartsController.getAll);

cartsRouter.get("/:cid", JWTStrategy, cartsController.getOne);
cartsRouter.put("/:cid", JWTStrategy, cartsController.updateProducts);

cartsRouter.post("/:cid/product/:pid", JWTStrategy, cartsController.addProduct);
cartsRouter.delete(
  "/:cid/product/:pid",
  JWTStrategy,
  cartsController.updateProducts
);
cartsRouter.put(
  "/:cid/product/:pid",
  JWTStrategy,
  cartsController.updateProduct
);

cartsRouter.post("/:cid/purchase", JWTStrategy, cartsController.purchase);

export default cartsRouter;
