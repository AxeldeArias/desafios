import { Router } from "express";
import { ProductsBDManager } from "../dao/ProductsBDManager.js";
import { CartsBDManager } from "../dao/CartsBDManager.js";
import Passport from "passport";

const viewsRouter = Router();

const productsBDManager = new ProductsBDManager({
  nombre: "views",
});

const cartManager = new CartsBDManager();

viewsRouter.get("/", async (req, res) => {
  const { registered, noLogin } = req.query;
  const description = noLogin
    ? "error al ingresar"
    : registered
    ? "usuario registrado correctamente"
    : "";
  res.render("login", {
    description,
  });
});

viewsRouter.get("/register", async (req, res) => {
  const { noRegistered } = req.query;
  const description = noRegistered ? "error al crear usuario" : "";
  res.render("register", { description });
});

viewsRouter.get(
  "/realtimeproducts",
  Passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const products = await productsBDManager.getProducts();
    res.render("realtimeproducts.handlebars", { products });
  }
);

viewsRouter.get(
  "/chat",
  Passport.authenticate("jwt", { session: false }),
  async (_req, res) => {
    res.render("chat.handlebars");
  }
);

viewsRouter.get(
  "/products",
  Passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { limit = 1, pageQuery = 1 } = req.query;
    const products = await productsBDManager.getProducts({
      limit,
      page: pageQuery,
    });

    res.render("products.handlebars", {
      products: products.docs,
      user: req.user,
    });
  }
);

viewsRouter.get(
  "/carts/:cid",
  Passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const cart = await cartManager.getCart(req.params.cid);
    res.render("cart.handlebars", {
      cart,
    });
  }
);

export default viewsRouter;
