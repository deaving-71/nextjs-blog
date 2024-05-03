import app from "#services/app";
import logger from "#services/logger";
import env from "#start/env";

// register routes and middlewares
await import("#start/kernel");

try {
  app.listen(env.PORT, () => {
    logger.info(
      `server is running on http://${env.HOST}:${env.PORT}
      \nPress CTRL+C to stop\n`
    );
  });
} catch (err) {
  logger.error(err);
  process.exit(1);
}
