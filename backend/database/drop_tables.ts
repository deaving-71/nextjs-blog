import pg from "postgres";
import { config } from "#config/database";
import logger from "#services/logger";

logger.info("dropping all tables...");

const client = pg(config);
try {
  await client`DROP TABLE if exists sessions, users, blogs, tags, blogs_to_tags cascade;`;
  logger.info("all tables dropped");
} catch (error) {
  logger.error("failed to drop tables");
  logger.error(error);
} finally {
  await client.end();
}
