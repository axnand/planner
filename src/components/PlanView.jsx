import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PlanView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    try {
      const savedPlans = localStorage.getItem("weekendly-saved-plans");
      const plans = savedPlans ? JSON.parse(savedPlans) : [];
      const foundPlan = plans.find((p) => p.id === id);

      if (foundPlan) {
        setPlan(foundPlan);
      } else {
        toast.error("Plan not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to load plan:", error);
      toast.error("Failed to load plan");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const getDayLabel = (day) => day.charAt(0).toUpperCase() + day.slice(1);

  const getTimeSlotLabel = (timeSlot) => {
    switch (timeSlot) {
      case "morning":
        return "Morning";
      case "afternoon":
        return "Afternoon";
      case "evening":
        return "Evening";
      default:
        return timeSlot;
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "relaxed":
        return "😌";
      case "energized":
        return "⚡";
      default:
        return "😊";
    }
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case "lazy":
        return "bg-gradient-lazy";
      case "adventurous":
        return "bg-gradient-adventurous";
      case "family":
        return "bg-gradient-family";
      default:
        return "bg-gradient-primary";
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = () => {
    navigate("/", { state: { editPlan: plan } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The plan you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const organizedItems = plan.activeDays.reduce((acc, day) => {
    acc[day] = {
      morning: plan.scheduleItems.filter(
        (item) => item.day === day && item.timeSlot === "morning"
      ),
      afternoon: plan.scheduleItems.filter(
        (item) => item.day === day && item.timeSlot === "afternoon"
      ),
      evening: plan.scheduleItems.filter(
        (item) => item.day === day && item.timeSlot === "evening"
      ),
    };
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-card-border bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {plan.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Created on {formatDate(plan.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="capitalize">
              {plan.theme}
            </Badge>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Plan
            </Button>
          </div>
        </div>
      </header>

      {/* Plan Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {plan.description && (
            <Card className="p-6 border-card-border bg-surface">
              <p className="text-card-foreground">{plan.description}</p>
            </Card>
          )}

          {/* Schedule */}
          <div
            className={`grid gap-6 ${
              plan.activeDays.length === 1
                ? "lg:grid-cols-1"
                : plan.activeDays.length === 2
                ? "lg:grid-cols-2"
                : "lg:grid-cols-3"
            }`}
          >
            {plan.activeDays.map((day) => (
              <Card key={day} className="p-6 border-card-border bg-surface">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {getDayLabel(day)}
                  </h3>
                  <div
                    className={`h-1 w-16 rounded-full mt-2 ${getThemeColor(
                      plan.theme
                    )}`}
                  />
                </div>

                <div className="space-y-4">
                  {["morning", "afternoon", "evening"].map((timeSlot) => {
                    const items = organizedItems[day]?.[timeSlot] || [];

                    return (
                      <div key={timeSlot} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {getTimeSlotLabel(timeSlot)}
                          </h4>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {items.length === 0 ? (
                          <div className="text-center p-4 text-sm text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                            No activities planned
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {items.map((item) => (
                              <Card
                                key={item.id}
                                className="p-3 border-card-border bg-surface shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-lg">
                                    {item.activity.icon}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-medium text-card-foreground truncate">
                                        {item.activity.name}
                                      </h5>
                                      <span className="text-sm">
                                        {getMoodEmoji(item.mood)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{item.startTime}</span>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {item.activity.category}
                                      </Badge>
                                      <span>
                                        {item.activity.estimatedTime}min
                                      </span>
                                    </div>
                                    {item.location && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        📍 {item.location}
                                      </p>
                                    )}
                                    {item.notes && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        💭 {item.notes}
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
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanView;
