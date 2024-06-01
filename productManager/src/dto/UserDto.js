import { generateToken } from "../config/jwt.js";
import { createHash } from "../utils/hashBcrypt.js";

export class UserDto {
  constructor({ first_name, last_name, password, ...user }) {
    return {
      name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
      password: password ? createHash(password) : undefined,
      ...user,
    };
  }

  static getUserToken = (user) => {
    return generateToken({
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      cartId: user.cartId,
    });
  };
}
