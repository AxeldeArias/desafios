import jwt from "jsonwebtoken";
import { envConfig } from "./envConfig.js";

export const generateToken = ({ _id, ...user }) =>
  jwt.sign(user, envConfig.jwt_secret_key, { expiresIn: "24h" });

export const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).send({ status: "error", message: "no token" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, envConfig.jwt_secret_key, (error, decodeUser) => {
    if (error)
      return res
        .status(401)
        .send({ status: "error", message: "no athorizated" });

    req.user = decodeUser;
    next();
  });
};
