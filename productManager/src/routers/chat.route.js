import { Router } from "express";
import { emitSocketEventToAll } from "../utils/socketUtils.js";
import { ChatBDManager } from "../Dao/ChatBDManager.js";

const chatRouter = Router();

const chatManager = new ChatBDManager({ nombre: "main chat" });

chatRouter.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const message = req.body.message;
    const chat = await chatManager.addMessage({ message, email });
    emitSocketEventToAll(req, res, "chat", chat);
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send({
      status: "error",
      error: error?.message ?? "",
    });
  }
});

chatRouter.get("/", async (req, res) => {
  try {
    const chat = await chatManager.getChat();
    emitSocketEventToAll(req, res, "chat", chat);
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send({
      status: "error",
      error: error?.message ?? "",
    });
  }
});

export default chatRouter;
