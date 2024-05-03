import { requestHandler } from "#util/request_handler";

export const customRequestMethods = requestHandler((req, res, next) => {
  req.auth = {};
  next();
});
