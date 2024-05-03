import { CorsOptions } from "cors";

export const config: CorsOptions = {
  origin: "http://127.0.0.1:3000",
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  maxAge: 90,
};
