import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const PlanVisualisation = ({ plan, viewMode }) => {
  const { theme } = useTheme();
  
  const getThemeColor = (theme) => {
    switch (theme) {
      case "lazy": return "hsl(var(--theme-lazy))";
      case "adventurous": return "hsl(var(--theme-adventurous))";
      case "family": return "hsl(var(--theme-family))";
      default: return "hsl(var(--primary))";
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "happy": return "😊";
      case "relaxed": return "😌";
      case "energized": return "⚡";
      default: return "😊";
    }
  };

  const getDayLabel = (day) => day.charAt(0).toUpperCase() + day.slice(1);

  if (viewMode === "chart") {
  const activitiesByDay = plan.activeDays.map(day => ({
    day: getDayLabel(day),
    activities: plan.scheduleItems.filter(item => item.day === day).length,
    totalTime: plan.scheduleItems
      .filter(item => item.day === day)
      .reduce((sum, item) => sum + item.activity.estimatedTime, 0),
  }));

  const activitiesByCategory = plan.scheduleItems.reduce((acc, item) => {
    const category = item.activity.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(activitiesByCategory).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count,
  }));

  // High contrast palettes for light/dark mode
  const COLORS_LIGHT = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"];
  const COLORS_DARK = ["#60a5fa", "#4ade80", "#facc15", "#f87171", "#c084fc"];

  const COLORS = theme === "dark" ? COLORS_DARK : COLORS_LIGHT;

  return (
    <div className="space-y-6 px- sm:px-6 lg:px-8 py-6">
  {/* Charts Section */}
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    {/* Activities by Day Chart */}
    <Card className="border-card-border bg-surface dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg dark:text-white">Activities by Day</CardTitle>
        <CardDescription className="text-xs sm:text-sm dark:text-gray-300">
          Number of activities planned for each day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={activitiesByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#444" : "#ccc"} />
            <XAxis dataKey="day" stroke={theme === "dark" ? "#fff" : "#000"} />
            <YAxis stroke={theme === "dark" ? "#fff" : "#000"} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            />
            <Bar dataKey="activities" fill={theme === "dark" ? "#60a5fa" : "#2563eb"} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* Activities by Category Chart */}
    <Card className="border-card-border bg-surface dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg dark:text-white">Activity Categories</CardTitle>
        <CardDescription className="text-xs sm:text-sm dark:text-gray-300">
          Distribution of activities by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="count"
              label={({ category, count }) => `${category}: ${count}`}
              labelStyle={{ fill: theme === "dark" ? "#fff" : "#000" }}
            >
              {categoryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>

  {/* Summary Stats Section */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
    <Card className="border-card-border bg-surface dark:bg-neutral-900 p-3 text-center">
      <div className="text-xl sm:text-2xl font-bold text-card-foreground dark:text-white">
        {plan.scheduleItems.length}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
        Total Activities
      </div>
    </Card>
    <Card className="border-card-border bg-surface dark:bg-neutral-900 p-4 text-center">
      <div className="text-xl sm:text-2xl font-bold text-card-foreground dark:text-white">
        {plan.activeDays.length}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
        Days Planned
      </div>
    </Card>
    <Card className="border-card-border bg-surface dark:bg-neutral-900 p-4 text-center">
      <div className="text-xl sm:text-2xl font-bold text-card-foreground dark:text-white">
        {Math.round(
          plan.scheduleItems.reduce((sum, item) => sum + item.activity.estimatedTime, 0) / 60
        )}
        h
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
        Total Time
      </div>
    </Card>
    <Card className="border-card-border bg-surface dark:bg-neutral-900 p-4 text-center">
      <div className="text-xl sm:text-2xl font-bold text-card-foreground dark:text-white">
        {Object.keys(activitiesByCategory).length}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
        Categories
      </div>
    </Card>
  </div>
</div>


  );
}


  // Timeline View
  const timeSlots = ["morning", "afternoon", "evening"];
  const sortedDays = plan.activeDays.sort((a, b) => {
    const dayOrder = ["friday", "saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"];
    return dayOrder.indexOf(a) - dayOrder.indexOf(b);
  });

  return (
    <div className="space-y-6">
      {sortedDays.map((day) => (
        <Card key={day} className="border-card-border bg-surface dark:bg-neutral-900">
  <CardHeader className="pb-4">
    <CardTitle className="text-lg sm:text-xl capitalize text-card-foreground dark:text-white">
      {day}
    </CardTitle>
    <div
      className={cn(
        "h-1 w-12 sm:w-16 rounded-full",
        plan.theme === "lazy"
          ? "bg-gradient-lazy"
          : plan.theme === "adventurous"
          ? "bg-gradient-adventurous"
          : plan.theme === "family"
          ? "bg-gradient-family"
          : "bg-gradient-primary"
      )}
    />
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      {timeSlots.map((timeSlot) => {
        const activities = plan.scheduleItems.filter(
          (item) => item.day === day && item.timeSlot === timeSlot
        );

        return (
          <div key={timeSlot} className="space-y-3">
            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground capitalize">
              {timeSlot}
            </h4>

            {activities.length === 0 ? (
              <div className="text-xs sm:text-sm text-muted-foreground italic">
                No activities planned
              </div>
            ) : (
              <div className="space-y-2">
                {activities.map((item) => (
                  <Card key={item.id} className="p-3 sm:p-4 border-card-border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="text-xl sm:text-2xl">{item.activity.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm sm:text-base font-medium text-card-foreground dark:text-white">
                            {item.activity.name}
                          </h5>
                          <span className="text-base">{getMoodEmoji(item.mood)}</span>
                          <Badge variant="outline" className="text-xs sm:text-sm">
                            {item.activity.category}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>
                              {item.startTime} ({item.activity.estimatedTime}m)
                            </span>
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </CardContent>
</Card>

      ))}
    </div>
  );
};

export default PlanVisualisation;
