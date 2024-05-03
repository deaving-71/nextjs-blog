import env from "#start/env";
import { User } from "#types/user";
import { Lucia } from "lucia";
import { config as cookieOptions } from "#config/cookies";
import { slugify } from "#util/slugify";

export type SessionConfig = ConstructorParameters<typeof Lucia>[1];

export const config: SessionConfig = {
  sessionCookie: {
    name: slugify(env.APP_NAME + "-session"),
    expires: true,
    attributes: {
      domain: cookieOptions.domain,
      sameSite: cookieOptions.sameSite,
      secure: cookieOptions.secure,
    },
  },
  getUserAttributes: (attributes: User) => {
    return {
      id: attributes.id,
      email: attributes.email,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
    };
  },
};
