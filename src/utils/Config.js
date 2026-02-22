import * as dotenv from "dotenv";
dotenv.config();

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "").split(","),
  PORT: process.env.PORT ?? 80,
  DEFAULT_API_KEY: process.env.DEFAULT_API_KEY ?? "",
};

export default config;
