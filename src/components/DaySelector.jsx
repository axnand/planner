import { useState } from "react";
import { Plus, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DaySelector = ({ activeDays, onDaysChange }) => {
  const [showAllDays, setShowAllDays] = useState(false);

  const allDays = ["friday", "saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"];
  const weekendDays = ["saturday", "sunday"];
  const extendedWeekendDays = ["friday", "saturday", "sunday", "monday"];

  const toggleDay = (day) => {
    if (activeDays.includes(day)) {
      onDaysChange(activeDays.filter(d => d !== day));
    } else {
      const dayOrder = ["friday", "saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"];
      const newDays = [...activeDays, day].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
      onDaysChange(newDays);
    }
  };

  const setPreset = (preset) => {
    switch (preset) {
      case "weekend":
        onDaysChange(weekendDays);
        break;
      case "extended":
        onDaysChange(extendedWeekendDays);
        break;
      case "clear":
        onDaysChange([]);
        break;
    }
  };

  const getDayLabel = (day) => day.charAt(0).toUpperCase() + day.slice(1);

  const displayDays = showAllDays ? allDays : allDays.slice(0, 4); 

  return (
    <Card className="p-4 border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#171717]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-card-foreground">
            Select Days
          </h3>
          <Calendar className="h-5 w-5 text-gray-500 dark:text-muted-foreground" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreset("weekend")}
            className="text-xs rounded-3xl"
          >
            Standard Weekend
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreset("extended")}
            className="text-xs rounded-3xl"
          >
            Long Weekend
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreset("clear")}
            className="text-xs rounded-3xl"
          >
            Clear All
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {displayDays.map((day) => (
              <Button
                key={day}
                variant={activeDays.includes(day) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleDay(day)}
                className="relative"
              >
                {getDayLabel(day)}
                {activeDays.includes(day) && (
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDay(day);
                    }}
                  />
                )}
              </Button>
            ))}
          </div>

          {!showAllDays && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllDays(true)}
              className="text-xs text-gray-500 dark:text-muted-foreground"
            >
              <Plus className="h-3 w-3 mr-1" />
              Show More Days
            </Button>
          )}
        </div>

        {activeDays.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-card-border">
            <p className="text-sm text-gray-500 dark:text-muted-foreground mb-2">
              Selected Days ({activeDays.length}):
            </p>
            <div className="flex flex-wrap gap-1">
              {activeDays.map((day) => (
                <Badge key={day} variant="secondary" className="text-xs">
                  {getDayLabel(day)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>

  );
};

export default DaySelector;
