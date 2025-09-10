import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const PlanVisualisation = ({ plan, viewMode }) => {
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
    // Prepare data for charts
    const activitiesByDay = plan.activeDays.map(day => ({
      day: getDayLabel(day),
      activities: plan.scheduleItems.filter(item => item.day === day).length,
      totalTime: plan.scheduleItems
        .filter(item => item.day === day)
        .reduce((sum, item) => sum + item.activity.estimatedTime, 0)
    }));

    const activitiesByCategory = plan.scheduleItems.reduce((acc, item) => {
      const category = item.activity.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(activitiesByCategory).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      fill: getThemeColor(plan.theme)
    }));

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Activities by Day Chart */}
          <Card className="border-card-border bg-surface">
            <CardHeader>
              <CardTitle className="text-lg">Activities by Day</CardTitle>
              <CardDescription>Number of activities planned for each day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activitiesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="activities" fill={getThemeColor(plan.theme)} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activities by Category Chart */}
          <Card className="border-card-border bg-surface">
            <CardHeader>
              <CardTitle className="text-lg">Activity Categories</CardTitle>
              <CardDescription>Distribution of activities by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-card-border bg-surface p-4">
            <div className="text-2xl font-bold text-card-foreground">{plan.scheduleItems.length}</div>
            <div className="text-sm text-muted-foreground">Total Activities</div>
          </Card>
          <Card className="border-card-border bg-surface p-4">
            <div className="text-2xl font-bold text-card-foreground">{plan.activeDays.length}</div>
            <div className="text-sm text-muted-foreground">Days Planned</div>
          </Card>
          <Card className="border-card-border bg-surface p-4">
            <div className="text-2xl font-bold text-card-foreground">
              {Math.round(plan.scheduleItems.reduce((sum, item) => sum + item.activity.estimatedTime, 0) / 60)}h
            </div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </Card>
          <Card className="border-card-border bg-surface p-4">
            <div className="text-2xl font-bold text-card-foreground">{Object.keys(activitiesByCategory).length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
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
        <Card key={day} className="border-card-border bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl capitalize text-card-foreground">{day}</CardTitle>
            <div
              className={cn(
                "h-1 w-16 rounded-full",
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
                    <h4 className="text-sm font-medium text-muted-foreground capitalize">
                      {timeSlot}
                    </h4>

                    {activities.length === 0 ? (
                      <div className="text-sm text-muted-foreground italic">
                        No activities planned
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {activities.map((item) => (
                          <Card key={item.id} className="p-4 border-card-border bg-muted/20">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{item.activity.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium text-card-foreground">
                                    {item.activity.name}
                                  </h5>
                                  <span className="text-lg">{getMoodEmoji(item.mood)}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.activity.category}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {item.startTime} ({item.activity.estimatedTime}m)
                                    </span>
                                  </div>
                                  {item.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{item.location}</span>
                                    </div>
                                  )}
                                </div>
                                {item.notes && (
                                  <p className="text-sm text-muted-foreground mt-2">{item.notes}</p>
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
