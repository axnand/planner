import { useState, useMemo } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import ActivityCard from "@/components/ActivityCard"
import { activities } from "@/data/activities"

const ActivityBrowser = ({ onAddActivity, onClose, theme, activeDays = ["saturday", "sunday"] }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedActivity, setSelectedActivity] = useState(null)

  const categories = [
    { value: "all", label: "All" },
    { value: "food", label: "Food & Dining" },
    { value: "outdoor", label: "Outdoor" },
    { value: "indoor", label: "Indoor" },
    { value: "wellness", label: "Wellness" },
    { value: "social", label: "Social" },
    { value: "creative", label: "Creative" },
    { value: "fitness", label: "Fitness" },
    { value: "entertainment", label: "Entertainment" },
  ]

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || activity.category === selectedCategory
      const matchesTheme = activity.themes.includes(theme)

      return matchesSearch && matchesCategory && matchesTheme
    })
  }, [searchQuery, selectedCategory, theme])

  const handleAddActivity = (day, timeSlot) => {
    if (selectedActivity) {
      onAddActivity(selectedActivity, day, timeSlot)
      setSelectedActivity(null)
    }
  }

  const getDayLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Browse Activities</h2>
          <p className="text-muted-foreground">
            Discover activities perfect for your {theme} weekend
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 border-card-border bg-surface">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="whitespace-nowrap"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Activities Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onSelect={() => setSelectedActivity(activity)}
            isSelected={selectedActivity?.id === activity.id}
            theme={theme}
          />
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <Card className="p-12 text-center border-card-border bg-surface">
          <div className="text-muted-foreground">
            <Filter className="mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-medium">No activities found</h3>
            <p>Try adjusting your search or filters to find more activities.</p>
          </div>
        </Card>
      )}

      {/* Add Activity Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 m-4 border-card-border bg-surface shadow-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Add "{selectedActivity.name}" to schedule
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose when you'd like to do this activity
              </p>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {activeDays.map((day) => (
                <div key={day}>
                  <h4 className="mb-2 font-medium text-card-foreground">{getDayLabel(day)}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddActivity(day, "morning")}
                    >
                      Morning
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddActivity(day, "afternoon")}
                    >
                      Afternoon
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddActivity(day, "evening")}
                    >
                      Evening
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="ghost" onClick={() => setSelectedActivity(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ActivityBrowser
