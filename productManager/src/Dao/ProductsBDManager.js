import { __dirname } from "../utils/filenameUtils.js";
import { productsModel } from "./models/products.model.js";

export class ProductsBDManager {
  nombre;
  path;

  constructor({ nombre, path }) {
    if (!nombre) throw new Error("nombre es requerido");
    if (!path) throw new Error("path es requerido");
    this.nombre = nombre;
    this.path = path;
  }

  async addProduct({ title, description, price, thumbnail, code, stock } = {}) {
    const product = await productsModel.findOne({ code });

    if (product) {
      throw new Error("El producto ya fue ingresado");
    }

    await productsModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
  }

  async getProducts() {
    const products = await productsModel.find().lean();
    return products;
  }

  async getProductById(id) {
    const productById = await productsModel.findById(id);

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

    const productById = await productsModel.findById(id);

    if (!productById) {
      throw new Error(`No existe un producto con el id ${id}`);
    }

    return await productsModel.findByIdAndUpdate(id, {
      ...productById,
      ...newProduct,
    });
  }

  async deleteProduct(id) {
    const productById = await productsModel.findById(id);

    if (!productById) {
      throw new Error(`No existe un producto con el id ${id}`);
    }

    return await productsModel.findByIdAndDelete(id);
  }
}
