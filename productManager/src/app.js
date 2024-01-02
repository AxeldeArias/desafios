import express from "express";
import productRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";
import handlebars from "express-handlebars";
import { ABSOLUTE_PATHS } from "./utils/filenameUtils.js";

import { Server as ServerIO } from "socket.io";
import viewsRouter from "./routers/views.route.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", ABSOLUTE_PATHS.viewsPath);
app.set("view engine", "handlebars");

app.use("", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const io = new ServerIO(httpServer);

io.on("connection", (socket) => {
  app.set("socket", socket);
  console.log("cliente conectado");
});
