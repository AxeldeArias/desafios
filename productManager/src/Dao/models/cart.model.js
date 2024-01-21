import mongoose, { Schema } from "mongoose";

const CART_COLLECTION = "cart";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
  },
});

export const cartModel = mongoose.model(CART_COLLECTION, cartSchema);
