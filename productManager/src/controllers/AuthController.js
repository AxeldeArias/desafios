import Passport from "passport";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { CartsBDManager } from "../dao/mongo/CartsBDManager.js";
import { userService } from "../repositories/index.js";
import CustomError from "../errors/CustomError.js";
import {
  generateLoginRequiredPropertiesError,
  generateRegisterRequiredPropertiesError,
} from "../errors/info/UserInfo.js";
import EErrors from "../errors/ErrorsList.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateToken } from "../config/jwt.js";
import { envConfig } from "../config/envConfig.js";
import jwt from "jsonwebtoken";

const cartsManager = new CartsBDManager();
export class AuthController {
  register = async (req, res, next) => {
    try {
      const newUser = req.body;

      if (
        typeof req.body.first_name !== "string" ||
        typeof req.body.last_name !== "string" ||
        typeof req.body.email !== "string" ||
        typeof req.body.password !== "string" ||
        Number.isNaN(Number(req.body.age))
      ) {
        CustomError.createError({
          name: "Auth Controller - register",
          code: EErrors.INVALID_USER_PARAMS,
          cause: generateRegisterRequiredPropertiesError(req.body),
          message: "INVALID_PARAMS",
        });
      }

      const user = await userService.getUser({ email: newUser.email });
      if (user) {
        CustomError.createError({
          name: "Auth Controller - register",
          code: EErrors.USER_ALREADY_EXIST,
          message: "USER_ALREADY_EXIST",
        });
      }

      const cartId = await cartsManager.createCart({ products: [] });
      await userService.create({
        ...newUser,
        cartId,
        role: "USER",
      });

      req.logger.info("new user created");
      return res.status(200).redirect("/?registered=true");
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (typeof email !== "string" || typeof password !== "string") {
        CustomError.createError({
          name: "Auth Controller - login",
          code: EErrors.INVALID_USER_PARAMS,
          cause: generateLoginRequiredPropertiesError(req.body),
          message: "INVALID_PARAMS",
        });
      }
      const user = await userService.getUser({
        email: email,
      });

      if (!user) {
        return CustomError.createError({
          name: "Auth Controller - login",
          code: EErrors.USER_NOT_EXIST,
          message: "user does not exist",
        });
      }

      if (user.password && !isValidPassword(password, user.password)) {
        return CustomError.createError({
          name: "Auth Controller - login",
          code: EErrors.INVALID_USER,
          message: "password invalid",
        });
      }

      const userToken = await userService.getUserToken(user);

      if (!userToken) {
        return CustomError.createError({
          name: "Auth Controller - login",
          code: EErrors.INVALID_USER,
          message: "invalid user token",
        });
      }

      req.logger.info("local login");
      res
        .cookie("cookieToken", userToken, {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true,
        })
        .status(200)
        .redirect(user.role === "USER" ? "/products" : "/realtimeproducts");
    } catch (error) {
      next(error);
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
    req.logger.info("github login");
    res
      .cookie("cookieToken", req.user, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .status(200)
      .redirect(req.user.role === "USER" ? "/products" : "/realtimeproducts");
  };

  gitHubConfig = async (_accessToken, _refreshToken, profile, done) => {
    try {
      const userToken = await userService.getUserToken({
        email: profile._json.email,
      });

      if (userToken) return done(null, userToken);
      const newUser = {
        name: profile._json.name,
        email: profile._json.email,
        age: 0,
        role: "USER",
        cartId: await cartsManager.createCart({ products: [] }),
      };

      const newUserToken = await userService.create(newUser);

      return done(null, newUserToken);
    } catch (error) {
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

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await userService.getUser({ email });

      req.logger.info(user);

      if (!user) {
        return CustomError.createError({
          name: "Auth Controller - login",
          code: EErrors.USER_NOT_EXIST,
          message: "user does not exist",
        });
      }
      const token = generateToken({ user, expiresIn: "1h" });

      const subject = "Restablecer contraseña";
      const html = `
                        <p> Hola ${user.name}, </p>
                        <p> Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                        <a href="${envConfig.baseUrl}/api/auth/reset-password/${token}">Restablecer contraseña</a>
                        <p>Este enlace expirará en 1 hora.</p>
                    `;

      await sendEmail({
        subject,
        html,
      });
      res;
      res.status(200).render("emailSent");
    } catch (error) {
      console.log({ error });
      next(error);
    }
  };

  resetPasswordToken = async (req, res) => {
    try {
      const { token } = req.params;
      res.render("resetPass", { token });
    } catch (error) {
      logger.info(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { passwordNew, passwordConfirm, token } = req.body;

      if (!passwordNew || !passwordConfirm || passwordNew !== passwordConfirm)
        CustomError.createError({
          name: "Auth Controller - resetPassword",
          code: EErrors.INVALID_USER_PARAMS,
          cause: generateLoginRequiredPropertiesError(req.body),
          message: "INVALID_PARAMS",
        });

      if (passwordNew !== passwordConfirm) {
        CustomError.createError({
          name: "Auth Controller - resetPassword",
          code: EErrors.PASSWORDS_DOES_NOT_MATCH,
          message: "Contraseñas no coinciden",
        });
      }
      const decodedUser = jwt.verify(token, envConfig.jwt_secret_key);

      if (!decodedUser) {
        CustomError.createError({
          name: "Auth Controller - resetPassword",
          code: EErrors.TOKEN_EXPIRED,
        });
      }

      const userDB = await userService.getUser({
        email: decodedUser.user.email,
      });

      if (!userDB) {
        return CustomError.createError({
          name: "Auth Controller - resetPassword",
          code: EErrors.USER_NOT_EXIST,
          message: "user does not exist",
        });
      }

      let isValidPass = isValidPassword(userDB.password, passwordNew);

      if (isValidPass) {
        return CustomError.createError({
          name: "Auth Controller - resetPassword",
          code: EErrors.PASSWORD_ALREADY_USED,
        });
      }

      const result = await userService.update(userDB._id, {
        password: createHash(passwordNew),
      });

      if (!result) {
        return CustomError.createError({
          name: "Auth Controller - resetPassword",
          code: EErrors.CANNOT_UPDATE_USER,
        });
      }

      res.status(200).redirect("/?resetPass=true");
    } catch (error) {
      console.log({ error });
      next(error);
    }
  };
}
