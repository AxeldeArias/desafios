import express from "express";
import productRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routers/views.route.js";
import { connectDB, connectMongoStore } from "./config/connectDB.js";
import { ABSOLUTE_PATHS } from "./utils/filenameUtils.js";
import { connectSocket } from "./config/connectSocket.js";
import { listenServer } from "./config/listenServer.js";
import chatRouter from "./routers/chat.route.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { SECRET } from "./config/session.js";
import authRouter from "./routers/auth.route.js";
import Passport from "passport";
import { initializePassport } from "./config/Passport.js";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cookieParser(SECRET));
app.use(
  session({
    store: connectMongoStore(),
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
initializePassport();
app.use(Passport.initialize());
app.use(Passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", ABSOLUTE_PATHS.viewsPath);
app.set("view engine", "handlebars");

app.use("", viewsRouter);
app.use("/", authRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chat", chatRouter);

const httpServer = listenServer(app);
connectSocket(app, httpServer);
