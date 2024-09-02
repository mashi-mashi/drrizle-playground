import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "./data",
  },
  driver: "pglite",
} satisfies Config;
