import { useState, useEffect } from "react";
import { Calendar, Clock, Edit, Trash2, Eye, BarChart3, List, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PlanVisualization from "@/components/PlanVisualisation";
import { cn } from "@/lib/utils";

const SavedPlansManager = ({ onBack, onEditPlan, onCreateNew }) => {
  const [savedPlans, setSavedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewMode, setViewMode] = useState("timeline");
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = () => {
    const saved = localStorage.getItem("weekendly-saved-plans");
    if (saved) {
      try {
        setSavedPlans(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load saved plans:", error);
      }
    }
  };

  const deletePlan = (planId) => {
    const updatedPlans = savedPlans.filter(plan => plan.id !== planId);
    setSavedPlans(updatedPlans);
    localStorage.setItem("weekendly-saved-plans", JSON.stringify(updatedPlans));
    setShowDeleteDialog(null);
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case "lazy": return "bg-gradient-lazy";
      case "adventurous": return "bg-gradient-adventurous";
      case "family": return "bg-gradient-family";
      default: return "bg-gradient-primary";
    }
  };

  const getThemeVariant = (theme) => {
    switch (theme) {
      case "lazy": return "lazy";
      case "adventurous": return "adventurous";
      case "family": return "family";
      default: return "default";
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getDayLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-card-border bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Saved Plans</h1>
              <p className="text-sm text-muted-foreground">Manage your weekend plans</p>
            </div>
          </div>
          
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedPlans.map((plan) => (
            <Card key={plan.id} className="border-card-border bg-surface hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-card-foreground">{plan.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {plan.description || "No description"}
                    </CardDescription>
                  </div>
                  <Badge variant={getThemeVariant(plan.theme)} className="ml-2">
                    {plan.theme}
                  </Badge>
                </div>
                <div className={cn("h-1 w-full rounded-full", getThemeColor(plan.theme))} />
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(plan.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{plan.scheduleItems.length} activities</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {plan.activeDays.map((day) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {getDayLabel(day)}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{plan.name}</DialogTitle>
                        <DialogDescription>
                          Created on {formatDate(plan.createdAt)}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Button
                            variant={viewMode === "timeline" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("timeline")}
                          >
                            <List className="h-4 w-4 mr-1" />
                            Timeline
                          </Button>
                          <Button
                            variant={viewMode === "chart" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("chart")}
                          >
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Chart
                          </Button>
                        </div>
                        
                        <PlanVisualization 
                          plan={plan} 
                          viewMode={viewMode}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPlan(plan)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  <Dialog open={showDeleteDialog === plan.id} onOpenChange={(open) => setShowDeleteDialog(open ? plan.id : null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Plan</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => deletePlan(plan.id)}>
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {savedPlans.length === 0 && (
          <Card className="p-12 text-center border-card-border bg-surface">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium text-card-foreground">
              No saved plans yet
            </h3>
            <p className="mb-6 text-muted-foreground">
              Create your first weekend plan to get started
            </p>
            <Button onClick={onCreateNew} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SavedPlansManager;
