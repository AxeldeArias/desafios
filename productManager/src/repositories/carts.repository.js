export class CartsRepository {
  #dao;

  constructor(userDao) {
    this.#dao = userDao;
  }

  async createCart(cart) {
    return this.#dao.createCart(cart);
  }

  async deleteCart(filter) {
    return this.#dao.deleteCart(filter);
  }

  async addProduct(product) {
    return this.#dao.addProduct(product);
  }

  async updateProduct(product) {
    return this.#dao.updateProduct(product);
  }

  async deleteProduct(product) {
    return this.#dao.deleteProduct(product);
  }
  async updateProducts(products) {
    return this.#dao.updateProducts(products);
  }

  async getCart(cid) {
    return this.#dao.getCart(cid);
  }
  async getCarts() {
    return this.#dao.getCarts();
  }
}
