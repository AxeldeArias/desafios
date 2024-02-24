import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { UsersBDManager } from "../Dao/UsersBDManager.js";

const LocalStrategy = local.Strategy;

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
          let user = await usersManager.getUser({ email });
          if (user) return done(null, false);

          let newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
          };

          let result = await usersManager.create(newUser);

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

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await usersManager.getUserById(id);
    done(null, user);
  });
};
