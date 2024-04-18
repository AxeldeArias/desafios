import { ChatBDManager } from "../dao/ChatBDManager.js";
import { emitSocketEventToAll } from "../utils/socketUtils.js";

export class ChatController {
  #chatManager = new ChatBDManager({ nombre: "main chat" });

  addMessage = async (req, res) => {
    try {
      const email = req.body.email;
      const message = req.body.message;
      const chat = await this.#chatManager.addMessage({ message, email });
      emitSocketEventToAll(req, res, "chat", chat);
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error?.message ?? "",
      });
    }
  };

  getChat = async (req, res) => {
    try {
      const chat = await this.#chatManager.getChat();
      emitSocketEventToAll(req, res, "chat", chat);
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error?.message ?? "",
      });
    }
  };
}
