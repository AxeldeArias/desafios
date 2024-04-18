import { Router } from "express";
import { ChatController } from "../controllers/ChatController.js";

const chatRouter = Router();
const chatController = new ChatController();

chatRouter.post("/", chatController.addMessage);
chatRouter.get("/", chatController.getChat);

export default chatRouter;
