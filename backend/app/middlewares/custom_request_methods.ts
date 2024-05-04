import { requestHandler } from "#util/request_handler";

export const customRequestMethods = requestHandler((req, _, next) => {
  req.auth = {};
  next();
});
