import { Router } from "express";
import { ChatController } from "../controllers/ChatController.js";

const chatRouter = Router();
const chatController = new ChatController();

chatRouter.post(
  "/",
  JWTStrategy,
  authorization["USER"],
  chatController.addMessage
);

chatRouter.get("/", JWTStrategy, authorization["USER"], chatController.getChat);

export default chatRouter;
