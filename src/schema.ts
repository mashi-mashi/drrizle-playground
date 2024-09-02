import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meals = pgTable("meals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  mealType: text("meal_type").notNull(),
  mealDatetime: timestamp("meal_datetime").notNull(),
  notes: text("notes"),
});

export const mealItems = pgTable("meal_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  mealId: uuid("meal_id").references(() => meals.id).notNull(),
  foodName: text("food_name").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit").notNull(),
  calories: text("calories"),
  protein: text("protein"),
  carbs: text("carbs"),
  fat: text("fat"),
  /**
   * for RLS
   */
  userId: uuid("user_id").references(() => users.id).notNull(),
});
