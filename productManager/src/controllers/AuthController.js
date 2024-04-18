import Passport from "passport";

export class AuthController {
  register = (req, res, next) => {
    return Passport.authenticate("register", {
      failureRedirect: "/register?noRegistered=true",
      successRedirect: "/?registered=true",
      session: false,
    })(req, res, next);
  };

  login = async (req, res, next) => {
    return Passport.authenticate("login", {
      session: false,
      failureRedirect: "/?noLogin=true",
    })(req, res, next);
  };

  loginSuccess = async (req, res) => {
    const userToken = req.user;
    if (!userToken) {
      return res
        .status(401)
        .send({ status: "error", message: "Usuario o contraseña incorrectos" });
    }

    res
      .cookie("cookieToken", userToken, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .status(200)
      .redirect("/products");
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
}
