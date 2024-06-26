import mongoose, { Schema } from "mongoose";
import { PRODUCTS_COLLECTION } from "./products.model.js";

export const CART_COLLECTION = "cart";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: PRODUCTS_COLLECTION,
        },
        quantity: Number,
      },
    ],
  },
});

cartSchema.pre("find", function (next) {
  if (!this._update) {
    this.populate("products.product");
  }
  next();
});
cartSchema.pre("findById", function (next) {
  if (!this._update) {
    this.populate("products.product");
  }

  next();
});

export const cartModel = mongoose.model(CART_COLLECTION, cartSchema);
