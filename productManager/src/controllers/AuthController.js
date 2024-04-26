import Passport from "passport";
import { isValidPassword } from "../utils/hashBcrypt.js";
import { CartsBDManager } from "../dao/mongo/CartsBDManager.js";
import { userService } from "../repositories/index.js";

const cartsManager = new CartsBDManager();
export class AuthController {
  register = async (req, res) => {
    const newUser = req.body;
    try {
      const user = await userService.getUser({ email: newUser.email });
      if (user) {
        return res.status(401).redirect("/register?alreadyExist=true");
      }

      const cartId = await cartsManager.createCart({ products: [] });
      await userService.create({
        ...newUser,
        cartId,
        role: "USER",
      });

      return res.status(200).redirect("/?registered=true");
    } catch (error) {
      console.log({ error });
      return res
        .status(500)
        .send(error)
        .redirect("/register?noRegistered=true");
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await userService.getUser({
        email: email,
      });

      if (!user) {
        return res.status(500).redirect("/?noLogin=true");
      }
      if (user.password && !isValidPassword(password, user.password))
        return res.status(500).redirect("/?noLogin=true");

      const userToken = await userService.getUserToken(user);

      if (!userToken) {
        return res.status(401).send({
          status: "error",
          message: "Usuario o contraseña incorrectos",
        });
      }

      console.log({ userToken });

      res
        .cookie("cookieToken", userToken, {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true,
        })
        .status(200)
        .redirect(user.role === "ADMIN" ? "/realtimeproducts" : "/products");
    } catch (error) {
      console.log({ error });
      return res.status(500).redirect("/?noLogin=true");
    }
  };

  logout = (_req, res) => {
    res.clearCookie("cookieToken").status(200).redirect("/");
  };

  github = (req, res, next) => {
    return Passport.authenticate("github", {
      scope: ["user:email"],
      session: false,
    })(req, res, next);
  };

  githubCallback = (req, res, next) => {
    return Passport.authenticate("github", {
      failureRedirect: "/?noLogin=true",
      session: false,
    })(req, res, next);
  };

  githubCallbackSuccess = async (req, res) => {
    res
      .cookie("cookieToken", req.user, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .status(200)
      .redirect("/products");
  };

  gitHubConfig = async (_accessToken, _refreshToken, profile, done) => {
    try {
      const userToken = await userService.getUserToken({
        email: profile._json.email,
      });

      if (userToken) return done(null, userToken);
      const newUser = {
        first_name: profile._json.name,
        last_name: profile._json.name,
        email: profile._json.email,
        age: 0,
        role: "USER",
        cartId: await cartsManager.createCart({ products: [] }),
      };

      const newUserToken = await userService.create(newUser);

      return done(null, newUserToken);
    } catch (error) {
      console.log({ githubError: error });
      done(error);
    }
  };

  jwtConfig = async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  };
}
