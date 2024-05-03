import env from "#start/env";
import { CookieOptions } from "express";

export const config: CookieOptions = {
  domain: "",
  path: "/",
  maxAge: 1000 * 60 * 14,
  httpOnly: true,
  secure: true,
  sameSite: "none",
};
