import { useState } from "react";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseTime, formatTime, getDefaultEndTime, isTimeInSlot } from "@/utils/timeUtils";

const TimeRangePicker = ({
  startTime,
  endTime,
  estimatedTime,
  timeSlot,
  onTimeChange,
  onClose,
}) => {
  const [localStartTime, setLocalStartTime] = useState(startTime);
  const [localEndTime, setLocalEndTime] = useState(endTime);
  const [error, setError] = useState(null);

  const validateTimeRange = (start, end) => {
    const startMinutes = parseTime(start);
    const endMinutes = parseTime(end);
    
    if (startMinutes >= endMinutes) {
      return "End time must be after start time";
    }
    
    if (!isTimeInSlot(start, timeSlot)) {
      return `Start time should be in ${timeSlot} period`;
    }
    
    const duration = endMinutes - startMinutes;
    if (duration < 15) {
      return "Activity must be at least 15 minutes long";
    }
    
    return null;
  };

  const handleStartTimeChange = (newStartTime) => {
    setLocalStartTime(newStartTime);
    
    const newEndTime = getDefaultEndTime(newStartTime, estimatedTime);
    setLocalEndTime(newEndTime);
    
    const validationError = validateTimeRange(newStartTime, newEndTime);
    setError(validationError);
  };

  const handleEndTimeChange = (newEndTime) => {
    setLocalEndTime(newEndTime);
    
    const validationError = validateTimeRange(localStartTime, newEndTime);
    setError(validationError);
  };

  const handleSave = () => {
    const validationError = validateTimeRange(localStartTime, localEndTime);
    if (!validationError) {
      onTimeChange(localStartTime, localEndTime);
      onClose();
    } else {
      setError(validationError);
    }
  };

  const duration = parseTime(localEndTime) - parseTime(localStartTime);

  return (
    <Card className="p-4 space-y-4 border-card-border dark:bg-[#171717]">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="font-medium text-card-foreground">Set Time Range</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time" className="text-sm text-card-foreground">
            Start Time
          </Label>
          <Input
            id="start-time"
            type="time"
            value={localStartTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="text-card-foreground"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-time" className="text-sm text-card-foreground">
            End Time
          </Label>
          <Input
            id="end-time"
            type="time"
            value={localEndTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            className="text-card-foreground"
          />
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Duration: {Math.floor(duration / 60)}h {duration % 60}m
        {estimatedTime && (
          <span className="ml-2">
            (Suggested: {Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m)
          </span>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!!error}>
          Save Time
        </Button>
      </div>
    </Card>
  );
};

export default TimeRangePicker;
