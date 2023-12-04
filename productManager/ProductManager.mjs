import { Product } from "./Product.mjs";
import * as fs from "node:fs/promises";

export class ProductManager {
  nombre;
  #autoId = 0;
  path;

  constructor({ nombre, path }) {
    if (!nombre) throw new Error("nombre is required");
    if (!path) throw new Error("path is required");
    this.nombre = nombre;
    this.path = path;
  }

  async addProduct({ title, description, price, thumbnail, code, stock } = {}) {
    const products = await this.getProducts();

    if (products.find((currentProduct) => currentProduct.code === code)) {
      throw new Error("El producto ya fue ingresado");
    }

    const newProduct = new Product({
      id: this.#autoId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    products.push(newProduct);

    await this.#saveProducts(products);

    return newProduct;
  }

  async getProducts() {
    try {
      const productsFile = await fs.readFile(this.path, {
        encoding: "utf-8",
      });
      return JSON.parse(productsFile);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();

    const productById = products.find(
      (currentProduct) => currentProduct.id === id
    );

    if (!productById) throw new Error(`No existe un producto con el id ${id}`);
    return new Product(productById);
  }

  async updateProduct(id, newProduct) {
    const products = await this.getProducts();

    if (newProduct.id && getProductById(newProduct.id)) {
      throw new Error("Ya existe otro producto con ese id ");
    }

    const updatedProducts = products.map((currentProduct) =>
      currentProduct.id !== id
        ? currentProduct
        : new Product({ ...currentProduct, ...newProduct })
    );

    this.#saveProducts(updatedProducts);
  }

  async deleteProduct(id, newProduct) {
    const products = await this.getProducts();

    const indexToDelete = products.findIndex(
      (currentProduct) => currentProduct.id === id
    );
    products.splice(indexToDelete, 1);

    this.#saveProducts(products);
  }

  async #saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), {
      encoding: "utf-8",
    });
  }
}
