"use server";

import type { drizzle } from "drizzle-orm/pglite";
import { db } from "../db/database";

import { and, eq, gt, gte, lte, type SQL, sql } from "drizzle-orm";
import { mealItems, meals } from "../db/schema";

// Types
export interface SearchMealCriteria {
  userId?: string;
  mealType?: string;
  fromDate?: Date;
  toDate?: Date;
  minCalories?: number;
  maxCalories?: number;
}

// Main search function
export async function searchMeals(
  criteria: SearchMealCriteria,
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

  const whereConditions = [
    criteria.userId && eq(meals.userId, criteria.userId),
    criteria.mealType && eq(meals.mealType, criteria.mealType),
    criteria.fromDate && gte(meals.mealDatetime, criteria.fromDate),
    criteria.toDate && lte(meals.mealDatetime, criteria.toDate),
  ].filter((v) => !!v);

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










export async function testQuery() {
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

  return await query;
}