import { cartsService, productsService } from "../repositories/index.js";

export class ViewController {
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
    const products = await productsService.getProducts();
    res.render("realtimeproducts.handlebars", {
      products: products.docs,
      user: req.user,
    });
  };

  renderRegisterPage = async (req, res) => {
    const { noRegistered, alreadyExist } = req.query;
    const description = noRegistered
      ? "error al crear usuario"
      : alreadyExist
      ? "el usuario ya existe"
      : "";

    res.render("register", { description });
  };

  renderChatPage = async (_req, res) => {
    res.render("chat.handlebars");
  };

  renderProductsPage = async (req, res) => {
    const { limit = 1, pageQuery = 1 } = req.query;
    const products = await productsService.getProducts({
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
    const cart = await cartsService.getCart(req.params.cid);

    res.render("cart.handlebars", {
      cart: {
        ...cart,
        products: cart.products.filter(({ product }) => !!product),
      },
    });
  };

  current = async (req, res) => {
    try {
      res.send({ message: "datos sensibles" });
    } catch (error) {
      res.send({ status: "error", error });
    }
  };

  getMockingProducts = async (req, res) => {
    const products = [];
    for (let index = 0; index < 100; index++) {
      products.push(productsService.getMockingProducts());
    }
    res.send({ products });
  };

  logger = async (req, res) => {
    req.logger.fatal("log- modo fatal");
    req.logger.error("log- modo error");
    req.logger.warning("log- modo warning");
    req.logger.info("log- modo info");
    req.logger.http("log- modo http");
    req.logger.debug("log- modo debug");
    req.logger.error({ esto: "es un ialkjsd" });

    res.send({ message: "logs" });
  };
}
