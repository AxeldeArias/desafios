import { UserDto } from "../dto/UserDto.js";

export class UserRepository {
  #dao;

  constructor(userDao) {
    this.#dao = userDao;
  }

  getUser = async (filter) => this.#dao.getUser(filter);

  getUserToken = async ({ email }) => {
    const user = await this.#dao.getUser({ email });
    return UserDto.getUserToken(user);
  };

  create = async (newUser) => {
    const userDto = new UserDto(newUser);
    return await this.#dao.create(userDto);
  };
}
