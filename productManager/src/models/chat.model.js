import mongoose from "mongoose";

export const CHAT_COLLECTION = "chat";

const chatSchema = new mongoose.Schema({
  email: String,
  message: String,
});

export const chatModel = mongoose.model(CHAT_COLLECTION, chatSchema);
