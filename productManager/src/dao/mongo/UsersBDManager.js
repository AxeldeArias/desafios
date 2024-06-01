import { userModel } from "../../models/users.model.js";
import { ObjectId } from "mongodb";

export class UsersBDManager {
  async getUser(filter) {
    return await userModel.findOne(filter);
  }
  async getUserById(id) {
    return await userModel.findOne({ _id: id });
  }
  async create(user) {
    return await userModel.create(user);
  }

  async update(id, user) {
    return await userModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...user,
        },
      }
    );
  }
}
