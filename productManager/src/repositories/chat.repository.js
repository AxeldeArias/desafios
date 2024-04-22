export class ChatRepository {
  #dao;

  constructor(userDao) {
    this.#dao = userDao;
  }

  addMessage = ({ message, email }) => this.#dao.addMessage({ message, email });

  getChat = () => this.#dao.getChat();
}
