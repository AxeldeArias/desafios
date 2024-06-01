import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authorization, JWTStrategy } from "../middlewares/auth.js";

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  "/premium/:uid",
  JWTStrategy,
  authorization(["ADMIN"]),
  userController.togglePremium
);

export default userRouter;
