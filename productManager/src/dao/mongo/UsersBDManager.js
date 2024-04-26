import { userModel } from "../../models/users.model.js";

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
}
