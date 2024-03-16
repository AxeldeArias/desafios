import jwt from "jsonwebtoken";

export const JWT_PRIVATE_KEY = "PALABRA_SECRETA";

export const generateToken = ({ _id, ...user }) =>
  jwt.sign(user, JWT_PRIVATE_KEY, { expiresIn: "24h" });

export const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).send({ status: "error", message: "no token" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_PRIVATE_KEY, (error, decodeUser) => {
    if (error)
      return res
        .status(401)
        .send({ status: "error", message: "no athorizated" });

    req.user = decodeUser;
    next();
  });
};
