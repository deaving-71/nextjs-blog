import { requestHandler } from "#util/request_handler";

export const customReponseMethods = requestHandler((_, res, next) => {
  function customResponse(statusCode: number, payload?: any) {
    res.status(statusCode);

    if (!payload) {
      return res.end();
    }

    if (typeof payload === "object") res.json(payload);
    else res.send(payload);
  }

  res.created = (payload?: any) => customResponse(201, payload);
  res.notFound = (payload?: any) => customResponse(404, payload);
  res.badRequest = (payload?: any) => customResponse(400, payload);
  res.unauthorized = (payload?: any) => customResponse(401, payload);
  res.internalServerError = (payload?: any) => customResponse(500, payload);

  next();
});

declare global {
  namespace Express {
    interface Response {
      created: (payload?: any) => any;
      notFound: (payload?: any) => any;
      badRequest: (payload?: any) => any;
      unauthorized: (payload?: any) => any;
      internalServerError: (payload?: any) => any;
    }
  }
}
