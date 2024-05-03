import db from "#database/client";
import { usersTable } from "#schemas/users";
import { lucia } from "#services/lucia";
import { requestHandler } from "#util/request_handler";
import { signinValidator } from "#validators/auth";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { ZodError } from "zod";
import { v4 as uuid } from "uuid";
import { config as LuciaConfig } from "#config/auth";
import { config } from "#config/cookies";

export const show = requestHandler(async (req, res) => {
  const cookieName = LuciaConfig?.sessionCookie?.name ?? "";
  const sessionId = req.cookies[cookieName];

  const { session } = await lucia.validateSession(sessionId);

  res.json({ isAuthenticated: !!session });
});

export const create = requestHandler(async (req, res) => {
  const { email, password, remember } = signinValidator.parse(req.body);

  const [user] = await db
    .select({ id: usersTable.id, password: usersTable.password })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user)
    throw new ZodError([
      {
        message: "Invalid email or password",
        code: "custom",
        path: ["root"],
      },
    ]);

  const validPassword = await new Argon2id().verify(user.password, password);

  if (!validPassword)
    throw new ZodError([
      {
        message: "Invalid email or password",
        code: "custom",
        path: ["root"],
      },
    ]);

  const sessionId = uuid();
  const session = await lucia.createSession(user.id, {}, { sessionId });
  const sessionCookie = lucia.createSessionCookie(session.id);

  const week = 1000 * 60 * 60 * 24 * 7;

  res.cookie(sessionCookie.name, sessionCookie.value, {
    ...config,
    maxAge: remember ? week : config.maxAge,
  });
  res.end();
});

export const destroy = requestHandler(async (req, res) => {
  await lucia.invalidateUserSessions(req.auth.user!.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  res.setHeader("Set-Cookie", sessionCookie.serialize());

  res.status(200).end();
});
