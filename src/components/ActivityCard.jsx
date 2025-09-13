import { Clock, MapPin, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ActivityCard = ({ activity, onSelect, isSelected, theme }) => {
  const getThemeStyles = () => {
    switch (theme) {
      case "lazy":
        return "hover:bg-gradient-lazy hover:text-theme-lazy-foreground";
      case "adventurous":
        return "hover:bg-gradient-adventurous hover:text-theme-adventurous-foreground";
      case "family":
        return "hover:bg-gradient-family hover:text-theme-family-foreground";
      default:
        return "hover:bg-primary-light";
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  return (
   <Card
  className={cn(
    "group relative overflow-hidden border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer dark:border-zinc-800 dark:bg-[#171717]",
    isSelected && "ring-2 ring-primary shadow-primary",
    getThemeStyles()
  )}
  onClick={onSelect}
>
  <div className="space-y-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{activity.icon}</div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 group-hover:text-current dark:text-card-foreground">
            {activity.name}
          </h3>
          <p className="text-sm text-gray-500 group-hover:text-current/80 dark:text-muted-foreground">
            {activity.description}
          </p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-gray-500 group-hover:text-current/70 dark:text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDuration(activity.estimatedTime)}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 group-hover:text-current/70 dark:text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{activity.isIndoor ? "Indoor" : "Outdoor"}</span>
        </div>
      </div>

      <Badge
        variant="secondary"
        className="text-xs group-hover:bg-gray-100/20 group-hover:text-current dark:group-hover:bg-white/20"
      >
        {activity.category}
      </Badge>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-current/70 dark:text-muted-foreground">
        <Tag className="h-3 w-3" />
        <span className="capitalize">{activity.mood}</span>
      </div>

      {isSelected && (
        <div className="text-xs font-medium text-primary group-hover:text-current">
          Selected
        </div>
      )}
    </div>

    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none dark:from-black/0 dark:to-white/5" />
  </div>
</Card>

  );
};

export default ActivityCard;
