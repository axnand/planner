"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { Plus, Calendar, Clock, Edit, Trash2, GripVertical, AlertTriangle, Edit2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { timeRangesOverlap, isTimeInSlot, getTimeSlotBoundaries } from "@/utils/timeUtils"
import { useRouter } from "next/navigation"
import TimeRangePicker from "@/components/TimeRangePicker";
import {
  ArrowLeft,
  Save,
  Wand2,
  MapPin,
  Image as ImageIcon,
  MoreHorizontal,
} from "lucide-react";
import SavePlanDialog from "./SavePlanDialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ScheduleBuilder = ({ 
  scheduleItems, 
  activeDays = ["saturday", "sunday"],
  onUpdateItem, 
  onRemoveItem, 
  onAddActivity, 
  onAddActivityToSlot,
  theme,
  editingPlan,              
  isEditMode,
  autoGeneratePlan,            
  setShowSmartIntegrations,    
  setShowPosterGenerator,             
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [editingTimeForItem, setEditingTimeForItem] = useState(null);


  const router = useRouter();

  useEffect(() => setIsMounted(true), [])

  const timeSlots = ["morning", "afternoon", "evening"];


  const getThemeColor = () => {
  switch (theme) {
    case "lazy":
      return { gradient: "bg-gradient-to-r from-[#667eea] to-[#764ba2]", light: "from-[#667eea]/10 to-[#764ba2]/10" };
    case "adventurous":
      return { gradient: "bg-gradient-to-r from-[#f093fb] to-[#f5576c]", light: "from-[#f093fb]/10 to-[#f5576c]/10" };
    case "family":
      return { gradient: "bg-gradient-to-r from-[#4facfe] to-[#00f2fe]", light: "from-[#4facfe]/10 to-[#00f2fe]/10" };
    default:
      return { gradient: "bg-gradient-to-r from-[#667eea] to-[#764ba2]", light: "from-[#667eea]/10 to-[#764ba2]/10" };
  }
};


  const getTimeSlotLabel = (timeSlot) => {
  switch (timeSlot) {
    case "morning": return "Morning";
    case "afternoon": return "Afternoon";
    case "evening": return "Evening";
    default: return timeSlot;
  }
};
const getConflictingItems = (item) => {
  return scheduleItems.filter(otherItem => 
    otherItem.id !== item.id &&
    otherItem.day === item.day &&
    timeRangesOverlap(item.startTime, item.endTime, otherItem.startTime, otherItem.endTime)
  );
};

const hasTimeConflicts = (item) => {
  return getConflictingItems(item).length > 0;
};

const handleTimeChange = (itemId, startTime, endTime) => {
  onUpdateItem(itemId, { startTime, endTime });
  setEditingTimeForItem(null);
};


const validateItemTimeSlot = (item) => {
  return isTimeInSlot(item.startTime, item.timeSlot);
};





  const getItemsForDayAndSlot = (day, slot) =>
    scheduleItems.filter(item => item.day === day && item.timeSlot === slot)

  const onDragEnd = (result) => {
    if (!result.destination) return
    const { source, destination, draggableId } = result

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    const [destDay, destSlot] = destination.droppableId.split("-")
    onUpdateItem(draggableId, { day: destDay, timeSlot: destSlot })
  }

  const getMood = (m) =>
    m === "relaxed" ? "😌" : m === "energized" ? "⚡" : "😊"

  if (!isMounted) {
    return (
      <div className="space-y-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">Your Weekend Schedule</h2>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      
      <div className="text-center">
        <h2 data-testid="schedule-header" className="text-2xl font-bold text-foreground mb-2">Your Weekend Schedule</h2>
        <p className="text-muted-foreground">
          Drag and drop activities to reorganize your perfect weekend
        </p>
      </div>
      {scheduleItems.some(hasTimeConflicts) && (
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some activities have overlapping times. Click on the time ranges to adjust them.
          </AlertDescription>
        </Alert>
      )}

      {editingTimeForItem && (
  <div className="fixed inset-0 bg-black/50 h-full flex items-center justify-center z-50 p-4">
    <div className="w-full max-w-md">
      {(() => {
        const item = scheduleItems.find(item => item.id === editingTimeForItem);
        return item ? (
          <TimeRangePicker
            startTime={item.startTime}
            endTime={item.endTime}
            estimatedTime={item.activity.estimatedTime}
            timeSlot={item.timeSlot}
            onTimeChange={(startTime, endTime) => handleTimeChange(item.id, startTime, endTime)}
            onClose={() => setEditingTimeForItem(null)}
          />
        ) : null;
      })()}
    </div>
  </div>
)}

      
      <div className="flex justify-end gap-3">
        <SavePlanDialog
          scheduleItems={scheduleItems}
          theme={theme}
          activeDays={activeDays}
          editingPlan={editingPlan}
          isEditMode={isEditMode}
        >
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            {isEditMode ? "Update Plan" : "Save Plan"}
          </Button>
        </SavePlanDialog>
        <Button onClick={onAddActivity} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
              <Button variant="outline" onClick={autoGeneratePlan} className="gap-2 hidden sm:flex">
                <Wand2 className="h-4 w-4" />
                Auto Generate
              </Button>
              <Button variant="outline" onClick={() => setShowSmartIntegrations(true)} className="gap-2 hidden sm:flex">
                <MapPin className="h-4 w-4" />
                Find Spots
              </Button>
              <Button variant="outline" onClick={() => setShowPosterGenerator(true)} className="gap-2 hidden sm:flex">
                <ImageIcon className="h-4 w-4" />
                Export Poster
              </Button>
            </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={cn(
            "grid gap-6",
            activeDays.length === 1
              ? "grid-cols-1"
              : activeDays.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {activeDays.map((day) => (
            <Card key={day} className="p-4 sm:p-6 border-card-border dark:bg-[#171717]">
              <div className="mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground capitalize truncate">
                  {day}
                </h3>
                <div className={cn("h-1 w-12 sm:w-16 rounded-full mt-2", getThemeColor().gradient)} />
              </div>

              <div className="space-y-4">
                {timeSlots.map((timeSlot) => {
                  const items = getItemsForDayAndSlot(day, timeSlot)

                  return (
                    <div key={timeSlot} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                          {getTimeSlotLabel(timeSlot)}
                        </h4>


                        <div className="flex items-center gap-2">
                          {onAddActivityToSlot && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn("h-6 w-6 p-0", getThemeColor().gradient)}
                              onClick={() => onAddActivityToSlot(day, timeSlot)}
                            >
                              <Plus className="h-3 w-3 text-white" />
                            </Button>
                          )}
                          <Clock className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <Droppable droppableId={`${day}-${timeSlot}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                              "min-h-20 sm:min-h-24 rounded-lg border-2 border-dashed transition-colors",
                              snapshot.isDraggingOver
                                ? `${getThemeColor().gradient} bg-opacity-20`
                                : `border-muted bg-gradient-to-r ${getThemeColor().light}`
                            )}
                          >
                            {items.length === 0 ? (
                              <div className="flex items-center justify-center p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                                Drop activities here
                              </div>
                            ) : (
                              <div className="p-2 space-y-2">
                                {items.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                      <Card
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn(
                                          "p-2 sm:p-3 border-card-border bg-surface shadow-sm transition-shadow",
                                          snapshot.isDragging && "shadow-lg"
                                        )}
                                      >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                          <GripVertical className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground shrink-0" />
                                          <div className="text-base sm:text-lg shrink-0">
                                            {item.activity?.icon || "📝"}
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <h5 className="font-medium sm:text-base text-[13px] text-card-foreground truncate">
                                                {item.activity?.name || "Activity"}
                                              </h5>
                                              <span className="text-xs sm:text-sm">
                                                {getMood(item.mood || "relaxed")}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                               <button
                                                 onClick={() => setEditingTimeForItem(item.id)}
                                                 className="hover:text-foreground flex gap-1 items-center transition-colors cursor-pointer"
                                               >
                                                 <Edit className="w-3 h-3"/><span>{item.startTime} - {item.endTime}</span>
                                               </button>
                                               <Badge variant="secondary" className="text-xs">
                                                 {item.activity.category}
                                               </Badge>
                                               {hasTimeConflicts(item) && (
                                                 <AlertTriangle className="h-3 w-3 text-destructive" />
                                               )}
                                               {!validateItemTimeSlot(item) && (
                                                 <Badge variant="destructive" className="text-xs">
                                                   Wrong slot
                                                 </Badge>
                                               )}
                                             </div>
                                          </div>

                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive hover:text-destructive shrink-0"
                                            onClick={() => onRemoveItem(item.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </Card>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>
      </DragDropContext>


      
      {scheduleItems.length === 0 && (
        <Card className="p-12 text-center border-card-border bg-surface">
          <Calendar className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <h3 className=" text-lg font-medium text-card-foreground">
            Your weekend schedule is empty
          </h3>
          <p className="mb-3 -mt-4 text-muted-foreground">
            Start by adding activities to create your perfect weekend plan
          </p>
          <div className="flex w-full justify-center ">
          <Button onClick={onAddActivity} variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Activity
          </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ScheduleBuilder
