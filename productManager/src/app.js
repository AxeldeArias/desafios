import express from "express";
import productRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routers/views.route.js";
import swaggerUIExpress from "swagger-ui-express";
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
import swaggerJSDoc from "swagger-jsdoc";
import userRouter from "./routers/user.route.js";

const app = express();
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación del poder y del saber",
      description: "descripcion",
    },
  },
  apis: [ABSOLUTE_PATHS.swaggerDocs],
};
const specs = swaggerJSDoc(swaggerOptions);
connectDB();
initializePassport();

app.engine(
  "handlebars",
  handlebars.engine({
    helpers: {
      ifEquals: function (a, b, options) {
        if (a === b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
    },
  })
);
app.set("views", ABSOLUTE_PATHS.viewsPath);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger);
app.use(cookieParser(SECRET));
app.use(Passport.initialize());

app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
app.use(express.static("public"));
app.use("", viewsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chat", chatRouter);
app.use(errorHandler);

const httpServer = listenServer(app);
connectSocket(app, httpServer);
