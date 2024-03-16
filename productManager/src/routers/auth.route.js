import { Router } from "express";
import Passport from "passport";

const authRouter = Router();

authRouter.post(
  "/register",
  Passport.authenticate("register", {
    failureRedirect: "/register?noRegistered=true",
    successRedirect: "/?registered=true",
    session: false,
  })
);

authRouter.post(
  "/login",
  Passport.authenticate("login", {
    session: false,
    failureRedirect: "/?noLogin=true",
  }),
  async (req, res) => {
    const userToken = req.user;
    if (!userToken)
      return res
        .status(401)
        .send({ status: "error", message: "Usuario o contraseña incorrectos" });

    res
      .cookie("cookieToken", userToken, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .status(200)
      .redirect("/products");
  }
);

authRouter.get("/logout", async (req, res) => {
  res.clearCookie("cookieToken").status(200).redirect("/");
});

authRouter.get(
  "/github",
  Passport.authenticate("github", { scope: ["user:email"], session: false }),
  async (req) => {
    console.log({ github: req });
  }
);

authRouter.get(
  "/githubcallback",
  Passport.authenticate("github", {
    failureRedirect: "/?noLogin=true",
    session: false,
  }),
  async (req, res) => {
    res
      .cookie("cookieToken", req.user, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .status(200)
      .redirect("/products");
  }
);

export default authRouter;
