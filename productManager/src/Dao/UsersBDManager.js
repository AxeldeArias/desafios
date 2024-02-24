import { userModel } from "./models/users.model.js";

export class UsersBDManager {
  async getUser({ email }) {
    return await userModel.findOne({ email });
  }
  async getUserById(id) {
    return await userModel.findOne({ _id: id });
  }
  async create({ first_name, last_name, email, password }) {
    return await userModel.create({ first_name, last_name, email, password });
  }

  async getSession({ email, password }) {
    const isAdmin =
      email === "adminCoder@coder.com" && password === "adminCod3r123";

    if (isAdmin) {
      return {
        name: `Admin Coder`,
        email: email,
        role: "admin",
      };
    }

    const user = await this.getUser({ email, password });

    if (!user) return null;

    return {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: "user",
    };
  }
}
