import { Router } from "express";
import { CartsController } from "../controllers/CartsController.js";
import { authorization, JWTStrategy } from "../middlewares/auth.js";
import { cartPermission } from "../middlewares/carts.js";

const cartsRouter = Router();

const cartsController = new CartsController();

cartsRouter.post(
  "/",
  JWTStrategy,
  authorization["ADMIN"],
  cartsController.create
);
cartsRouter.get(
  "/",
  JWTStrategy,
  authorization["ADMIN"],
  cartsController.getAll
);

cartsRouter.get(
  "/:cid",
  JWTStrategy,
  authorization["USER"],
  cartPermission,
  cartsController.getOne
);
cartsRouter.put(
  "/:cid",
  JWTStrategy,
  authorization["USER"],
  cartPermission,
  cartsController.updateProducts
);

cartsRouter.post(
  "/:cid/product/:pid",
  JWTStrategy,
  authorization["USER"],
  cartPermission,
  cartsController.addProduct
);

cartsRouter.delete(
  "/:cid/product/:pid",
  JWTStrategy,
  authorization["ADMIN"],
  cartsController.updateProducts
);

cartsRouter.put(
  "/:cid/product/:pid",
  JWTStrategy,
  cartPermission,
  cartsController.updateProduct
);

cartsRouter.post(
  "/:cid/purchase",
  JWTStrategy,
  authorization["USER"],
  cartPermission,
  cartsController.purchase
);

export default cartsRouter;
