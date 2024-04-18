import { CartsBDManager } from "../dao/CartsBDManager.js";
import { ProductsBDManager } from "../dao/ProductsBDManager.js";

export class ViewController {
  #productsBDManager = new ProductsBDManager({
    nombre: "views",
  });
  #cartManager = new CartsBDManager();

  renderLoginPage = async (req, res) => {
    const { registered, noLogin } = req.query;
    const description = noLogin
      ? "error al ingresar"
      : registered
      ? "usuario registrado correctamente"
      : "";
    res.render("login", {
      description,
    });
  };

  renderRealTimeProductsPage = async (req, res) => {
    const products = await this.#productsBDManager.getProducts();
    res.render("realtimeproducts.handlebars", { products: products.docs });
  };

  renderRegisterPage = async (req, res) => {
    const { noRegistered } = req.query;
    const description = noRegistered ? "error al crear usuario" : "";
    res.render("register", { description });
  };

  renderChatPage = async (_req, res) => {
    res.render("chat.handlebars");
  };

  renderProductsPage = async (req, res) => {
    const { limit = 1, pageQuery = 1 } = req.query;
    const products = await this.#productsBDManager.getProducts({
      limit,
      page: pageQuery,
    });
    res.render("products.handlebars", {
      ...products,
      products: products.docs,
      user: req.user,
    });
  };

  renderCartPage = async (req, res) => {
    const cart = await this.#cartManager.getCart(req.params.cid);
    res.render("cart.handlebars", {
      cart,
    });
  };
}
