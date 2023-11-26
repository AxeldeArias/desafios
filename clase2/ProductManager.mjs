import { Product } from "./Product.mjs";

export class ProductManager {
  products = [];
  nombre;
  static autoId = 0;

  constructor({ nombre }) {
    if (!nombre) throw new Error("nombre is required");
    this.nombre = nombre;
  }

  addProduct({ title, description, price, thumbnail, code, stock } = {}) {
    if (this.products.find((currentProduct) => currentProduct.code === code)) {
      throw new Error("El producto ya fue ingresado");
    }

    const newProduct = new Product({
      id: ProductManager.autoId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    this.products = [...this.products, newProduct];
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const productById = this.products.find(
      (currentProduct) => currentProduct.id === id
    );
    if (!productById) throw new Error(`No existe un producto con el id ${id}`);
    return productById;
  }
}
