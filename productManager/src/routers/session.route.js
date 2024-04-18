import { Router } from "express";
import Passport from "passport";
import { SessionController } from "../controllers/SessionController.js";

const sessionRouter = Router();
const sessionController = new SessionController();

sessionRouter.get(
  "/current",
  Passport.authenticate("jwt", { session: false }),
  sessionController.getToken
);

export default sessionRouter;
