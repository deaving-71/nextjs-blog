import env from "#start/env";
import { CorsOptions } from "cors";

const ALLOWED_ORIGINS = env.ALLOWED_ORIGINS.split(",");

export const config: CorsOptions = {
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  maxAge: 90,
};
