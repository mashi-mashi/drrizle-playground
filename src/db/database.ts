import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

const client = new PGlite({
  dataDir: "src/db/data",
});

export const db = drizzle(client);
