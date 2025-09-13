import { useState, useMemo } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import ActivityCard from "@/components/ActivityCard"
import { activities } from "@/data/activities"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const ActivityBrowser = ({ onAddActivity, onClose, theme, activeDays = ["saturday", "sunday"], selectedSlot }) => {
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

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    category: "food",
    estimatedTime: "",
  });


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

  const handleActivitySelect = (activity) => {
    if (selectedSlot) {
      onAddActivity(activity, selectedSlot.day, selectedSlot.timeSlot)
      return
    }
    setSelectedActivity(activity)
  }

  const getDayLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div className="space-y-6">
{showCreateForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <Card className="w-full max-w-md p-6 m-4 border-card-border bg-surface shadow-lg">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Create New Activity</h3>
      
      <div className="space-y-4">
        <Input
          placeholder="Activity Name"
          value={newActivity.name}
          onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={newActivity.description}
          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {categories.find(cat => cat.value === newActivity.category)?.label || "Select Category"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-w-[200px]" align="start">
            {categories.filter(cat => cat.value !== "all").map((cat) => (
              <DropdownMenuItem
                key={cat.value}
                onSelect={() => setNewActivity({ ...newActivity, category: cat.value })}
                className={newActivity.category === cat.value ? "font-medium" : ""}
              >
                {cat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          type="number"
          placeholder="Estimated Time (minutes)"
          value={newActivity.estimatedTime}
          onChange={(e) => setNewActivity({ ...newActivity, estimatedTime: e.target.value })}
        />
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!newActivity.name.trim()) return;

            const id = `new-${Date.now()}`;

            const activity = {
              id: id,
              name: newActivity.name,
              category: newActivity.category,
              description: newActivity.description,
              icon: "🆕",
              estimatedTime: parseInt(newActivity.estimatedTime) || 60,
              mood: "energized",
              themes: [theme],
              isIndoor: false,
            };

            activities.push(activity);

            setShowCreateForm(false);
            setNewActivity({
              name: "",
              description: "",
              category: "food",
              estimatedTime: "",
            });
          }}
        >
          Create
        </Button>
      </div>
    </Card>
  </div>
)}


      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Browse Activities</h2>
          <p className="text-muted-foreground">
            {selectedSlot 
              ? `Adding activity to ${getDayLabel(selectedSlot.day)} ${selectedSlot.timeSlot}`
              : `Discover activities perfect for your ${theme} weekend`
            }
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      
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

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto justify-between">
          {categories.find(cat => cat.value === selectedCategory)?.label || "Select Category"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.value}
            onSelect={() => setSelectedCategory(category.value)}
            className={selectedCategory === category.value ? "font-medium" : ""}
          >
            {category.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowCreateForm(true)}>
      Create New Activity
    </Button>

  </div>
</Card>

     
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onSelect={() => handleActivitySelect(activity)}
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

      
      {selectedActivity && !selectedSlot && (
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