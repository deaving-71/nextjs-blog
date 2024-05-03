import { config } from "#config/logger";
import { pinoHttp } from "pino-http";
import { pino } from "pino";

export const httpLogger = pinoHttp(config);

export const logger = pino(config);

export default logger;
