import winston from "winston";
import { ABSOLUTE_PATHS } from "./filenameUtils.js";
import { envConfig } from "../config/envConfig.js";

const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warning: "magenta",
    info: "grey",
    http: "cyan",
    debug: "green",
  },
};

export const getLoggerConfig = () => {
  const transports = [];
  if (envConfig.loggerConsoleLevel) {
    transports.push(
      new winston.transports.Console({
        level: envConfig.loggerConsoleLevel,
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.colors }),
          winston.format.simple()
        ),
      })
    );
  }

  if (envConfig.loggerConsoleLevel) {
    transports.push(
      new winston.transports.File({
        level: envConfig.loggerFileLevel,
        filename: ABSOLUTE_PATHS.errorLogs,
        format: winston.format.simple(),
      })
    );
  }
  return {
    levels: levelOptions.levels,
    transports,
  };
};
