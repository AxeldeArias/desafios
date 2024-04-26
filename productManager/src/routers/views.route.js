import { Router } from "express";
import { ViewController } from "../controllers/ViewsController.js";
import { authorization, JWTStrategy } from "../middlewares/auth.js";
import { SessionController } from "../controllers/SessionController.js";

const viewsRouter = Router();
const viewsController = new ViewController();
const sessionController = new SessionController();

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

viewsRouter.get(
  "/current",
  JWTStrategy,
  authorization(["USER", "ADMIN"]),
  sessionController.getToken
);

export default viewsRouter;
