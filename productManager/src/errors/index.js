import CustomError from "./CustomError.js";
import EErrors from "./ErrorsList.js";

export default (error, req, res, next) => {
  if (error instanceof CustomError) {
    req.logger.error(JSON.stringify(error));
  }

  switch (error.code) {
    case EErrors.USER_ALREADY_EXIST:
      return res.status(401).redirect("/register?alreadyExist=true");
    case EErrors.ERROR_CREATING_USER:
      return res.status(500).redirect("/register?noRegistered=true");
    case EErrors.USER_NOT_EXIST:
      return res.status(500).redirect("/?noLogin=true");
    case EErrors.INVALID_USER:
      return res.status(500).redirect("/?noLogin=true");
    case EErrors.INVALID_PRODUCT_PARAMS:
      return res.status(400).send({
        status: "error",
        error: error.cause,
      });
    case EErrors.INVALID_PRODUCT_THUMBNAIL:
      return res.status(400).send({
        status: "error",
        error: error.cause,
      });

    case EErrors.NO_EXIST_PRODUCT:
      return res.status(404).send({
        status: "error",
        error: error.cause,
      });

    case EErrors.NO_EXIST_CART:
      return res.status(404).send({
        status: "error",
        error: "carrito no encontrado",
      });

    case EErrors.INSUFFICIENT_STOCK:
      return res.status(500).send({
        status: "error",
        error: "insufficient stock",
      });
    case EErrors.NOT_AUTHORIZED:
      return res.status(401).send({
        status: "error",
        error: "Not authorized",
      });

    case EErrors.PASSWORDS_DOES_NOT_MATCH:
      return res.status(400).send({
        status: "error",
        error: "Las contraseñas no coinciden",
      });

    case EErrors.TOKEN_EXPIRED:
      return res.status(400).send({
        status: "error",
        error: "Token expirado",
      });

    case EErrors.PASSWORD_ALREADY_USED:
      return res.status(400).send({
        status: "error",
        error: "No puedes usar una contraseña anterior.",
      });
    case EErrors.CANNOT_UPDATE_USER:
      return res.status(400).send({
        status: "error",
        error: "No se pudo actualizar al usuario.",
      });

    default:
      req.logger.error("unhandled-error");
      try {
        req.logger.error(JSON.stringify(error));
      } catch (error) {
        //
      }

      res.send({ status: "error", error });
  }
};
