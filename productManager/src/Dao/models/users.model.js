import mongoose from "mongoose";

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
});

export const userModel = mongoose.model(USER_COLLECTION, usersSchema);
