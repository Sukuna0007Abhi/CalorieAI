import React, { useState } from "react";
import { Search, Camera, Plus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
  image?: string;
}

interface FoodSearchProps {
  onAddFood?: (food: FoodItem) => void;
  userAllergens?: string[];
}

const FoodSearch = ({
  onAddFood = () => {},
  userAllergens = ["nuts", "dairy"],
}: FoodSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("text");

  // Mock food data
  const mockFoodItems: FoodItem[] = [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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
      id: "4",
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

  const filteredFoods = searchQuery
    ? mockFoodItems.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    setIsDialogOpen(true);
  };

  const handleAddFood = () => {
    if (selectedFood) {
      onAddFood(selectedFood);
      setIsDialogOpen(false);
    }
  };

  const handleCameraClick = () => {
    // In a real app, this would open the camera
    alert("Camera functionality would open here");
  };

  const hasAllergen = (food: FoodItem) => {
    return food.allergens.some((allergen) => userAllergens.includes(allergen));
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Food Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="text"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="text">Text Search</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searchQuery && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Search Results</h3>
                <div className="space-y-2">
                  {filteredFoods.length > 0 ? (
                    filteredFoods.map((food) => (
                      <div
                        key={food.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleFoodSelect(food)}
                      >
                        <div className="flex items-center space-x-3">
                          {food.image && (
                            <Avatar className="h-10 w-10">
                              <img src={food.image} alt={food.name} />
                            </Avatar>
                          )}
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-sm text-gray-500">
                              {food.calories} kcal
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {hasAllergen(food) && (
                            <Badge
                              variant="destructive"
                              className="flex items-center space-x-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              <span>Allergen</span>
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No results found
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="camera" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md">
              <Camera className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-center text-gray-500 mb-4">
                Take a photo of your food or scan a barcode
              </p>
              <Button onClick={handleCameraClick}>
                <Camera className="mr-2 h-4 w-4" /> Open Camera
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Food Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Food Details</DialogTitle>
            </DialogHeader>

            {selectedFood && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedFood.image && (
                    <img
                      src={selectedFood.image}
                      alt={selectedFood.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{selectedFood.name}</h3>
                    <p className="text-gray-500">
                      {selectedFood.calories} calories per serving
                    </p>
                  </div>
                </div>

                {hasAllergen(selectedFood) && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p className="text-red-700 text-sm">
                      Contains allergens:{" "}
                      {selectedFood.allergens
                        .filter((a) => userAllergens.includes(a))
                        .join(", ")}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-medium">Nutrition Facts</h4>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Protein</span>
                        <span>{selectedFood.protein}g</span>
                      </div>
                      <Progress
                        value={(selectedFood.protein / 50) * 100}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Carbs</span>
                        <span>{selectedFood.carbs}g</span>
                      </div>
                      <Progress
                        value={(selectedFood.carbs / 300) * 100}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Fat</span>
                        <span>{selectedFood.fat}g</span>
                      </div>
                      <Progress
                        value={(selectedFood.fat / 65) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddFood}>Add to Daily Log</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FoodSearch;
