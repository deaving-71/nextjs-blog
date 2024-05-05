import { Env } from "@adonisjs/env";
import dotenv from "dotenv";

console.log("importing env");
dotenv.config();

const validator = Env.rules({
  APP_NAME: Env.schema.string(),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: "host" }),
  NODE_ENV: Env.schema.enum(["development", "production", "test"]),
  APP_DEBUG: Env.schema.boolean(),
  LOG_LEVEL: Env.schema.string(),
  ALLOWED_ORIGINS: Env.schema.string(),

  // database variables
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_DATABASE: Env.schema.string(),

  // cloudinary variables
  CLOUDINARY_CLOUDNAME: Env.schema.string(),
  CLOUDINARY_API_KEY: Env.schema.string(),
  CLOUDINARY_API_SECRET: Env.schema.string(),
});

const env = validator.validate(process.env);

export default env;
