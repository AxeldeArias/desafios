import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { UsersBDManager } from "../dao/UsersBDManager.js";
import GithubStrategy from "passport-github2";
import { cookieExtractor } from "../utils/cookieExtractor.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { CartsBDManager } from "../dao/CartsBDManager.js";
import { envConfig } from "./envConfig.js";

const usersManager = new UsersBDManager();
const cartManager = new CartsBDManager();

export const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: envConfig.jwt_secret_key,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload._doc);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, _username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await usersManager.getUser({ email });
          if (user) return done(null, false);

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            cartId: await cartManager.createCart({ products: [] }),
            password: createHash(password),
            role: "user",
          };

          const result = await usersManager.create(newUser);

          return done(null, result);
        } catch (error) {
          console.log({ error });
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await usersManager.getUser({
            email: username,
            password,
          });

          if (!user) {
            return done(null, false);
          }
          if (user.password && !isValidPassword(password, user.password))
            return done(null, false);

          const userToken = await usersManager.getUserToken({
            email: user.email,
          });

          return done(null, userToken);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.c0587f0d5ccd60c9",
        clientSecret: "0a6a26bcaf65d032bc72815d8f63e86138e141b7",
        callbackURL: "http://localhost:8080/api/auth/githubcallback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const userToken = await usersManager.getUserToken({
            email: profile._json.email,
          });

          if (userToken) return done(null, userToken);
          const newUser = {
            first_name: profile._json.name,
            last_name: profile._json.name,
            email: profile._json.email,
            age: 0,
            role: "user",
            cartId: await cartManager.createCart({ products: [] }),
          };

          const createdUserToken = await usersManager.create(newUser);

          return done(null, createdUserToken);
        } catch (error) {
          console.log({ githubError: error });
          done(error);
        }
      }
    )
  );

  // esto es solo si manejamos Session
  // passport.serializeUser((user, done) => {
  //   done(null, user._id);
  // });
  // passport.deserializeUser(async (id, done) => {
  //   const user = await usersManager.getUserById(id);
  //   done(null, user);
  // });
};
