import { User } from "#types/user";
import { requestHandler } from "#util/request_handler";

export const customRequestMethods = requestHandler((req, _, next) => {
  req.auth = {};
  next();
});

declare global {
  namespace Express {
    interface Request {
      auth: {
        user?: Omit<User, "password">;
      };
    }
  }
}
