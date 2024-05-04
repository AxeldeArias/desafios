import winston from "winston";
import { getLoggerConfig } from "../utils/loggerUtils.js";

const logger = winston.createLogger(getLoggerConfig());

export const addLogger = (req, _res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleDateString()},`
  );
  return next();
};
