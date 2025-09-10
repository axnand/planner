"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useState } from "react"

export default function CTASection() {
  const [showPlanner, setShowPlanner] = useState(false)

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 p-12 text-white shadow-xl">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Transform Your Weekends?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands who've discovered the joy of intentional weekend planning
          </p>
          <Button
            size="lg"
            onClick={() => setShowPlanner(true)}
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:text-white transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Start Planning Now
          </Button>
        </div>
      </div>
    </section>
  )
}
