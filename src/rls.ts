// src/migrations/manual/0001_apply_rls.ts
import { sql } from "drizzle-orm";
import { db } from "./db";

const rlsCommands = [
  sql`
    CREATE OR REPLACE FUNCTION current_user_id() RETURNS UUID AS $func$
    BEGIN
      RETURN (current_setting('app.current_user_id'))::UUID;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER
  `,
  sql`ALTER TABLE users ENABLE ROW LEVEL SECURITY`,
  sql`CREATE POLICY users_isolation_policy ON users USING (id = current_user_id())`,
  sql`ALTER TABLE meals ENABLE ROW LEVEL SECURITY`,
  sql`CREATE POLICY meals_isolation_policy ON meals USING (user_id = current_user_id())`,
  sql`ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY`,
  sql`
    CREATE POLICY meal_items_isolation_policy ON meal_items USING (
      meal_id IN (
        SELECT id
        FROM meals
        WHERE user_id = current_user_id()
      )
    )
  `,
  sql`
    DO $do$
    BEGIN
      IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles
        WHERE rolname = 'app_user'
      ) THEN
        CREATE ROLE app_user;
      END IF;
    END
    $do$
  `,
  sql`GRANT SELECT, INSERT, UPDATE, DELETE ON users, meals, meal_items TO app_user`,
  sql`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user`,
];

export async function applyRls() {
  for (const command of rlsCommands) {
    try {
      await db.execute(command);
    } catch (error) {
      console.error("Error executing command:", command);
      throw error;
    }
  }
}

async function runManualMigrations() {
  console.log("Applying RLS...");
  await applyRls();
  console.log("RLS applied successfully");
}

runManualMigrations().catch(console.error);
