import path from "path";
import { fileURLToPath } from "url";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const APP_PATH = {
  cart: path.join(__dirname, "../files/carrito.json"),
  productsFiles: path.join(__dirname, "../files/products.json"),
  lastIdPath: path.join(__dirname, "../files/lastId.txt"),
  viewsPath: path.join(__dirname, "../views"),
};
