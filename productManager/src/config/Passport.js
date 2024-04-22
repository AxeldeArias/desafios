import passport from "passport";
import GithubStrategy from "passport-github2";
import { AuthController } from "../controllers/AuthController.js";

import { cookieExtractor } from "../utils/cookieExtractor.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { envConfig } from "./envConfig.js";

const authController = new AuthController();

export const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: envConfig.jwt_secret_key,
      },
      authController.jwtConfig
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
      authController.gitHubConfig
    )
  );
};
