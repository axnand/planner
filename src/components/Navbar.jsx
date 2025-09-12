'use client'

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ThemeSwitcher from "./ThemeSwitcher"
import { Plus, PlusCircle, PlusCircleIcon, Upload } from "lucide-react"

const themes = ["Lazy Weekend", "Adventurous", "Family"]
const savedPlans = [
  { title: "Plan 1", href: "/saved/plan1" },
  { title: "Plan 2", href: "/saved/plan2" },
]

export default function WeekendlyNavbar() {
  const [themeType, setThemeType] = React.useState("Lazy Weekend")

  return (
    <nav className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md fixed z-50 py-2 px-10">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-500 flex items-center space-x-1">
          <span>Weekendly</span>
          <span>✨</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 ">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-4">

              
              {/* Share / Export */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/share" className="px-2 flex-row gap-2 items-center py-2 rounded-md text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <PlusCircleIcon/><span>Create New Plan</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/saved" className="px-2 py-2 rounded-md text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Saved Plans
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              

              {/* Theme Selector */}
              


            </NavigationMenuList>
            <NavigationMenuIndicator />
            <NavigationMenuViewport />
          </NavigationMenu>
          <div className="flex gap-4">
        <div className="hidden md:flex">
          <ThemeSwitcher />
        </div>
        </div>

          {/* Search */}
          

        </div>

        {/* Right: Theme Toggle */}
        

      </div>
    </nav>
  )
}
