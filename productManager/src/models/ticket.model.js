import mongoose, { Schema } from "mongoose";
import { CART_COLLECTION } from "./cart.model.js";

export const TICKET_COLLECTION = "ticket";

const ticketSchema = new mongoose.Schema({
  amount: Number,
  purchaser: String,
  purchaser_datetime: Date,
  code: String,
});

ticketSchema.pre("find", function (next) {
  this.populate("cart.cart");
  next();
});

ticketSchema.pre("findById", function (next) {
  this.populate("cart.cart");
  next();
});

export const ticketModel = mongoose.model(TICKET_COLLECTION, ticketSchema);
