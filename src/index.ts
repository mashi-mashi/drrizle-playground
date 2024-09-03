import type { drizzle } from "drizzle-orm/pglite";
import { db } from "./db/database";

import { and, eq, gt, gte, lte, type SQL, sql } from "drizzle-orm";
import { mealItems, meals } from "./db/schema";

// Types
export interface MealSearchCriteria {
  userId?: string;
  mealType?: string;
  fromDate?: Date;
  toDate?: Date;
  minCalories?: number;
  maxCalories?: number;
}

// Main search function
export async function searchMeals(
  criteria: MealSearchCriteria,
) {
  const query = db
    .select({
      id: meals.id,
      userId: meals.userId,
      mealType: meals.mealType,
      mealDatetime: meals.mealDatetime,
      totalCalories: sql<number>`COALESCE(SUM(${mealItems.calories}), 0)`,
      itemCount: sql<number>`COUNT(${mealItems.id})`.as("itemCount"),
    })
    .from(meals)
    .leftJoin(mealItems, eq(meals.id, mealItems.mealId))
    .groupBy(meals.id);

  // Build WHERE conditions
  const whereConditions: SQL[] = [];

  if (criteria.userId) {
    whereConditions.push(eq(meals.userId, criteria.userId));
  }
  if (criteria.mealType) {
    whereConditions.push(eq(meals.mealType, criteria.mealType));
  }
  if (criteria.fromDate) {
    whereConditions.push(gte(meals.mealDatetime, criteria.fromDate));
  }
  if (criteria.toDate) {
    whereConditions.push(lte(meals.mealDatetime, criteria.toDate));
  }

  if (whereConditions.length > 0) {
    query.where(and(...whereConditions));
  }

  const havingConditions: SQL[] = [];

  if (criteria.minCalories !== undefined) {
    query.having(({ totalCalories }) =>
      gte(totalCalories, criteria.minCalories)
    );
  }
  if (criteria.maxCalories !== undefined) {
    query.having(({ totalCalories }) =>
      lte(totalCalories, criteria.maxCalories)
    );
  }

  if (havingConditions.length > 0) {
    query.having(and(...havingConditions));
  }

  return await query;
}

const main = async () => {
  console.info(
    await searchMeals({
      maxCalories: 800,
      mealType: "間食",
      userId: "5ba09ce4-0a2a-4b78-96dd-43325491c639",
    }),
  );
};

main();
