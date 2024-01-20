import * as fs from "node:fs/promises";
import { ABSOLUTE_PATHS, __dirname } from "../utils/filenameUtils.js";
import { productsModel } from "../models/products.model.js";

export class ProductsFSManager {
  nombre;
  path;

  constructor({ nombre, path }) {
    if (!nombre) throw new Error("nombre es requerido");
    if (!path) throw new Error("path es requerido");
    this.nombre = nombre;
    this.path = path;
  }

  async addProduct({ title, description, price, thumbnail, code, stock } = {}) {
    const products = await this.getProducts();
    console.log({ products });
    if (products.find((currentProduct) => currentProduct.code === code)) {
      throw new Error("El producto ya fue ingresado");
    }
    console.log("entre3");

    const newId = await this.#getNewId();
    console.log("entre4");

    const newProduct = new ProductManager({
      id: newId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    products.push(newProduct);
    await this.#saveProduct(newProduct);

    await this.#saveProducts(products);

    return products;
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

    if (!productById) {
      throw {
        code: "no-exist-product",
        description: `No existe un producto con el id ${id}`,
      };
    }
    return productById;
  }

  async updateProduct(id, newProduct) {
    if (newProduct.id) {
      throw new Error("No se puede cambiar el id");
    }

    const products = await this.getProducts();
    let productIndex = products.findIndex(
      (currentProduct) => currentProduct.id === id
    );
    if (productIndex === -1) {
      throw new Error(`No existe un producto con el id ${id}`);
    }

    products[productIndex] = new ProductManager({
      ...products[productIndex],
      ...newProduct,
    });

    await this.#saveProducts(products);

    return products[productIndex];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const indexToDelete = products.findIndex(
      (currentProduct) => currentProduct.id === id
    );
    if (indexToDelete === -1) {
      throw new Error("El producto no existe");
    }
    products.splice(indexToDelete, 1);

    await this.#saveProducts(products);
    return products;
  }

  async #getNewId() {
    let lastId;
    try {
      const lastIdString = await fs.readFile(ABSOLUTE_PATHS.lastIdPath, {
        encoding: "utf-8",
      });
      lastId = Number(lastIdString);
      if (Number.isNaN(lastId)) throw new Error("error al generar un nuevo id");
    } catch (error) {
      lastId = 1;
    } finally {
      await fs.writeFile(ABSOLUTE_PATHS.lastIdPath, `${lastId + 1}`, {
        encoding: "utf-8",
      });
    }
    return lastId;
  }

  async #saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), {
      encoding: "utf-8",
    });
  }

  async #saveProduct(product) {
    console.log("entre");
    try {
      const result = await productsModel.create(product);
      console.log(result);
    } catch (error) {
      console.log({ error });
    }
  }
}
