import { CorsOptions } from "cors";

export const config: CorsOptions = {
  origin: "https://nextjs-blog.vercel.app",
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  maxAge: 90,
};
