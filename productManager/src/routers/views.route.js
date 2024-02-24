import { Router } from "express";
import { ProductsBDManager } from "../Dao/ProductsBDManager.js";
import { CartsBDManager } from "../Dao/CartsBDManager.js";
import { userAuth } from "../middlewares/auth.js";

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

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productsBDManager.getProducts();
  res.render("realtimeproducts.handlebars", { products });
});
viewsRouter.get("/chat", async (_req, res) => {
  res.render("chat.handlebars");
});
viewsRouter.get("/products", userAuth, async (req, res) => {
  const { limit = 1, pageQuery = 1 } = req.query;
  const products = await productsBDManager.getProducts({
    limit,
    page: pageQuery,
  });
  const carts = await cartManager.getCarts();
  res.render("products.handlebars", {
    ...products,
    products: products.docs,
    carts: carts,
    user: req.session.user,
  });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCart(req.params.cid);
  res.render("cart.handlebars", {
    cart,
  });
});

export default viewsRouter;
