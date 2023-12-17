import * as fs from "node:fs/promises";
import { ProductManager } from "./ProductManager.js";
import { PRODUCTS_FILE_PATH } from "../filenameUtils.js";

export class Carts {
  productManager = new ProductManager({
    nombre: "Admin",
    path: PRODUCTS_FILE_PATH,
  });

  constructor(props) {
    this.path = props.path;
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

    const carts = await this.#addProductQuantity(cid, productId, quantity);

    await this.#saveCart(carts);
    return product;
  }

  async #addProductQuantity(cid, productId, quantity) {
    let carts = await this.getCarts();
    if (!carts) {
      return { [cid]: [{ productId, quantity }] };
    }

    const cart = carts?.[cid];
    if (!cart) {
      carts[cid] = [{ productId, quantity }];
      return carts;
    }

    const product = cart?.find((element) => element.productId === productId);

    if (product) {
      product.quantity += quantity;
    } else {
      carts[cid].push({ productId, quantity });
    }
    return carts;
  }

  async getCart(cuid) {
    try {
      const carts = await this.getCarts();
      return carts?.[cuid];
    } catch (error) {
      return [];
    }
  }

  async getCarts() {
    try {
      const productsFile = await fs.readFile(this.path, {
        encoding: "utf-8",
      });
      return JSON.parse(productsFile);
    } catch (error) {
      return undefined;
    }
  }

  async #saveCart(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), {
      encoding: "utf-8",
    });
  }
}
