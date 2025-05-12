import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bell, AlertTriangle, ShieldAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Allergen {
  name: string;
  severity: "high" | "medium" | "low";
  detectedIn?: string;
}

interface AllergyAlertsProps {
  allergens?: Allergen[];
  className?: string;
}

const AllergyAlerts = ({
  allergens = defaultAllergens,
  className,
}: AllergyAlertsProps) => {
  const [expanded, setExpanded] = useState(false);

  const highSeverityAllergens = allergens.filter(
    (allergen) => allergen.severity === "high",
  );
  const otherAllergens = allergens.filter(
    (allergen) => allergen.severity !== "high",
  );

  const severityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-400";
      case "low":
        return "bg-yellow-300";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <Card className={`bg-white shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Allergy Alerts
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {allergens.length} detected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {highSeverityAllergens.length > 0 ? (
          <Alert className="mb-3 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-600">
              High Risk Allergens Detected
            </AlertTitle>
            <AlertDescription className="text-red-600">
              Your logged foods contain allergens that you've marked as high
              severity.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-3 border-green-200 bg-green-50">
            <Bell className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-600">
              No High Risk Allergens
            </AlertTitle>
            <AlertDescription className="text-green-600">
              No high severity allergens detected in your logged foods.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Detected allergens:</h4>
          <div className="flex flex-wrap gap-2">
            {allergens
              .slice(0, expanded ? allergens.length : 3)
              .map((allergen, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        className={`${severityColor(allergen.severity)} text-white cursor-help`}
                      >
                        {allergen.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Severity: {allergen.severity}</p>
                      {allergen.detectedIn && (
                        <p>Found in: {allergen.detectedIn}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

            {!expanded && allergens.length > 3 && (
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => setExpanded(true)}
              >
                +{allergens.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Default allergens for demonstration
const defaultAllergens: Allergen[] = [
  { name: "Peanuts", severity: "high", detectedIn: "Chocolate Cookie" },
  { name: "Gluten", severity: "medium", detectedIn: "Whole Wheat Bread" },
  { name: "Lactose", severity: "medium", detectedIn: "Cheese Sandwich" },
  { name: "Shellfish", severity: "high", detectedIn: "Seafood Pasta" },
  { name: "Soy", severity: "low", detectedIn: "Veggie Burger" },
];

export default AllergyAlerts;
