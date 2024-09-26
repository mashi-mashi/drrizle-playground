"use server";

import { type SearchMealCriteria, searchMeals } from "actions/searchMeals";

export async function searchMealsAction(criteria: SearchMealCriteria) {
  return await searchMeals(criteria);
}
