import dotenv from "dotenv";
import program from "./commander.js";

const options = program.opts();

const envsPaths = {
  development: ".env.development",
  testing: ".env.testing",
  production: ".env.production",
};

dotenv.config({
  path: envsPaths[options?.mode ?? "development"],
});

export const envConfig = {
  port: process.env.PORT,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  mode: process.env.MODE,
  mongo_url: process.env.MONGO_URL,
  loggerConsoleLevel: process.env.LOGGER_CONSOLE_LEVEL,
  loggerFileLevel: process.env.LOGGER_FILE_LEVEL,
  gmailUserApp: process.env.GMAIL_USER_APP,
  gmailUserPassword: process.env.GMAIL_USER_PASSWORD,
  baseUrl: process.env.BASE_URL,
};

console.log({ envConfig });
