import { Router } from "express";
import { ViewController } from "../controllers/ViewsController.js";
import { userAuth } from "../middlewares/auth.js";

const viewsRouter = Router();
const viewsController = new ViewController();

viewsRouter.get("/", viewsController.renderLoginPage);
viewsRouter.get("/register", viewsController.renderRegisterPage);
viewsRouter.get("/chat", viewsController.renderChatPage);

viewsRouter.get(
  "/realtimeproducts",
  userAuth,
  viewsController.renderRealTimeProductsPage
);
viewsRouter.get("/products", userAuth, viewsController.renderProductsPage);
viewsRouter.get("/carts/:cid", userAuth, viewsController.renderCartPage);

export default viewsRouter;
