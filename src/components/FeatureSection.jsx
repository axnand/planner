"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Mountain, Users } from "lucide-react";

export default function FeatureSection() {
  const router = useRouter();

  const plans = [
    {
      id: "lazy",
      title: "Lazy Weekend",
      description: "Cozy activities, self-care, and relaxation. Perfect for recharging and unwinding.",
      icon: Sparkles,
      iconBg: "#f3e8ff",
      iconColor: "#9b5de5",
      buttonText: "Explore Lazy Plans",
    },
    {
      id: "adventurous",
      title: "Adventurous",
      description: "Outdoor activities, exploration, and new experiences to energize your spirit.",
      icon: Mountain,
      iconBg: "#e0f7ff",
      iconColor: "#00bbf9",
      buttonText: "Plan Adventures",
    },
    {
      id: "family",
      title: "Family Time",
      description: "Activities for everyone, bonding experiences, and memorable moments together.",
      icon: Users,
      iconBg: "#fff4e6",
      iconColor: "#ff6d00",
      buttonText: "Family Plans",
    },
  ];

  const getThemeGradientColors = (themeId) => {
    switch (themeId) {
      case "lazy":
        return { start: "#667eea", end: "#764ba2" };
      case "adventurous":
        return { start: "#f093fb", end: "#f5576c" };
      case "family":
        return { start: "#4facfe", end: "#00f2fe" };
      default:
        return { start: "#667eea", end: "#764ba2" };
    }
  };

  const handlePlanClick = (themeId) => {
    router.push(`/weekend-planner?theme=${themeId}&openActivity=true`);
  };

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-5xl mb-4 font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            Three Ways to Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose your planning style and let Weekendly adapt to your lifestyle
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const gradient = getThemeGradientColors(plan.id);

            return (
              <Card
                key={i}
                className="group relative overflow-hidden border sm:p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.start}33, ${gradient.end}99)`,
                  }}
                />
                <CardHeader className="relative space-y-4">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: plan.iconBg }}
                  >
                    <Icon className="h-6 w-6" style={{ color: plan.iconColor }} />
                  </div>
                  <CardTitle className="text-xl">{plan.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handlePlanClick(plan.id)}>
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
