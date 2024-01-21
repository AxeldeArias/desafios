import * as fs from "node:fs/promises";
import { ProductsBDManager } from "./ProductsBDManager.js";
import { ABSOLUTE_PATHS } from "../utils/filenameUtils.js";
import { cartModel } from "./models/cart.model.js";

export class CartsBDManager {
  productManager = new ProductsBDManager({
    nombre: "Admin",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  constructor(props) {
    this.path = props.path;
  }

  async createCart() {
    const cart = await cartModel.create({ product });
    return cart.id;
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

    const cart = await cartModel.findById(cid);
    if (!cart) {
      throw Error("No existe el carrito, tenés que crearlo primero");
    }

    const product = await this.productManager.getProductById(productId);

    try {
      await this.#addProductQuantity(cid, productId, quantity);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async #addProductQuantity(cid, productId, quantity) {
    const alreadyHasProduct = await cartModel.findOne({
      _id: cid,
      "products.product": productId,
    });

    console.log({ alreadyHasProduct });
    if (alreadyHasProduct) {
      return await cartModel.updateOne(
        { _id: cid, "products.product": productId },
        {
          $inc: { "products.$.quantity": quantity },
        }
      );
    }

    await cartModel.updateOne(
      { _id: cid },
      {
        $addToSet: {
          products: {
            product: productId,
            quantity: quantity,
          },
        },
      }
    );
  }

  async getCart(cid) {
    return await cartModel.findById(cid);
  }
}
