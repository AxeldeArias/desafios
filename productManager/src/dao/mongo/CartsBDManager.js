import { ProductsBDManager } from "./ProductsBDManager.js";
import { cartModel } from "../../models/cart.model.js";
import Mongoose from "mongoose";

export class CartsBDManager {
  productsBDManager = new ProductsBDManager({
    nombre: "Admin",
  });

  async createCart({ products }) {
    const cart = await cartModel.create({ products });
    return cart.id;
  }

  async deleteCart({ cid }) {
    if (cid === undefined) throw new Error("cid es requerido");

    const cart = await cartModel.findById(cid);
    if (!cart) {
      throw Error("No existe el carrito");
    }

    try {
      return await cartModel.deleteOne({
        _id: cid,
      });
    } catch (error) {
      throw error;
    }
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

    const product = await this.productsBDManager.getProductById(productId);

    try {
      await this.#addProductQuantity(cid, productId, quantity);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct({ cid, productId, quantity }) {
    if (cid === undefined) throw new Error("cid es requerido");
    if (productId === undefined) throw new Error("productId es requerido");

    if (!quantity) {
      throw new Error("quantity es requerido");
    }
    if (Number.isNaN(Number(quantity))) {
      throw new Error("quantity no es numérico");
    }
    if (quantity < 0) throw new Error("quantity debe ser positivo");

    try {
      const result = await cartModel.findOneAndUpdate(
        {
          _id: cid,
          "products.product": productId,
        },
        {
          $set: { "products.$.quantity": quantity },
        },
        { new: true }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct({ cid, productId }) {
    if (cid === undefined) throw new Error("cid es requerido");
    if (productId === undefined) throw new Error("productId es requerido");

    const cart = await cartModel.findById(cid);
    if (!cart) {
      throw Error("No existe el carrito, tenés que crearlo primero");
    }

    try {
      return await cartModel.findOneAndUpdate(
        {
          _id: cid,
        },
        { $pull: { products: { product: productId } } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateProducts({ cid, products }) {
    if (cid === undefined) throw new Error("cid es requerido");
    if (products === undefined) throw new Error("productId es requerido");

    products.forEach((el) => {
      if (!el.product)
        throw new Error(
          "el campo product que contiene el id es requerido en cada elemento del array"
        );
      if (!el.quantity)
        throw new Error(
          "el campo quantity que contiene el la cantidad de productos es requerido en cada elemento del array"
        );
      if (Number.isNaN(Number(el.quantity))) {
        throw new Error("quantity no es numérico");
      }
      if (el.quantity < 0) throw new Error("quantity debe ser positivo");
    });

    try {
      return await cartModel.findOneAndUpdate(
        { _id: cid },
        {
          $set: {
            products: products.map((product) => ({
              _id: new Mongoose.Types.ObjectId(),
              product: product.product,
              quantity: product.quantity,
            })),
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async #addProductQuantity(cid, productId, quantity) {
    const alreadyHasProduct = await cartModel.findOne({
      _id: cid,
      "products.product": productId,
    });

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
    return await cartModel.findById(cid).populate("products.product").lean();
  }

  async getCarts() {
    return await cartModel.find().populate("products.product").lean();
  }
}
