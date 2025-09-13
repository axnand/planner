"use client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SavePlanDialog = ({
  scheduleItems = [],
  theme = "lazy",
  activeDays = [],
  editingPlan = null,
  isEditMode = false,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadSavedPlansSafe = () => {
    try {
      return JSON.parse(localStorage.getItem("weekendly-saved-plans") || "[]");
    } catch (err) {
      console.error("Invalid saved plans JSON, resetting to []", err);
      return [];
    }
  };
  useEffect(() => {
    if (open && isEditMode && editingPlan) {
      setPlanName(editingPlan.name || "");
      setDescription(editingPlan.description || "");
    }
  }, [open, isEditMode, editingPlan]);
  const totalMinutes = (scheduleItems || []).reduce(
    (sum, item) => sum + (item?.activity?.estimatedTime || 0),
    0
  );
  const totalTime = Math.round(totalMinutes / 60);
  const generateSuggestedName = () => {
    const themeNames = {
      lazy: "Relaxing",
      adventurous: "Adventure",
      family: "Family",
      default: "Weekend",
    };

    const today = new Date();
    const month = today.toLocaleDateString("en-US", { month: "short" });
    const day = today.getDate();

    const baseName = `${themeNames[theme] || themeNames.default} Weekend - ${month} ${day}`;
    const savedPlans = loadSavedPlansSafe();

    let uniqueName = baseName;
    let counter = 1;
    while (savedPlans.some((p) => p.name.toLowerCase() === uniqueName.toLowerCase())) {
      uniqueName = `${baseName} (${counter})`;
      counter++;
    }

    return uniqueName;
  };

  const handleGenerateName = () => {
    setPlanName(generateSuggestedName());
  };

  const handleSave = () => {
    const trimmedName = planName.trim();
    if (!trimmedName) {
      toast.error("Please enter a plan name");
      return;
    }

    if (!scheduleItems || scheduleItems.length === 0) {
      toast.error("Cannot save an empty plan");
      return;
    }

    const savedPlans = loadSavedPlansSafe();
    const duplicate = savedPlans.some(
      (p) =>
        p.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!isEditMode || (isEditMode && p.id !== editingPlan?.id))
    );

    if (duplicate) {
      toast.error(`A plan named "${trimmedName}" already exists. Try another name.`);
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && editingPlan) {
        const updatedPlanData = {
          ...editingPlan,
          name: trimmedName,
          theme,
          scheduleItems,
          activeDays,
          updatedAt: Date.now(),
          description: description.trim() || undefined,
        };

        const updatedPlans = savedPlans.map((p) => (p.id === editingPlan.id ? updatedPlanData : p));
        localStorage.setItem("weekendly-saved-plans", JSON.stringify(updatedPlans));
        localStorage.setItem("weekendly-editing-plan", JSON.stringify(updatedPlanData));
        toast.success(`Plan "${trimmedName}" updated successfully!`);
      } else {
        const newPlan = {
          id: Date.now().toString(),
          name: trimmedName,
          theme,
          scheduleItems,
          activeDays,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          description: description.trim() || undefined,
        };

        savedPlans.unshift(newPlan);
        localStorage.setItem("weekendly-saved-plans", JSON.stringify(savedPlans));
        toast.success(
          <div>
            Plan "{trimmedName}" saved successfully!{" "}
            <button
              onClick={() => router.push("/saved-plans")}
              className="underline text-primary hover:text-primary/80"
            >
              View
            </button>
          </div>)
      }

      setPlanName("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to save plan:", error);
      toast.error(
        isEditMode ? "Failed to update plan. Please try again." : "Failed to save plan. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

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

        <div className="space-y-4 ">
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <div className="flex gap-2">
              <Input
                id="planName"
                placeholder="My Amazing Weekend"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="flex-1 text-[13px] sm:text-base"
              />
              <Button variant="outline" size="sm" onClick={handleGenerateName} className="shrink-0">
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
              className={"w-full text-[13px] sm:text-base"}
            />
          </div>

          <div className="rounded-lg bg-muted/20 p-3 space-y-2">
            <h4 className="text-sm font-medium text-card-foreground">Plan Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Theme:</span> {theme}
              </div>
              <div>
                <span className="font-medium">Activities:</span> {scheduleItems?.length || 0}
              </div>
              <div>
                <span className="font-medium">Days:</span> {activeDays?.length || 0}
              </div>
              <div>
                <span className="font-medium">Total Time:</span> {totalTime}h
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : isEditMode ? "Update Plan" : "Save Plan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavePlanDialog;
