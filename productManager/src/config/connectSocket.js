import { Server as ServerIO } from "socket.io";
import { logger } from "./logger.js";

export const connectSocket = (app, httpServer) => {
  const io = new ServerIO(httpServer);

  io.on("connection", () => {
    app.set("socket", io);
    logger.info("cliente conectado");
  });
};
