import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.get("/logout", authController.logout);

authRouter.get("/github", authController.github);

authRouter.get(
  "/githubcallback",
  authController.githubCallback,
  authController.githubCallbackSuccess
);

authRouter.post("/forgot-password", authController.forgotPassword);

authRouter.get("/reset-password/:token", authController.resetPasswordToken);

authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
