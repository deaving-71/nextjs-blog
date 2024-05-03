import { config } from "#config/database";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/schemas/*",
  out: "./database/migrations/",
  driver: "pg",
  dbCredentials: config,
  verbose: true,
  strict: true,
});
