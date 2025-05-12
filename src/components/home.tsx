import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, User, Bell, Menu } from "lucide-react";
import NutritionSummary from "./NutritionSummary";
import FoodSearch from "./FoodSearch";
import AllergyAlerts from "./AllergyAlerts";
import UserProfileModal from "./UserProfileModal";

const Home = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary mr-2">
              CalorieAI
            </div>
            <span className="text-sm text-muted-foreground">
              Food Nutrition & Allergy Tracker
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileOpen(true)}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Welcome Section */}
          <section>
            <h1 className="text-3xl font-bold">Welcome back, User!</h1>
            <p className="text-muted-foreground">
              Here's your nutrition overview for today
            </p>
          </section>

          {/* Nutrition Summary */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Nutrition Summary</h2>
            <NutritionSummary />
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Food Search - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Food Search</h2>
                  <FoodSearch />
                </CardContent>
              </Card>
            </div>

            {/* Allergy Alerts */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Allergy Alerts</h2>
                  <AllergyAlerts />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Meals Section */}
          <section>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Meals</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-gray-100 rounded-lg p-4">
                      <div className="aspect-video bg-gray-200 rounded-md mb-3"></div>
                      <h3 className="font-medium">Meal {item}</h3>
                      <p className="text-sm text-muted-foreground">
                        450 calories
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default Home;
