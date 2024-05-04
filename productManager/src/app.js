import express from "express";
import productRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routers/views.route.js";
import { connectDB } from "./config/connectDB.js";
import { ABSOLUTE_PATHS } from "./utils/filenameUtils.js";
import { connectSocket } from "./config/connectSocket.js";
import { listenServer } from "./config/listenServer.js";
import chatRouter from "./routers/chat.route.js";
import cookieParser from "cookie-parser";
import { SECRET } from "./config/session.js";
import authRouter from "./routers/auth.route.js";
import Passport from "passport";
import { initializePassport } from "./config/Passport.js";
import { addLogger } from "./config/logger.js";
import errorHandler from "./errors/index.js";

const app = express();

connectDB();
initializePassport();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(addLogger);
app.use(cookieParser(SECRET));
app.use(Passport.initialize());

app.engine("handlebars", handlebars.engine());

app.set("views", ABSOLUTE_PATHS.viewsPath);
app.set("view engine", "handlebars");

app.use("", viewsRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chat", chatRouter);
app.use(errorHandler);

const httpServer = listenServer(app);
connectSocket(app, httpServer);
