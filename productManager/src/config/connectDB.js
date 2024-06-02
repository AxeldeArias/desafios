import Mongoose from "mongoose";
import ConnectMongo from "connect-mongo";
import { envConfig } from "./envConfig.js";
import { logger } from "./logger.js";

export const connectDB = async () => {
  try {
    await Mongoose.connect(envConfig.mongo_url);
    logger.info("base de datos conectada");
  } catch (error) {
    logger.info("error al conectar", error);
  }
};

export const connectMongoStore = () => {
  return ConnectMongo.create({
    mongoUrl: URL,
    ttl: 15,
  });
};
