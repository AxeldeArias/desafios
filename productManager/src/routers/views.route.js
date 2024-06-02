import { Router } from "express";
import { ViewController } from "../controllers/ViewsController.js";
import { authorization, JWTStrategy } from "../middlewares/auth.js";

const viewsRouter = Router();
const viewsController = new ViewController();

viewsRouter.get("/", viewsController.renderLoginPage);

viewsRouter.get("/mockingproducts", viewsController.getMockingProducts);

viewsRouter.get("/register", viewsController.renderRegisterPage);
viewsRouter.get(
  "/chat",
  JWTStrategy,
  authorization(["USER"]),
  viewsController.renderChatPage
);

viewsRouter.get(
  "/realtimeproducts",
  JWTStrategy,
  authorization(["ADMIN", "PREMIUM"]),
  viewsController.renderRealTimeProductsPage
);
viewsRouter.get(
  "/products",
  JWTStrategy,
  authorization(["USER", "PREMIUM"]),
  viewsController.renderProductsPage
);
viewsRouter.get(
  "/carts/:cid",
  JWTStrategy,
  authorization(["USER", "PREMIUM"]),
  viewsController.renderCartPage
);

viewsRouter.get(
  "/current",
  JWTStrategy,
  authorization(["USER", "ADMIN"]),
  viewsController.current
);

viewsRouter.get("/logger", viewsController.logger);

export default viewsRouter;
