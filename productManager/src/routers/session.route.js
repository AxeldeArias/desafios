import { Router } from "express";
import Passport from "passport";

const sessionRouter = Router();

sessionRouter.get(
  "/current",
  Passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.send({ message: req.user });
  }
);

export default sessionRouter;
