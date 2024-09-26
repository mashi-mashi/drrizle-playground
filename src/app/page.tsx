'use client';

import { searchMealsAction } from 'actions/actions';
import type { SearchMealCriteria } from 'actions/searchMeals';
import { useState } from 'react';

export default function Home() {
  const [meals, setMeals] = useState< Awaited<ReturnType<typeof searchMealsAction>>>([]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData);
    const criteria: SearchMealCriteria = {
      maxCalories: Number(formData.get('maxCalories')),
    };
    const result = await searchMealsAction(criteria);
    setMeals(result);
  };

  return (
    <div>
      <h1>食事検索</h1>
      <form onSubmit={handleSearch}>
        <input type="number" name="maxCalories" placeholder="最大カロリー" />
        <button type="submit">検索</button>
      </form>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>{meal.mealType} - {meal.totalCalories}カロリー</li>
        ))}
      </ul>
    </div>
  );
}