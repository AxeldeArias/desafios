import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { UsersBDManager } from "../Dao/UsersBDManager.js";
import GithubStrategy from "passport-github2";

const usersManager = new UsersBDManager();

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, _username, password, done) => {
        const { first_name, last_name, email } = req.body;
        try {
          const user = await usersManager.getUser({ email });
          if (user) return done(null, false);

          const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
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
        if (!username || !password) return done(null, false);
        try {
          const user = await usersManager.getUser({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(password, user.password))
            return done(null, false);
          return done(null, user);
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
          const user = await usersManager.getUser({
            email: profile._json.email,
          });

          if (user) return done(null, user);

          const newUser = {
            first_name: profile._json.name ?? "Usuario",
            last_name: profile._json.last_name ?? "",
            email: profile._json.email,
          };

          const result = await usersManager.create(newUser);

          return done(null, result);
        } catch (error) {
          console.log({ githubError: error });
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await usersManager.getUserById(id);
    done(null, user);
  });
};
