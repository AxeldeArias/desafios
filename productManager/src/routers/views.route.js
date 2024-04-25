import { Router } from "express";
import { ViewController } from "../controllers/ViewsController.js";
import { authorization, JWTStrategy } from "../middlewares/auth.js";

const viewsRouter = Router();
const viewsController = new ViewController();

viewsRouter.get("/", viewsController.renderLoginPage);
viewsRouter.get("/register", viewsController.renderRegisterPage);
viewsRouter.get(
  "/chat",
  authorization(["USER"]),
  viewsController.renderChatPage
);

viewsRouter.get(
  "/realtimeproducts",
  JWTStrategy,
  authorization(["ADMIN"]),
  viewsController.renderRealTimeProductsPage
);
viewsRouter.get(
  "/products",
  JWTStrategy,
  authorization(["USER"]),
  viewsController.renderProductsPage
);
viewsRouter.get(
  "/carts/:cid",
  JWTStrategy,
  authorization(["USER"]),
  viewsController.renderCartPage
);

export default viewsRouter;
