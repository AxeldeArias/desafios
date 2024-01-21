import { __dirname } from "../utils/filenameUtils.js";
import { chatModel } from "./models/chat.model.js";

export class ChatBDManager {
  constructor({ nombre }) {
    if (!nombre) throw new Error("nombre es requerido");
    this.nombre = nombre;
  }

  async addMessage({ message, email } = {}) {
    await chatModel.create({ email, message });

    const chat = await this.getChat();
    return chat;
  }
  async getChat() {
    return chatModel.find().lean();
  }
}
