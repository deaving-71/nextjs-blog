import env from "#start/env";
import type { LoggerOptions } from "pino";

export const config: LoggerOptions = {
  level: env.LOG_LEVEL || "info",
  enabled: true,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
};
