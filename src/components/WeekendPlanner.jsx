"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Plus, Save, Wand2, MapPin, Image as ImageIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ActivityBrowser from "@/components/ActivityBrowser";
import ScheduleBuilder from "@/components/ScheduleBuilder";
import ThemeSelector from "@/components/ThemeSelector";
import DaySelector from "@/components/DaySelector";
import SavePlanDialog from "@/components/SavePlanDialog";
import SmartIntegrations from "@/components/SmartIntegrations";
import PosterGenerator from "@/components/PosterGenerator";
import HolidayBanner from "@/components/HolidayBanner";
import { generateRandomPlan } from "@/utils/planGenerator";

const WeekendPlanner = ({ onBack, editingPlan }) => {
  const [currentTheme, setCurrentTheme] = useState(editingPlan?.theme || "lazy");
  const [scheduleItems, setScheduleItems] = useState(editingPlan?.scheduleItems || []);
  const [activeDays, setActiveDays] = useState(editingPlan?.activeDays || ["saturday", "sunday"]);
  const [showActivityBrowser, setShowActivityBrowser] = useState(false);
  const [showSmartIntegrations, setShowSmartIntegrations] = useState(false);
  const [showPosterGenerator, setShowPosterGenerator] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const router = useRouter();

  // Load from localStorage (only if not editing)
  useEffect(() => {
    if (!editingPlan) {
      const savedPlan = localStorage.getItem("weekendly-plan");
      if (savedPlan) {
        try {
          const parsed = JSON.parse(savedPlan);
          setScheduleItems(parsed.scheduleItems || []);
          setCurrentTheme(parsed.theme || "lazy");
          setActiveDays(parsed.activeDays || ["saturday", "sunday"]);
        } catch (error) {
          console.error("Failed to load saved plan:", error);
        }
      }
    }
  }, [editingPlan]);

  // Save to localStorage on changes
  useEffect(() => {
    const planData = {
      scheduleItems,
      theme: currentTheme,
      activeDays,
      lastUpdated: Date.now(),
    };
    localStorage.setItem("weekendly-plan", JSON.stringify(planData));
  }, [scheduleItems, currentTheme, activeDays]);

  // Geolocation for integrations
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
        err => console.log("Location denied:", err)
      );
    }
  }, []);

  const generateUniqueId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getDefaultTime = (slot) => {
    switch (slot) {
      case "morning": return "09:00";
      case "afternoon": return "14:00";
      case "evening": return "19:00";
      default: return "12:00";
    }
  };

  const addActivity = (activity, day, timeSlot) => {
    const newItem = {
      id: generateUniqueId(),
      activity,
      day,
      timeSlot,
      startTime: getDefaultTime(timeSlot),
      mood: "happy",
      notes: "",
    };
    setScheduleItems(prev => [...prev, newItem]);
    setShowActivityBrowser(false);
    setSelectedSlot(null);
  };

  const addActivityToSlot = (day, timeSlot) => {
    setSelectedSlot({ day, timeSlot });
    setShowActivityBrowser(true);
  };

  const updateScheduleItem = (id, updates) => {
    setScheduleItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeScheduleItem = (id) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
  };

  const autoGeneratePlan = () => {
    const generatedItems = generateRandomPlan({
      theme: currentTheme,
      activeDays,
      preferences: { maxActivitiesPerDay: 3, avoidCategories: [] },
    });
    setScheduleItems(generatedItems);
  };

  const handlePlanLongWeekend = () => {
    const longWeekendDays = ["friday", "saturday", "sunday"];
    setActiveDays(longWeekendDays);

    const generatedItems = generateRandomPlan({
      theme: currentTheme,
      activeDays: longWeekendDays,
      preferences: { maxActivitiesPerDay: 2, avoidCategories: [] },
    });
    setScheduleItems(generatedItems);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Holiday Banner */}
      <div className="px-6 pt-6">
        <HolidayBanner onPlanLongWeekend={handlePlanLongWeekend} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {editingPlan ? `Editing: ${editingPlan.name}` : "Weekend Planner"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {editingPlan ? "Make changes to your saved plan" : "Design your perfect weekend"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />

            <Button variant="outline" onClick={autoGeneratePlan} className="gap-2">
              <Wand2 className="h-4 w-4" />
              Auto Generate
            </Button>

            <Button variant="outline" onClick={() => setShowSmartIntegrations(true)} className="gap-2">
              <MapPin className="h-4 w-4" />
              Find Spots
            </Button>

            <Button variant="outline" onClick={() => setShowPosterGenerator(true)} className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Export Poster
            </Button>

            <SavePlanDialog scheduleItems={scheduleItems} theme={currentTheme} activeDays={activeDays}>
              <Button variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save Plan
              </Button>
            </SavePlanDialog>

            <Button onClick={() => setShowActivityBrowser(true)} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        <DaySelector activeDays={activeDays} onDaysChange={setActiveDays} />

        {showActivityBrowser ? (
          <ActivityBrowser
            onAddActivity={(activity) =>
              selectedSlot
                ? addActivity(activity, selectedSlot.day, selectedSlot.timeSlot)
                : addActivity(activity, activeDays[0], "morning")
            }
            onClose={() => {
              setShowActivityBrowser(false);
              setSelectedSlot(null);
            }}
            theme={currentTheme}
            activeDays={activeDays}
          />
        ) : showSmartIntegrations ? (
          <SmartIntegrations
            onAddActivity={(activity) =>
              selectedSlot
                ? addActivity(activity, selectedSlot.day, selectedSlot.timeSlot)
                : addActivity(activity, activeDays[0], "morning")
            }
            onClose={() => {
              setShowSmartIntegrations(false);
              setSelectedSlot(null);
            }}
            theme={currentTheme}
            currentLocation={currentLocation}
          />
        ) : showPosterGenerator ? (
          <PosterGenerator
            scheduleItems={scheduleItems}
            theme={currentTheme}
            planName={editingPlan?.name}
          />
        ) : (
          <ScheduleBuilder
            scheduleItems={scheduleItems}
            activeDays={activeDays}
            onUpdateItem={updateScheduleItem}
            onRemoveItem={removeScheduleItem}
            onAddActivity={() => setShowActivityBrowser(true)}
            onAddActivityToSlot={addActivityToSlot}
            theme={currentTheme}
          />
        )}
      </main>
    </div>
  );
};

export default WeekendPlanner;
