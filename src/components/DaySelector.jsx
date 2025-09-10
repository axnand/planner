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

  const displayDays = showAllDays ? allDays : allDays.slice(0, 4); // Show Friday–Monday initially

  return (
    <Card className="p-4 border-card-border bg-surface">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">
            Select Days
          </h3>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreset("weekend")}
            className="text-xs"
          >
            Standard Weekend
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreset("extended")}
            className="text-xs"
          >
            Long Weekend
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreset("clear")}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>

        {/* Day Selection */}
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
              className="text-xs text-muted-foreground"
            >
              <Plus className="h-3 w-3 mr-1" />
              Show More Days
            </Button>
          )}
        </div>

        {/* Selected Days Summary */}
        {activeDays.length > 0 && (
          <div className="pt-2 border-t border-card-border">
            <p className="text-sm text-muted-foreground mb-2">
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
