import { Server as ServerIO } from "socket.io";

export const connectSocket = (httpServer) => {
  const io = new ServerIO(httpServer);

  io.on("connection", (socket) => {
    app.set("socket", socket);
    console.log("cliente conectado");
  });
};
