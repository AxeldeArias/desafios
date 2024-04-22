import { generateToken } from "../config/jwt.js";
import { createHash } from "../utils/hashBcrypt.js";

export class UserDto {
  constructor(user) {
    return {
      name: `${user.name}${user.last_name ? ` ${user.last_name}` : ""}`,
      email: user.email,
      age: user.age,
      password: createHash(user.password),
      role: user.role,
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
