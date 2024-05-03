import { requestHandler } from "#util/request_handler";
import { lucia } from "#services/lucia";

export const authenticate = requestHandler(async (req, res, next) => {
  const cookieHeader = req.headers.cookie;

  const sessionId = lucia.readSessionCookie(cookieHeader ?? "");

  if (!sessionId) {
    return res.unauthorized({
      message: "You must be logged in to perform this action",
    });
  }

  const headers = new Headers();

  const { session, user } = await lucia.validateSession(sessionId);

  if (user) {
    // @ts-ignore //? lucia returns user without password
    req.auth.user = user;
  }

  if (!session && user) {
    const sessionCookie = lucia.createBlankSessionCookie();
    headers.append("Set-Cookie", sessionCookie.serialize());
  }

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    headers.append("Set-Cookie", sessionCookie.serialize());
  }

  next();
});
