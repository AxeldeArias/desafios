import * as fs from "node:fs/promises";
import { ProductsManager } from "./ProductsManager.js";
import { PRODUCTS_FILE_PATH } from "../filenameUtils.js";

export class CartsManager {
  productManager = new ProductsManager({
    nombre: "Admin",
    path: PRODUCTS_FILE_PATH,
  });

  constructor(props) {
    this.path = props.path;
  }

  async createCart() {
    const carts = await this.getCarts();
    const cid = carts.length + 1;
    carts.push({ cid: cid, products: [] });

    await this.#saveCart(carts);

    return cid;
  }

  async addProduct({ cid, productId, quantity }) {
    if (cid === undefined) throw new Error("cid es requerido");
    if (productId === undefined) throw new Error("productId es requerido");

    if (!quantity) {
      throw new Error("quantity es requerido");
    }
    if (Number.isNaN(Number(quantity))) {
      throw new Error("quantity no es numérico");
    }
    if (quantity < 0) throw new Error("quantity debe ser positivo");

    const product = await this.productManager.getProductById(productId);

    try {
      const carts = await this.#addProductQuantity(cid, productId, quantity);
      await this.#saveCart(carts);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async #addProductQuantity(cid, productId, quantity) {
    let carts = await this.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.cid === cid);
    if (cartIndex === -1) {
      throw Error("No existe el carrito, tenés que crearlo primero");
    }

    const productIndex = carts[cartIndex].products?.findIndex(
      (element) => element.productId === productId
    );

    if (productIndex === -1) {
      carts[cartIndex].products.push({ quantity, productId });
    } else {
      carts[cartIndex].products[productIndex].quantity += quantity;
    }
    return carts;
  }

  async getCart(cid) {
    const carts = await this.getCarts();
    const cart = carts.findIndex(({ id }) => id === cid);
    if (cart === -1) throw Error("El carrito no fue encontrado");
    return cart;
  }

  async getCarts() {
    try {
      const productsFile = await fs.readFile(this.path, {
        encoding: "utf-8",
      });
      return JSON.parse(productsFile);
    } catch (error) {
      return [];
    }
  }

  async #saveCart(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), {
      encoding: "utf-8",
    });
  }
}
