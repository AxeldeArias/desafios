import mongoose, { Schema } from "mongoose";
import { CART_COLLECTION } from "./cart.model.js";

export const USER_COLLECTION = "users";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    index: true,
  },
  last_name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  age: Number,
  role: String,
  cartId: {
    type: Schema.Types.ObjectId,
    ref: CART_COLLECTION,
  },
});

export const userModel = mongoose.model(USER_COLLECTION, usersSchema);
