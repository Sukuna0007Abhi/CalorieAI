import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, User, Settings, AlertCircle, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface UserProfileModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const UserProfileModal = ({
  open = true,
  onOpenChange,
}: UserProfileModalProps) => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  const [activeTab, setActiveTab] = useState("personal");
  const [allergens, setAllergens] = useState<string[]>([
    "Peanuts",
    "Shellfish",
  ]);
  const [newAllergen, setNewAllergen] = useState("");

  const handleAddAllergen = () => {
    if (newAllergen.trim() && !allergens.includes(newAllergen.trim())) {
      setAllergens([...allergens, newAllergen.trim()]);
      setNewAllergen("");
    }
  };

  const handleRemoveAllergen = (allergen: string) => {
    setAllergens(allergens.filter((item) => item !== allergen));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center mb-6 pt-2">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage
              src={
                currentUser?.photoURL ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid || "user"}`
              }
              alt="User"
            />
            <AvatarFallback>
              {currentUser?.displayName?.charAt(0) ||
                currentUser?.email?.charAt(0) ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">
            {currentUser?.displayName || "User"}
          </h2>
          <p className="text-muted-foreground">{currentUser?.email}</p>
        </div>

        <Tabs
          defaultValue="personal"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User size={16} />
              Personal
            </TabsTrigger>
            <TabsTrigger value="dietary" className="flex items-center gap-2">
              <AlertCircle size={16} />
              Allergies
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Settings size={16} />
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" defaultValue="1990-01-01" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="dietary" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">
                  Allergen Information
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add any food allergies or intolerances. You'll receive alerts
                  when scanning or logging foods containing these allergens.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {allergens.map((allergen) => (
                    <Badge
                      key={allergen}
                      variant="outline"
                      className="py-1 px-3"
                    >
                      {allergen}
                      <button
                        className="ml-2 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveAllergen(allergen)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add allergen"
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddAllergen} size="sm">
                    <Plus size={16} className="mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">
                  Dietary Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="vegetarian" className="text-base">
                        Vegetarian
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Exclude meat products
                      </p>
                    </div>
                    <Switch id="vegetarian" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="vegan" className="text-base">
                        Vegan
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Exclude all animal products
                      </p>
                    </div>
                    <Switch id="vegan" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="gluten-free" className="text-base">
                        Gluten-Free
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Exclude gluten-containing foods
                      </p>
                    </div>
                    <Switch id="gluten-free" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Nutritional Goals</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily-calories">Daily Calorie Target</Label>
                    <Input
                      id="daily-calories"
                      type="number"
                      defaultValue="2000"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="protein-goal">Protein (g)</Label>
                      <Input
                        id="protein-goal"
                        type="number"
                        defaultValue="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carbs-goal">Carbs (g)</Label>
                      <Input id="carbs-goal" type="number" defaultValue="250" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fat-goal">Fat (g)</Label>
                      <Input id="fat-goal" type="number" defaultValue="65" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water-goal">Daily Water Target (oz)</Label>
                    <Input id="water-goal" type="number" defaultValue="64" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Health Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input id="weight" type="number" defaultValue="160" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (in)</Label>
                    <Input id="height" type="number" defaultValue="70" />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="activity-level">Activity Level</Label>
                  <select
                    id="activity-level"
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="sedentary">
                      Sedentary (little or no exercise)
                    </option>
                    <option value="light">
                      Lightly active (light exercise 1-3 days/week)
                    </option>
                    <option value="moderate">
                      Moderately active (moderate exercise 3-5 days/week)
                    </option>
                    <option value="active">
                      Active (hard exercise 6-7 days/week)
                    </option>
                    <option value="very-active">
                      Very active (very hard exercise & physical job)
                    </option>
                  </select>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="health-notes">Additional Health Notes</Label>
                  <Textarea
                    id="health-notes"
                    placeholder="Enter any additional health information here..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button className="flex items-center gap-2">
            <Save size={16} />
            Save Changes
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2 ml-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
