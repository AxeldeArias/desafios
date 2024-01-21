import express from "express";
import productRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routers/views.route.js";
import { connectDB } from "./config/connectDB.js";
import { ABSOLUTE_PATHS } from "./utils/filenameUtils.js";
import { connectSocket } from "./config/connectSocket.js";
import { listenServer } from "./config/listenServer.js";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", ABSOLUTE_PATHS.viewsPath);
app.set("view engine", "handlebars");

app.use("", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

const httpServer = listenServer(app);
connectSocket(httpServer);
