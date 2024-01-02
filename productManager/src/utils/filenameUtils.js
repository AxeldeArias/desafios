import path from "path";
import { fileURLToPath } from "url";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CART_PATH = path.join(__dirname, "../files/carrito.json");
export const PRODUCTS_FILE_PATH = path.join(
  __dirname,
  "../files/products.json"
);
export const LAST_ID_PATH = path.join(__dirname, "../files/lastId.txt");
export const VIEWS_PATH = path.join(__dirname, "../views");
