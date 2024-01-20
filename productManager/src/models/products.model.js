import mongoose, { Schema } from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: [String],
  code: String,
  stock: Number,
});

export const productsModel = mongoose.model(productsCollection, productsSchema);
