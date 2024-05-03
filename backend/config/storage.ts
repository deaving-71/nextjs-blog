import env from "#start/env";
import { ConfigOptions } from "cloudinary";

export const config: ConfigOptions = {
  cloud_name: env.CLOUDINARY_CLOUDNAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: env.NODE_ENV === "production",
};
