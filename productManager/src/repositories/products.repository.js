export class ProductsRepository {
  #dao;

  constructor(userDao) {
    this.#dao = userDao;
  }

  async addProduct(product) {
    return this.#dao.addProduct(product);
  }

  async getProducts(query) {
    return this.#dao.getProducts(query);
  }

  async getProductById(id) {
    return this.#dao.getProductById(id);
  }

  async updateProduct(id, newProduct) {
    return this.#dao.updateProduct(id, newProduct);
  }

  async deleteProduct(id) {
    return this.#dao.deleteProduct(id);
  }
}
