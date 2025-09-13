"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Clock, Edit, Trash2, Eye, BarChart3, List, Plus, ArrowLeft, Share, Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import PlanVisualisation from "@/components/PlanVisualisation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import jsPDF from "jspdf";
import PosterGenerator from "@/components/PosterGenerator";
import ThemeSwitcher from "./ThemeSwitcher";

const SavedPlansManager = ({ onBack, onEditPlan, onCreateNew }) => {
  const [savedPlans, setSavedPlans] = useState([]);
  const [viewMode, setViewMode] = useState("timeline");
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);
  const [showExportDialog, setShowExportDialog] = useState(null); 
  const [showPosterGenerator, setShowPosterGenerator] = useState(null);

  const themeGradients = {
  lazy: "linear-gradient(135deg, #667eea, #764ba2)",
  adventurous: "linear-gradient(135deg, #f093fb, #f5576c)",
  family: "linear-gradient(135deg, #4facfe, #00f2fe)",
  default: "linear-gradient(135deg, #667eea, #764ba2)",
};

const themeBadgeVariants = {
  lazy: "lazy",
  adventurous: "adventurous",
  family: "family",
  default: "default",
};



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

  const copyPlanLink = (planId) => {
    const url = `${window.location.origin}/plan/${planId}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Plan link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const exportPlanAsPDF = (plan) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20).setFont("helvetica", "bold");
      pdf.text(plan.name, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 20;

      // Description
      if (plan.description) {
        pdf.setFontSize(12).setFont("helvetica", "normal");
        const splitDesc = pdf.splitTextToSize(plan.description, pageWidth - 40);
        pdf.text(splitDesc, 20, yPosition);
        yPosition += splitDesc.length * 6 + 10;
      }

      // Theme + Created At
      pdf.setFontSize(10);
      pdf.text(`Theme: ${plan.theme} | Created: ${formatDate(plan.createdAt)}`, 20, yPosition);
      yPosition += 15;

      // Schedule grouped by day & slot
      plan.activeDays.forEach(day => {
        const dayItems = plan.scheduleItems.filter(item => item.day === day);
        if (dayItems.length > 0) {
          pdf.setFontSize(14).setFont("helvetica", "bold");
          pdf.text(getDayLabel(day), 20, yPosition);
          yPosition += 10;

          ["morning", "afternoon", "evening"].forEach(slot => {
            const slotItems = dayItems.filter(i => i.timeSlot === slot);
            if (slotItems.length > 0) {
              pdf.setFontSize(12).setFont("helvetica", "bold");
              pdf.text(`${slot[0].toUpperCase() + slot.slice(1)}:`, 30, yPosition);
              yPosition += 8;

              slotItems.forEach(i => {
                pdf.setFontSize(10).setFont("helvetica", "normal");
                pdf.text(`${i.startTime} - ${i.activity.name} (${i.activity.estimatedTime}min)`, 40, yPosition);
                yPosition += 6;

                if (i.location) {
                  pdf.text(`📍 ${i.location}`, 45, yPosition);
                  yPosition += 6;
                }
                if (i.notes) {
                  pdf.text(`💭 ${i.notes}`, 45, yPosition);
                  yPosition += 6;
                }
              });
              yPosition += 5;
            }
          });
          yPosition += 10;
        }
      });

      pdf.save(`${plan.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-card-border bg-surface/80 backdrop-blur-sm">
  <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
    {/* Left side */}
    <div className="flex items-center gap-2 md:gap-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-0">
        <h1 className="text-base md:text-xl font-semibold text-foreground truncate">
          Saved Plans
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground truncate">
          Manage your weekend plans
        </p>
      </div>
    </div>

    {/* Right side */}
    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
      {/* On mobile, show only icon; on md+ show text */}
      <Button onClick={onCreateNew} className="gap-2">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">New Plan</span>
      </Button>
      <ThemeSwitcher />
    </div>
  </div>
</header>


      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedPlans.map(plan => (
            <Card key={plan.id} className="border-card-border dark:bg-[#171717] hover:shadow-lg transition-shadow">
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
                <div
                  className="h-1 w-1/3 rounded-full"
                  style={{ background: themeGradients[plan.theme] || themeGradients.default }}
                />

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
                  {plan.activeDays.map(day => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {getDayLabel(day)}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {/* View Plan */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                      <DialogPortal>
                       <DialogOverlay className="bg-black/10 backdrop-blur-xl fixed inset-0" />
                    <DialogContent className="!sm:w-[60vw] my-5 sm:my-0 !max-w-[91vw] h-[90vh] overflow-y-auto dark:bg-[#101010]" overlayClassName="bg-background/60 backdrop-blur-md">

                      <DialogHeader>
                        <DialogTitle>{plan.name}</DialogTitle>
                        <DialogDescription>Created on {formatDate(plan.createdAt)}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Button variant={viewMode === "timeline" ? "default" : "outline"} size="sm" onClick={() => setViewMode("timeline")}>
                            <List className="h-4 w-4 mr-1" /> Timeline
                          </Button>
                          <Button variant={viewMode === "chart" ? "default" : "outline"} size="sm" onClick={() => setViewMode("chart")}>
                            <BarChart3 className="h-4 w-4 mr-1" /> Chart
                          </Button>
                        </div>
                        <PlanVisualisation plan={plan} viewMode={viewMode} />
                      </div>
                    </DialogContent>
                    </DialogPortal>
                  </Dialog>

                  {/* Share */}
                  <Button variant="outline" size="sm" onClick={() => copyPlanLink(plan.id)} title="Share plan">
                    <Share className="h-3 w-3" />
                  </Button>

                  {/* Export PDF */}
                  {/* Export Options */}
<Dialog open={showExportDialog === plan.id} onOpenChange={open => setShowExportDialog(open ? plan.id : null)}>
  <DialogTrigger asChild>
    <Button variant="outline" size="sm" title="Export plan">
      <Download className="h-3 w-3" />
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Export {plan.name}</DialogTitle>
      <DialogDescription>Choose how you want to export this plan</DialogDescription>
    </DialogHeader>
    <div className="flex flex-col gap-3 mt-4">
      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={() => {
          exportPlanAsPDF(plan);
          setShowExportDialog(null);
        }}
      >
        <Download className="h-4 w-4" /> Export as PDF
      </Button>
      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={() => {
          setShowPosterGenerator(plan); // 👈 new poster generator handler
          setShowExportDialog(null);
        }}
      >
        <Download className="h-4 w-4" /> Export as Poster
      </Button>
    </div>
  </DialogContent>
</Dialog>


                  {/* Edit */}
                  <Button variant="outline" size="sm" onClick={() => onEditPlan(plan)} title="Edit plan">
                    <Edit className="h-3 w-3" />
                  </Button>

                  {/* Delete */}
                  <AlertDialog open={showDeleteDialog === plan.id} onOpenChange={open => setShowDeleteDialog(open ? plan.id : null)}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" title="Delete plan">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDeleteDialog(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePlan(plan.id)} className="bg-destructive dark:text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {savedPlans.length === 0 && (
          <div className="w-full flex items-center justify-center mt-20">
            <Card className="p-12 text-center border-card-border bg-surface">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium text-card-foreground">No saved plans yet</h3>
              <p className="mb-6 text-muted-foreground">Create your first weekend plan to get started</p>
              <Button onClick={onCreateNew} variant="default">
                <Plus className="h-4 w-4 mr-2" /> Create Your First Plan
              </Button>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={!!showPosterGenerator} onOpenChange={open => !open && setShowPosterGenerator(null)}>
  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Export Poster</DialogTitle>
    </DialogHeader>
    {showPosterGenerator && (
      <PosterGenerator
        scheduleItems={showPosterGenerator.scheduleItems}
        theme={showPosterGenerator.theme}
        planName={showPosterGenerator.name}
        onClose={() => setShowPosterGenerator(null)}
        isPopup={true}
      />
    )}
  </DialogContent>
</Dialog>

    </div>
  );
};

export default SavedPlansManager;
