import Mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await Mongoose.connect(
      "mongodb+srv://axeldearias:test1234@cluster0.6rocgay.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("base de datos conectada");
  } catch (error) {
    console.log("error al conectar", error);
  }
};
