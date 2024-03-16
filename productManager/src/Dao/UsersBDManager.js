import { generateToken } from "../config/jwt.js";
import { userModel } from "./models/users.model.js";

export class UsersBDManager {
  async getUser({ email }) {
    return await userModel.findOne({ email });
  }
  async getUserById(id) {
    return await userModel.findOne({ _id: id });
  }
  async create(user) {
    const newUser = await userModel.create(user);

    const userToken = {
      ...newUser,
      name: `${user.first_name} ${user.last_name}`,
    };

    return generateToken(userToken);
  }

  async getUserToken({ email }) {
    const user = await this.getUser({ email });
    if (!user) return null;

    const userToken = {
      ...user,
      name: `${user.first_name} ${user.last_name}`,
    };

    return generateToken(userToken);
  }
}
