import Mongoose from "mongoose";
import ConnectMongo from "connect-mongo";

const URL =
  "mongodb+srv://axeldearias:test1234@cluster0.6rocgay.mongodb.net/ecommerce?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {
    await Mongoose.connect(URL);
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
