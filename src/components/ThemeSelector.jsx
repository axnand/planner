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
    { id: "lazy", name: "Lazy", icon: Sparkles, description: "Cozy & relaxed" },
    { id: "adventurous", name: "Adventurous", icon: Mountain, description: "Active & exploring" },
    { id: "family", name: "Family", icon: Users, description: "Together time" },
  ];

const plans = [
  { 
    id: "lazy", 
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
    iconColor: "#764ba2" 
  },
  { 
    id: "adventurous", 
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", 
    iconColor: "#f5576c" 
  },
  { 
    id: "family", 
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", 
    iconColor: "#00f2fe" 
  },
];


  const activePlan = plans.find((p) => p.id === currentTheme);
  const activeTheme = themes.find((t) => t.id === currentTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          style={{
            background: activePlan ? activePlan.gradient : undefined,
            color: activePlan ? "white" : undefined,
          }}
          className={cn(
            "gap-2",
            "hover:brightness-105 transition-all duration-300",
            "shadow-md rounded-lg cursor-pointer"
          )}
        >
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
    "flex items-center gap-2 cursor-pointer rounded-md px-3 py-1 transition-all",
    isActive ? "font-semibold text-white" : "text-zinc-900 dark:text-zinc-100"
  )}
  style={{
    background: isActive
      ? theme.id === "lazy"
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : theme.id === "adventurous"
        ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        : theme.id === "family"
        ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        : undefined
      : undefined,
  }}
>
  <Icon className="h-4 w-4" style={{ color: isActive ? "white" : undefined }} />
  {theme.name}
</DropdownMenuItem>


          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
