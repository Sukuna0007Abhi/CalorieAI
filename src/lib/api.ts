import clientPromise from "./mongodb";

// Types
export interface User {
  _id?: string;
  uid: string; // Firebase user ID
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  allergens: string[];
  dietaryPreferences: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  nutritionalGoals: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  healthInfo: {
    weight: number;
    height: number;
    activityLevel: string;
    notes?: string;
  };
}

export interface FoodItem {
  _id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
  image?: string;
}

export interface DailyLog {
  _id?: string;
  userId: string;
  date: string;
  foods: {
    foodId: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: number;
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    time: string;
  }[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
}

// Mock data for development without MongoDB connection
const mockUsers: User[] = [
  {
    uid: "mock-user-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dob: "1990-01-01",
    gender: "male",
    allergens: ["Peanuts", "Shellfish"],
    dietaryPreferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
    },
    nutritionalGoals: {
      dailyCalories: 2000,
      protein: 120,
      carbs: 250,
      fat: 65,
      water: 64,
    },
    healthInfo: {
      weight: 160,
      height: 70,
      activityLevel: "moderate",
      notes: "",
    },
  },
];

const mockFoodItems: FoodItem[] = [
  {
    _id: "1",
    name: "Greek Yogurt",
    calories: 100,
    protein: 10,
    carbs: 5,
    fat: 3,
    allergens: ["dairy"],
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80",
  },
  {
    _id: "2",
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    allergens: [],
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&q=80",
  },
  {
    _id: "3",
    name: "Almond Butter",
    calories: 200,
    protein: 7,
    carbs: 6,
    fat: 18,
    allergens: ["nuts"],
    image:
      "https://images.unsplash.com/photo-1612187209234-3ba398bd8099?w=300&q=80",
  },
  {
    _id: "4",
    name: "Avocado Toast",
    calories: 290,
    protein: 8,
    carbs: 30,
    fat: 15,
    allergens: ["gluten"],
    image:
      "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=300&q=80",
  },
];

const mockAllergens = [
  { name: "Peanuts", severity: "high", detectedIn: "Chocolate Cookie" },
  { name: "Gluten", severity: "medium", detectedIn: "Whole Wheat Bread" },
  { name: "Lactose", severity: "medium", detectedIn: "Cheese Sandwich" },
  { name: "Shellfish", severity: "high", detectedIn: "Seafood Pasta" },
  { name: "Soy", severity: "low", detectedIn: "Veggie Burger" },
];

const mockRecentMeals = [
  {
    name: "Breakfast Bowl",
    calories: 450,
    image:
      "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=300&q=80",
  },
  {
    name: "Chicken Salad",
    calories: 350,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
  },
  {
    name: "Salmon Dinner",
    calories: 550,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&q=80",
  },
];

// API Functions
export async function getCurrentUser(uid?: string): Promise<User> {
  if (!import.meta.env.VITE_MONGODB_URI || !uid) {
    return mockUsers[0];
  }

  try {
    const client = await clientPromise;
    const db = client.db("calorieai");
    const user = await db.collection("users").findOne({ uid });

    if (user) {
      return user as User;
    } else {
      // Return mock user if not found in DB
      return mockUsers[0];
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return mockUsers[0];
  }
}

export async function updateUser(userData: User): Promise<User> {
  if (!import.meta.env.VITE_MONGODB_URI) {
    console.log("Mock update user:", userData);
    return userData;
  }

  try {
    const client = await clientPromise;
    const db = client.db("calorieai");

    const { _id, ...userDataWithoutId } = userData;

    if (_id) {
      await db
        .collection("users")
        .updateOne({ _id }, { $set: userDataWithoutId });
    } else {
      await db.collection("users").insertOne(userData);
    }

    return userData;
  } catch (error) {
    console.error("Error updating user:", error);
    return userData;
  }
}

export async function searchFoods(query: string): Promise<FoodItem[]> {
  if (!import.meta.env.VITE_MONGODB_URI || !query) {
    return query
      ? mockFoodItems.filter((food) =>
          food.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];
  }

  try {
    const client = await clientPromise;
    const db = client.db("calorieai");
    const foods = await db
      .collection("foods")
      .find({ name: { $regex: query, $options: "i" } })
      .limit(10)
      .toArray();

    return foods as FoodItem[];
  } catch (error) {
    console.error("Error searching foods:", error);
    return mockFoodItems.filter((food) =>
      food.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
}

export async function getDailyNutrition(userId?: string): Promise<{
  dailyCalories: { consumed: number; goal: number };
  macros: { protein: number; carbs: number; fat: number };
  progress: { protein: number; carbs: number; fat: number };
}> {
  if (!import.meta.env.VITE_MONGODB_URI || !userId) {
    return {
      dailyCalories: {
        consumed: 1450,
        goal: 2000,
      },
      macros: {
        protein: 65,
        carbs: 180,
        fat: 55,
      },
      progress: {
        protein: 70,
        carbs: 60,
        fat: 45,
      },
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db("calorieai");

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Get user's nutritional goals
    const user = await db.collection("users").findOne({ uid: userId });

    // Get today's food log
    const dailyLog = await db.collection("dailyLogs").findOne({
      userId,
      date: today,
    });

    if (!user || !dailyLog) {
      return {
        dailyCalories: {
          consumed: 0,
          goal: user?.nutritionalGoals?.dailyCalories || 2000,
        },
        macros: {
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        progress: {
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      };
    }

    const consumed = dailyLog.totalNutrition.calories;
    const goal = user.nutritionalGoals.dailyCalories;

    return {
      dailyCalories: {
        consumed,
        goal,
      },
      macros: {
        protein: dailyLog.totalNutrition.protein,
        carbs: dailyLog.totalNutrition.carbs,
        fat: dailyLog.totalNutrition.fat,
      },
      progress: {
        protein: Math.min(
          100,
          (dailyLog.totalNutrition.protein / user.nutritionalGoals.protein) *
            100,
        ),
        carbs: Math.min(
          100,
          (dailyLog.totalNutrition.carbs / user.nutritionalGoals.carbs) * 100,
        ),
        fat: Math.min(
          100,
          (dailyLog.totalNutrition.fat / user.nutritionalGoals.fat) * 100,
        ),
      },
    };
  } catch (error) {
    console.error("Error fetching daily nutrition:", error);
    return {
      dailyCalories: {
        consumed: 1450,
        goal: 2000,
      },
      macros: {
        protein: 65,
        carbs: 180,
        fat: 55,
      },
      progress: {
        protein: 70,
        carbs: 60,
        fat: 45,
      },
    };
  }
}

export async function getUserAllergens(userId?: string): Promise<string[]> {
  if (!import.meta.env.VITE_MONGODB_URI || !userId) {
    return ["Peanuts", "Shellfish"];
  }

  try {
    const client = await clientPromise;
    const db = client.db("calorieai");
    const user = await db.collection("users").findOne({ uid: userId });

    return user?.allergens || [];
  } catch (error) {
    console.error("Error fetching user allergens:", error);
    return ["Peanuts", "Shellfish"];
  }
}

export async function getAllergenAlerts(userId?: string): Promise<
  {
    name: string;
    severity: "high" | "medium" | "low";
    detectedIn?: string;
  }[]
> {
  if (!import.meta.env.VITE_MONGODB_URI || !userId) {
    return mockAllergens;
  }

  try {
    const client = await clientPromise;
    const db = client.db("calorieai");

    // Get user's allergens
    const user = await db.collection("users").findOne({ uid: userId });
    if (!user?.allergens || user.allergens.length === 0) {
      return [];
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Get today's food log
    const dailyLog = await db.collection("dailyLogs").findOne({
      userId,
      date: today,
    });

    if (!dailyLog) {
      return [];
    }

    // Check for allergens in today's foods
    const alerts = [];
    for (const food of dailyLog.foods) {
      const foodItem = await db
        .collection("foods")
        .findOne({ _id: food.foodId });
      if (foodItem && foodItem.allergens) {
        for (const allergen of foodItem.allergens) {
          if (user.allergens.includes(allergen)) {
            alerts.push({
              name: allergen,
              severity: "high", // You could store severity in user preferences
              detectedIn: food.name,
            });
          }
        }
      }
    }

    return alerts;
  } catch (error) {
    console.error("Error fetching allergen alerts:", error);
    return mockAllergens;
  }
}

export async function getRecentMeals(userId?: string): Promise<
  {
    name: string;
    calories: number;
    image?: string;
  }[]
> {
  if (!import.meta.env.VITE_MONGODB_URI || !userId) {
    return mockRecentMeals;
  }

  try {
    const client = await clientPromise;
    const db = client.db("calorieai");

    // Get recent daily logs
    const dailyLogs = await db
      .collection("dailyLogs")
      .find({ userId })
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    if (dailyLogs.length === 0) {
      return mockRecentMeals;
    }

    // Get the most recent foods
    const recentFoods = dailyLogs[0].foods.slice(0, 3).map((food) => ({
      name: food.name,
      calories: food.calories,
      // You would need to store images with the food logs or fetch them separately
      image: mockFoodItems.find((item) => item.name === food.name)?.image,
    }));

    return recentFoods.length > 0 ? recentFoods : mockRecentMeals;
  } catch (error) {
    console.error("Error fetching recent meals:", error);
    return mockRecentMeals;
  }
}

export async function addFoodToLog(
  food: FoodItem,
  userId?: string,
): Promise<void> {
  if (!import.meta.env.VITE_MONGODB_URI || !userId) {
    console.log("Mock adding food to log:", food);
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db("calorieai");

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toISOString();

    // Find today's log
    const dailyLog = await db.collection("dailyLogs").findOne({
      userId,
      date: today,
    });

    if (dailyLog) {
      // Add food to existing log
      const updatedFoods = [
        ...dailyLog.foods,
        {
          foodId: food._id,
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          servingSize: 1, // Default serving size
          mealType: "snack", // Default meal type
          time: now,
        },
      ];

      // Update total nutrition
      const totalNutrition = {
        calories: dailyLog.totalNutrition.calories + food.calories,
        protein: dailyLog.totalNutrition.protein + food.protein,
        carbs: dailyLog.totalNutrition.carbs + food.carbs,
        fat: dailyLog.totalNutrition.fat + food.fat,
        water: dailyLog.totalNutrition.water, // Water is tracked separately
      };

      await db.collection("dailyLogs").updateOne(
        { _id: dailyLog._id },
        {
          $set: {
            foods: updatedFoods,
            totalNutrition,
          },
        },
      );
    } else {
      // Create new log for today
      await db.collection("dailyLogs").insertOne({
        userId,
        date: today,
        foods: [
          {
            foodId: food._id,
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            servingSize: 1, // Default serving size
            mealType: "snack", // Default meal type
            time: now,
          },
        ],
        totalNutrition: {
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          water: 0, // Default water intake
        },
      });
    }
  } catch (error) {
    console.error("Error adding food to log:", error);
  }
}
