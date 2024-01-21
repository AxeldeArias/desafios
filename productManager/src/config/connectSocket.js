import { Server as ServerIO } from "socket.io";

export const connectSocket = (app, httpServer) => {
  const io = new ServerIO(httpServer);

  io.on("connection", () => {
    app.set("socket", io);
    console.log("cliente conectado");
  });
};
