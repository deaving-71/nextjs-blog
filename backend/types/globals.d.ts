import "@total-typescript/ts-reset";
import { User } from "#types/user.ts";

declare global {
  namespace Express {
    interface Request {
      auth: {
        user?: Omit<User, "password">;
      };
    }

    interface Response {
      created: (payload?: any) => any;
      notFound: (payload?: any) => any;
      badRequest: (payload?: any) => any;
      unauthorized: (payload?: any) => any;
      internalServerError: (payload?: any) => any;
    }
  }
}
