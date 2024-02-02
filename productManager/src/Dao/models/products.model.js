import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(
  PRODUCTS_COLLECTION,
  productsSchema
);
