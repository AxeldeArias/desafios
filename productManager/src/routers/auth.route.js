import { Router } from "express";
import { UsersBDManager } from "../Dao/UsersBDManager.js";
import { saveSession } from "../utils/saveSession.js";
import Passport from "passport";

const authRouter = Router();

const usersManager = new UsersBDManager();

authRouter.get("/setcookies", async (req, res) => {
  res
    .cookie("coderCookie", "esta es la info de la cookie", { maxAge: 10000000 })
    .send("cookie seteada");
});

authRouter.get("/getcookies", (req, res) => {
  console.log(req.cookies);
  res.send(req.cookies);
});

authRouter.get("/setsignedcookies", async (req, res) => {
  res
    .cookie("coderCookie", "esta es la info de la cookie firmada y poderosa", {
      maxAge: 10000000,
      signed: true,
    })
    .send("cookie seteada");
});

authRouter.get("/getsignedcookies", (req, res) => {
  console.log(req.signedCookies);
  res.send(req.signedCookies);
});

authRouter.get("/deletecookies", (req, res) => {
  res.clearCookie("coderCookie").send("Cookie borradas");
});

authRouter.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
  } else {
    req.session.counter = 1;
    res.send("<h1>BIenvenidos</h1>");
  }
});

authRouter.post(
  "/register",
  Passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (_req, res) => {
    return res.status(200).redirect("/?registered=true");
  }
);

authRouter.get("/failregister", async (req, res) => {
  res.send({ error: "falla en el register" });
});

authRouter.post(
  "/login",
  Passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(401)
        .send({ status: "error", message: "Usuario o contraseña incorrectos" });

    const userSession = await usersManager.getSession({
      email: req.user.email,
    });

    req.session.user = userSession;
    await saveSession(req.session);

    res.status(200).redirect("/products");
  }
);

authRouter.get("/faillogin", async (req, res) => {
  res.send({ error: "falla en el register" });
});

authRouter.get("/current", async (req, res) => {
  res.send({ message: "datos sensibles" });
});

authRouter.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send({ status: "Logout error", message: err });
  });
  res.status(200).redirect("/");
});

export default authRouter;