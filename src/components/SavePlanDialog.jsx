'use client'
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SavePlanDialog = ({ scheduleItems, theme, activeDays,editingPlan = null,
  isEditMode = false, children }) => {
  const [open, setOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
  // Validation (applies to both create and edit modes)
  if (!planName.trim()) {
    toast.error("Please enter a plan name");
    return;
  }

  if (scheduleItems.length === 0) {
    toast.error("Cannot save an empty plan");
    return;
  }

  setIsLoading(true);

  try {
    if (isEditMode && editingPlan) {
      // UPDATE EXISTING PLAN
      const updatedPlanData = {
        id: editingPlan.id, // Keep the original ID
        name: planName.trim(),
        theme,
        scheduleItems,
        activeDays,
        createdAt: editingPlan.createdAt, // Keep original creation date
        updatedAt: Date.now(),
        description: description.trim() || undefined,
      };

      const savedPlans = JSON.parse(localStorage.getItem("weekendly-saved-plans") || "[]");
      const updatedPlans = savedPlans.map(plan => 
        plan.id === editingPlan.id ? updatedPlanData : plan
      );
      
      localStorage.setItem("weekendly-saved-plans", JSON.stringify(updatedPlans));
      
      // Update the editing plan data in temporary storage
      localStorage.setItem("weekendly-editing-plan", JSON.stringify(updatedPlanData));
      
      toast.success(`Plan "${planName}" updated successfully!`);
    } else {
      // CREATE NEW PLAN
      const newPlan = {
        id: Date.now().toString(),
        name: planName.trim(),
        theme,
        scheduleItems,
        activeDays,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: description.trim() || undefined,
      };

      const existing = localStorage.getItem("weekendly-saved-plans");
      const savedPlans = existing ? JSON.parse(existing) : [];
      savedPlans.unshift(newPlan);

      localStorage.setItem("weekendly-saved-plans", JSON.stringify(savedPlans));
      toast.success(`Plan "${planName}" saved successfully!`);
    }

    // Reset form state
    setPlanName("");
    setDescription("");
    setOpen(false);

  } catch (error) {
    console.error("Failed to save plan:", error);
    toast.error(isEditMode ? "Failed to update plan. Please try again." : "Failed to save plan. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const generateSuggestedName = () => {
    const themeNames = {
      lazy: "Relaxing",
      adventurous: "Adventure",
      family: "Family"
    };

    const today = new Date();
    const month = today.toLocaleDateString("en-US", { month: "short" });
    const day = today.getDate();

    return `${themeNames[theme]} Weekend - ${month} ${day}`;
  };

  const handleGenerateName = () => {
    setPlanName(generateSuggestedName());
  };

  const totalTime = Math.round(
    scheduleItems.reduce((sum, item) => sum + item.activity.estimatedTime, 0) / 60
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Weekend Plan
          </DialogTitle>
          <DialogDescription>
            Save your current plan to access it later and share with others.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <div className="flex gap-2">
              <Input
                id="planName"
                placeholder="My Amazing Weekend"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateName}
                className="shrink-0"
              >
                Generate
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="A fun weekend with outdoor activities and good food..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-muted/20 p-3 space-y-2">
            <h4 className="text-sm font-medium text-card-foreground">Plan Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Theme:</span> {theme}
              </div>
              <div>
                <span className="font-medium">Activities:</span> {scheduleItems.length}
              </div>
              <div>
                <span className="font-medium">Days:</span> {activeDays.length}
              </div>
              <div>
                <span className="font-medium">Total Time:</span> {totalTime}h
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Plan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavePlanDialog;
