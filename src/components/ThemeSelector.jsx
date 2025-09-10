import { Sparkles, Mountain, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const themes = [
    {
      id: "lazy",
      name: "Lazy",
      icon: Sparkles,
      description: "Cozy & relaxed",
      variant: "lazy",
    },
    {
      id: "adventurous",
      name: "Adventurous",
      icon: Mountain,
      description: "Active & exploring",
      variant: "adventurous",
    },
    {
      id: "family",
      name: "Family",
      icon: Users,
      description: "Together time",
      variant: "family",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Theme:</span>
      {themes.map((theme) => {
        const Icon = theme.icon;
        const isActive = currentTheme === theme.id;

        return (
          <Button
            key={theme.id}
            variant={isActive ? theme.variant : "outline"}
            size="sm"
            onClick={() => onThemeChange(theme.id)}
            className={cn(
              "gap-2 transition-all duration-200",
              isActive && "shadow-md"
            )}
          >
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{theme.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
