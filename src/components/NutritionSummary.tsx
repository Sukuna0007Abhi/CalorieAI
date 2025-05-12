import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PieChart, BarChart2, TrendingUp } from "lucide-react";

interface NutritionSummaryProps {
  dailyCalories: {
    consumed: number;
    goal: number;
  };
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  progress: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const NutritionSummary = ({
  dailyCalories = {
    consumed: 1450,
    goal: 2000,
  },
  macros = {
    protein: 65,
    carbs: 180,
    fat: 55,
  },
  progress = {
    protein: 70,
    carbs: 60,
    fat: 45,
  },
}: NutritionSummaryProps) => {
  const caloriePercentage = Math.min(
    Math.round((dailyCalories.consumed / dailyCalories.goal) * 100),
    100,
  );

  return (
    <div className="w-full bg-background rounded-xl p-4">
      <h2 className="text-2xl font-bold mb-4">Nutrition Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Calorie Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-primary" />
              Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-3xl font-bold">
                {dailyCalories.consumed}
              </span>
              <span className="text-muted-foreground">
                / {dailyCalories.goal}
              </span>
            </div>
            <Progress value={caloriePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {dailyCalories.goal - dailyCalories.consumed} calories remaining
            </p>
          </CardContent>
        </Card>

        {/* Macronutrients Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Macronutrients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm text-muted-foreground">
                    {macros.protein}g
                  </span>
                </div>
                <Progress value={progress.protein} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Carbs</span>
                  <span className="text-sm text-muted-foreground">
                    {macros.carbs}g
                  </span>
                </div>
                <Progress value={progress.carbs} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Fat</span>
                  <span className="text-sm text-muted-foreground">
                    {macros.fat}g
                  </span>
                </div>
                <Progress value={progress.fat} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Goals Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Nutritional Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Daily Water</p>
                  <p className="text-xs text-muted-foreground">
                    5 of 8 glasses
                  </p>
                </div>
                <Progress value={62.5} className="w-1/3 h-2" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Fiber</p>
                  <p className="text-xs text-muted-foreground">12g of 25g</p>
                </div>
                <Progress value={48} className="w-1/3 h-2" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sugar</p>
                  <p className="text-xs text-muted-foreground">18g of 25g</p>
                </div>
                <Progress value={72} className="w-1/3 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionSummary;
