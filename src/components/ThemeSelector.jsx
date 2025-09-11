"use client";

import { Sparkles, Mountain, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const themes = [
    {
      id: "lazy",
      name: "Lazy",
      icon: Sparkles,
      description: "Cozy & relaxed",
    },
    {
      id: "adventurous",
      name: "Adventurous",
      icon: Mountain,
      description: "Active & exploring",
    },
    {
      id: "family",
      name: "Family",
      icon: Users,
      description: "Together time",
    },
  ];

  const activeTheme = themes.find((t) => t.id === currentTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {activeTheme ? (
            <>
              <activeTheme.icon className="h-4 w-4" />
              Theme: {activeTheme.name}
            </>
          ) : (
            "Theme"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.id;

          return (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isActive && "font-semibold text-indigo-600"
              )}
            >
              <Icon className="h-4 w-4" />
              {theme.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
