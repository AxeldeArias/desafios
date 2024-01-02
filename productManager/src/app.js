import express from "express";
import productRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";
import handlebars from "express-handlebars";
import { APP_PATH } from "./utils/filenameUtils.js";
import { Server as ServerIO } from "socket.io";

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", APP_PATH.viewsPath);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index.handlebars");
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const io = new ServerIO(httpServer);

io.on("connection", (socket) => {
  app.set("socket", socket);
  socket.emit("message-server", "hola cliente");
});
