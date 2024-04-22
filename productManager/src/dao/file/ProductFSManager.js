export class ProductFSManager {
  id;
  title;
  description;
  price;
  thumbnail;
  code;
  stock;

  constructor({ id, title, description, price, thumbnail, code, stock } = {}) {
    if (id === undefined) throw new Error("id es requerido");
    if (!title) throw new Error("title es requerido");
    if (!description) throw new Error("description es requerido");
    if (price === undefined) throw new Error("price es requerido");
    if (!thumbnail) throw new Error("thumbnail es requerido");
    if (!code) throw new Error("code es requerido");
    if (!stock) throw new Error("stock es requerido");

    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}
