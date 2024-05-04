import { chatService } from "../repositories/index.js";
import { emitSocketEventToAll } from "../utils/socketUtils.js";

export class ChatController {
  addMessage = async (req, res) => {
    try {
      const email = req.body.email;
      const message = req.body.message;
      const chat = await chatService.addMessage({ message, email });
      emitSocketEventToAll(req, res, "chat", chat);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  getChat = async (req, res) => {
    try {
      const chat = await chatService.getChat();
      emitSocketEventToAll(req, res, "chat", chat);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}
