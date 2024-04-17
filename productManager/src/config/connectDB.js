import Mongoose from "mongoose";
import ConnectMongo from "connect-mongo";
import { envConfig } from "./envConfig.js";

export const connectDB = async () => {
  try {
    await Mongoose.connect(envConfig.mongo_url);
    console.log("base de datos conectada");
  } catch (error) {
    console.log("error al conectar", error);
  }
};

export const connectMongoStore = () => {
  return ConnectMongo.create({
    mongoUrl: URL,
    ttl: 15,
  });
};
