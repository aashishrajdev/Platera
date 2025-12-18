import dotenv from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";

// Load environment variables from .env.local
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
