"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CTASection() {
  const [showPlanner, setShowPlanner] = useState(false)
  const router = useRouter();

  return (
    <section className="px-6 sm:py-20 pb-20">
      <div className="mx-auto max-w-5xl text-center">
        <div className="relative rounded-3xl p-12 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
    Plan Smarter, Enjoy Harder
  </h2>
  <p className="mb-8 mt-5 text-lg text-gray-100 text-center max-w-2xl mx-auto">
    Weekendly makes planning simple, fun, and shareable — so you can focus on making memories.
  </p>
  <div className="flex justify-center">
    <Button
      size="lg"
      onClick={() => router.push("/weekend-planner")}
      className="bg-gradient-to-r cursor-pointer from-fuchsia-500 via-purple-500 to-primary text-white font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg"
    >
      <Calendar className="mr-2 h-5 w-5" />
      Start Planning Now
    </Button>
  </div>
</div>


      </div>
    </section>
  )
}
