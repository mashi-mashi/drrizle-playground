import { faker } from "@faker-js/faker";
import { db } from "./database";
import { mealItems, meals, users } from "./schema";

async function createUser(username: string, email: string) {
  const [newUser] = await db.insert(users).values({
    username,
    email,
  }).returning();
  return newUser;
}

async function addMeal(
  userId: string,
  mealType: string,
  mealDatetime: Date,
  notes?: string,
) {
  const [newMeal] = await db.insert(meals).values({
    userId,
    mealType,
    mealDatetime,
    notes,
  }).returning();
  return newMeal;
}

async function addMealItem(
  userId: string,
  mealId: string,
  foodName: string,
  quantity: string,
  unit: string,
  calories?: number,
  protein?: number,
  carbs?: number,
  fat?: number,
) {
  const [newMealItem] = await db.insert(mealItems).values({
    mealId,
    foodName,
    quantity,
    unit,
    calories,
    protein,
    carbs,
    fat,
    userId,
  }).returning();
  return newMealItem;
}

async function generateDummyData(
  userCount: number,
  mealsPerUser: number,
  itemsPerMeal: number,
) {
  await db.delete(mealItems);
  await db.delete(meals);
  await db.delete(users);

  for (let i = 0; i < userCount; i++) {
    const user = await createUser(
      faker.internet.userName(),
      faker.internet.email(),
    );
    console.log(`Created user: ${user.username}`);

    for (let j = 0; j < mealsPerUser; j++) {
      const meal = await addMeal(
        user.id,
        faker.helpers.arrayElement(["朝食", "昼食", "夕食", "間食"]),
        faker.date.recent(),
        faker.lorem.sentence(),
      );
      console.log(`Added meal for ${user.username}: ${meal.mealType}`);

      for (let k = 0; k < itemsPerMeal; k++) {
        const mealItem = await addMealItem(
          user.id,
          meal.id,
          faker.food.dish(),
          faker.number.float({ min: 50, max: 500 }).toString(),
          faker.helpers.arrayElement(["g", "ml", "個", "皿", "カップ"]),
          faker.number.int({ min: 50, max: 800 }),
          faker.number.int({ min: 0, max: 50 }),
          faker.number.int({ min: 0, max: 100 }),
          faker.number.int({ min: 0, max: 50 }),
        );
        console.log(`Added meal item: ${mealItem.foodName}`);
      }
    }
  }
}

async function main() {
  try {
    await generateDummyData(5, 3, 2);
    console.log("Dummy data generation completed.");
  } catch (error) {
    console.error("Error generating dummy data:", error);
  } finally {
  }
}

main();
