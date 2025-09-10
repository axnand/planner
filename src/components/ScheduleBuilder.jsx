"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { Plus, Calendar, Clock, Edit, Trash2, GripVertical, Save } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ScheduleBuilder = ({ 
  scheduleItems, 
  activeDays = ["saturday", "sunday"], // ✅ now extendable
  onUpdateItem, 
  onRemoveItem, 
  onAddActivity, 
  onSavePlanner, // ✅ new save hook
  theme 
}) => {
  const [editingItem, setEditingItem] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const timeSlots = ["morning", "afternoon", "evening"]

  const getThemeColor = () => {
    switch (theme) {
      case "lazy": return "bg-gradient-lazy";
      case "adventurous": return "bg-gradient-adventurous";
      case "family": return "bg-gradient-family";
      default: return "bg-gradient-primary";
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

  const getItemsForDayAndSlot = (day, slot) =>
    scheduleItems.filter(item => item.day === day && item.timeSlot === slot)

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const [destDay, destSlot] = destination.droppableId.split("-")
    onUpdateItem(draggableId, { day: destDay, timeSlot: destSlot })
  }

  const getMood = (m) =>
    m === "relaxed" ? "😌" : m === "energized" ? "⚡" : "😊"

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Your Weekend Schedule</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Weekend Schedule</h2>
        <p className="text-muted-foreground">
          Drag and drop activities to reorganize your perfect weekend
        </p>
      </div>

      {/* Save Planner Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={onSavePlanner}>
          <Save className="h-4 w-4 mr-2" />
          Save Planner
        </Button>
      </div>

      {/* Schedule Grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={cn(
            "grid gap-6",
            activeDays.length === 1
              ? "lg:grid-cols-1"
              : activeDays.length === 2
              ? "lg:grid-cols-2"
              : "lg:grid-cols-3"
          )}
        >
          {activeDays.map((day) => (
            <Card key={day} className="p-6 border-card-border bg-surface">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-card-foreground capitalize">
                  {day}
                </h3>
                <div className={cn("h-1 w-16 rounded-full mt-2", getThemeColor())} />
              </div>

              <div className="space-y-4">
                {timeSlots.map((timeSlot) => {
                  const items = getItemsForDayAndSlot(day, timeSlot)

                  return (
                    <div key={timeSlot} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          {getTimeSlotLabel(timeSlot)}
                        </h4>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <Droppable droppableId={`${day}-${timeSlot}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                              "min-h-24 rounded-lg border-2 border-dashed transition-colors",
                              snapshot.isDraggingOver
                                ? "border-primary bg-primary/10"
                                : "border-muted bg-muted/20"
                            )}
                          >
                            {items.length === 0 ? (
                              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                Drop activities here
                              </div>
                            ) : (
                              <div className="p-2 space-y-2">
                                {items.map((item, index) => (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <Card
                                        ref={provided.innerRef}
                                        {...provided.draggableProps} 
                                        {...provided.dragHandleProps}
                                        className={cn(
                                          "p-3 border-card-border bg-surface shadow-sm transition-shadow",
                                          snapshot.isDragging && "shadow-lg"
                                        )}
                                      >
                                        <div className="flex items-center gap-3">
                                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                                          <div className="text-lg">{item.activity?.icon || "📝"}</div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <h5 className="font-medium text-card-foreground truncate">
                                                {item.activity?.name || "Activity"}
                                              </h5>
                                              <span className="text-sm">
                                                {getMood(item.mood || "relaxed")}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                              <span>{item.startTime || "TBD"}</span>
                                              <Badge variant="secondary" className="text-xs">
                                                {item.activity?.category || "general"}
                                              </Badge>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6"
                                              onClick={() => setEditingItem(item.id)}
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 text-destructive hover:text-destructive"
                                              onClick={() => onRemoveItem(item.id)}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
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

      {/* Empty State */}
      {scheduleItems.length === 0 && (
        <Card className="p-12 text-center border-card-border bg-surface">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium text-card-foreground">
            Your weekend schedule is empty
          </h3>
          <p className="mb-6 text-muted-foreground">
            Start by adding activities to create your perfect weekend plan
          </p>
          <Button onClick={onAddActivity} variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Activity
          </Button>
        </Card>
      )}

      {/* Placeholder for Recent Activity / Charts / Timeline */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        {/* 🔹 You can mount charts / timeline component here later */}
        <Card className="p-6 border-card-border bg-surface text-center text-muted-foreground">
          No recent planners saved yet.
        </Card>
      </div>
    </div>
  )
}

export default ScheduleBuilder
