import { envConfig } from "./envConfig.js";

export const listenServer = (app) => {
  return app.listen(envConfig.port, () => {
    console.log(`Example app listening on port ${envConfig.port}`);
  });
};
