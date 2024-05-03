import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "#config/database";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import logger from "#services/logger";

logger.info("Running migrations...");

const client = new pg.Pool(config);

try {
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: "database/migrations/" });
  logger.info("migrations complete.");
} catch (error) {
  logger.error("an error occurred while running migrations");
  logger.error(error);
} finally {
  await client.end();
}
