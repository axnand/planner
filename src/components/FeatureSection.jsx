"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Mountain, Users } from "lucide-react"

export default function FeatureSection() {
  const plans = [
    {
      title: "Lazy Weekend",
      description: "Cozy activities, self-care, and relaxation. Perfect for recharging and unwinding.",
      icon: Sparkles,
      bgColor: "#9b5de5", // Purple
      iconBg: "#f3e8ff",
      iconColor: "#9b5de5",
      buttonText: "Explore Lazy Plans",
    },
    {
      title: "Adventurous",
      description: "Outdoor activities, exploration, and new experiences to energize your spirit.",
      icon: Mountain,
      bgColor: "#00bbf9", // Bright Blue
      iconBg: "#e0f7ff",
      iconColor: "#00bbf9",
      buttonText: "Plan Adventures",
    },
    {
      title: "Family Time",
      description: "Activities for everyone, bonding experiences, and memorable moments together.",
      icon: Users,
      bgColor: "#ff6d00", // Orange
      iconBg: "#fff4e6",
      iconColor: "#ff6d00",
      buttonText: "Family Plans",
    },
  ]

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl mb-4 font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Three Ways to Plan
      </h2>
          <p className="text-lg text-muted-foreground">
            Choose your planning style and let Weekendly adapt to your lifestyle
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-12 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <Card
                key={i}
                className="group relative overflow-hidden border p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Glow Overlay with inline style */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${plan.bgColor}33, ${plan.bgColor}99)`,
                  }}
                />

                <CardHeader className="relative space-y-4">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: plan.iconBg }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: plan.iconColor }}
                    />

                  </div>
                  <CardTitle className="text-xl">{plan.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button variant="outline" size="sm" className="w-full">
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
