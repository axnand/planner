"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Mountain, Users } from "lucide-react"

export default function FeatureSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Three Ways to Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose your planning style and let Weekendly adapt to your lifestyle
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid gap-20 md:grid-cols-3">
          
          {/* Lazy Weekend */}
          <Card className="group relative overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 to-transparent opacity-0 transition-opacity group-hover:opacity-20" />
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Lazy Weekend</CardTitle>
              <CardDescription>
                Cozy activities, self-care, and relaxation. Perfect for recharging and unwinding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Explore Lazy Plans
              </Button>
            </CardContent>
          </Card>

          {/* Adventurous */}
          <Card className="group relative overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 to-transparent opacity-0 transition-opacity group-hover:opacity-20" />
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Mountain className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Adventurous</CardTitle>
              <CardDescription>
                Outdoor activities, exploration, and new experiences to energize your spirit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Plan Adventures
              </Button>
            </CardContent>
          </Card>

          {/* Family Time */}
          <Card className="group relative overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-transparent opacity-0 transition-opacity group-hover:opacity-20" />
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Family Time</CardTitle>
              <CardDescription>
                Activities for everyone, bonding experiences, and memorable moments together.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Family Plans
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
