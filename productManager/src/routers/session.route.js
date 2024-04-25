import { Router } from "express";
import { SessionController } from "../controllers/SessionController.js";
import { authorization, JWTStrategy } from "../middlewares/auth.js";

const sessionRouter = Router();
const sessionController = new SessionController();

sessionRouter.get(
  "/current",
  JWTStrategy,
  authorization(["USER", "ADMIN"]),
  sessionController.getToken
);

export default sessionRouter;
