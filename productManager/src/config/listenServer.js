import { envConfig } from "./envConfig.js";
import { logger } from "./logger.js";

export const listenServer = (app) => {
  return app.listen(envConfig.port, () => {
    logger.info(`Example app listening on port ${envConfig.port}`);
  });
};
