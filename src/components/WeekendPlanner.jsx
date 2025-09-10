"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ActivityBrowser from "@/components/ActivityBrowser"
import ScheduleBuilder from "@/components/ScheduleBuilder"
import ThemeSelector from "@/components/ThemeSelector"

const WeekendPlanner = ({ onBack }) => {
  const [currentTheme, setCurrentTheme] = useState("lazy")
  const [scheduleItems, setScheduleItems] = useState([])
  const [showActivityBrowser, setShowActivityBrowser] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem("weekendly-plan")
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan)
        setScheduleItems(parsed.scheduleItems || [])
        setCurrentTheme(parsed.theme || "lazy")
      } catch (error) {
        console.error("Failed to load saved plan:", error)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    const planData = {
      scheduleItems,
      theme: currentTheme,
      lastUpdated: Date.now(),
    }
    localStorage.setItem("weekendly-plan", JSON.stringify(planData))
  }, [scheduleItems, currentTheme])

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
              <h1 className="text-xl font-semibold text-foreground">Weekend Planner</h1>
              <p className="text-sm text-muted-foreground">Design your perfect weekend</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
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
      <main className="container mx-auto px-6 py-8">
        {showActivityBrowser ? (
          <ActivityBrowser
            onAddActivity={addActivity}
            onClose={() => setShowActivityBrowser(false)}
            theme={currentTheme}
          />
        ) : (
          <ScheduleBuilder
            scheduleItems={scheduleItems}
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
