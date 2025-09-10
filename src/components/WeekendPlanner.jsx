"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import ActivityBrowser from "@/components/ActivityBrowser"
import ScheduleBuilder from "@/components/ScheduleBuilder"
import ThemeSelector from "@/components/ThemeSelector"
// ✅ placeholders for later
import DaySelector from "@/components/DaySelector"
import SavePlanDialog from "@/components/SavePlanDialog"

const WeekendPlanner = ({ onBack, editingPlan }) => {
  const [currentTheme, setCurrentTheme] = useState(editingPlan?.theme || "lazy")
  const [scheduleItems, setScheduleItems] = useState(editingPlan?.scheduleItems || [])
  const [activeDays, setActiveDays] = useState(editingPlan?.activeDays || ["saturday", "sunday"])
  const [showActivityBrowser, setShowActivityBrowser] = useState(false)

  // Load from localStorage (only if not editing)
  useEffect(() => {
    if (!editingPlan) {
      const savedPlan = localStorage.getItem("weekendly-plan")
      if (savedPlan) {
        try {
          const parsed = JSON.parse(savedPlan)
          setScheduleItems(parsed.scheduleItems || [])
          setCurrentTheme(parsed.theme || "lazy")
          setActiveDays(parsed.activeDays || ["saturday", "sunday"])
        } catch (error) {
          console.error("Failed to load saved plan:", error)
        }
      }
    }
  }, [editingPlan])

  // Save to localStorage on changes
  useEffect(() => {
    const planData = {
      scheduleItems,
      theme: currentTheme,
      activeDays,
      lastUpdated: Date.now(),
    }
    localStorage.setItem("weekendly-plan", JSON.stringify(planData))
  }, [scheduleItems, currentTheme, activeDays])

  const getDefaultTime = (slot) => {
    switch (slot) {
      case "morning": return "09:00"
      case "afternoon": return "14:00"
      case "evening": return "19:00"
      default: return "12:00"
    }
  }

  const addActivity = (activity, day, timeSlot) => {
    const newItem = {
      id: Date.now().toString(),
      activity,
      day,
      timeSlot,
      startTime: getDefaultTime(timeSlot),
      mood: "happy",
      notes: "",
    }
    setScheduleItems(prev => [...prev, newItem])
    setShowActivityBrowser(false)
  }

  const updateScheduleItem = (id, updates) => {
    setScheduleItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const removeScheduleItem = (id) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
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
          <div className="flex items-center gap-3">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            {/* ✅ Save dialog placeholder */}
            <SavePlanDialog
              scheduleItems={scheduleItems}
              theme={currentTheme}
              activeDays={activeDays}
            >
              <Button variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save Plan
              </Button>
            </SavePlanDialog>
            <Button
              onClick={() => setShowActivityBrowser(true)}
              className="gap-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* ✅ Active days selector */}
        <DaySelector
          activeDays={activeDays}
          onDaysChange={setActiveDays}
        />

        {showActivityBrowser ? (
          <ActivityBrowser
            onAddActivity={addActivity}
            onClose={() => setShowActivityBrowser(false)}
            theme={currentTheme}
            activeDays={activeDays}
          />
        ) : (
          <ScheduleBuilder
            scheduleItems={scheduleItems}
            activeDays={activeDays}
            onUpdateItem={updateScheduleItem}
            onRemoveItem={removeScheduleItem}
            onAddActivity={() => setShowActivityBrowser(true)}
            theme={currentTheme}
          />
        )}
      </main>
    </div>
  )
}

export default WeekendPlanner
