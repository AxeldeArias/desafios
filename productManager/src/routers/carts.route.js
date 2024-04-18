import { Router } from "express";
import { CartsController } from "../controllers/CartsController.js";

const cartsRouter = Router();

const cartsController = new CartsController();

cartsRouter.post("/", cartsController.create);
cartsRouter.get("/", cartsController.getAll);

cartsRouter.get("/:cid", cartsController.getOne);
cartsRouter.put("/:cid", cartsController.updateProducts);

cartsRouter.post("/:cid/product/:pid", cartsController.addProduct);
cartsRouter.delete("/:cid/product/:pid", cartsController.updateProducts);
cartsRouter.put("/:cid/product/:pid", cartsController.updateProduct);

export default cartsRouter;
