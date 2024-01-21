import mongoose from "mongoose";

export const PRODUCTS_COLLECTION = "products";

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: [String],
  code: {
    type: String,
    unique: true,
  },
  stock: Number,
});

export const productsModel = mongoose.model(
  PRODUCTS_COLLECTION,
  productsSchema
);
