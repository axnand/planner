'use client'

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import ThemeSwitcher from "./ThemeSwitcher"
import { PlusCircleIcon, Menu, X, Book } from "lucide-react"

const savedPlans = [
  { title: "Plan 1", href: "/saved/plan1" },
  { title: "Plan 2", href: "/saved/plan2" },
]

export default function WeekendlyNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <nav className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md fixed z-50 py-4 px-6 md:px-10">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold flex items-center space-x-1"
        >
          <span className="bg-clip-text text-transparent tracking-tight bg-gradient-to-r from-pink-400 to-purple-700">
            Weekendly
          </span>
          <span>✨</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/weekend-planner"
                    className="px-2 font-medium flex-row gap-2 items-center py-2 rounded-md text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-300 flex"
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1" />
                    <span>Create New Plan</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/saved"
                    className="px-2 font-medium py-2 flex-row items-center rounded-md text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-300"
                  >
                    <Book className="h-4 w-4 mr-1" />
                    <span>Saved Plans</span>
                    
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuIndicator />
            <NavigationMenuViewport />
          </NavigationMenu>

          {/* Theme Switcher */}
          <ThemeSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
  <div
    className="md:hidden absolute left-24 top-[64px] w-64 bg-white dark:bg-zinc-900 shadow-lg border-t border-zinc-200 dark:border-zinc-800 
      transition-all duration-300 ease-out origin-top transform animate-slideDown"
  >
    <div className="flex flex-col p-4 space-y-4">
      <Link
        href="/weekend-planner"
        className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-300"
        onClick={() => setMobileMenuOpen(false)}
      >
        <PlusCircleIcon className="h-4 w-4" />
        Create New Plan
      </Link>
      <Link
        href="/saved"
        className="text-zinc-700 flex items-center gap-2 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-300"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Book className="h-4 w-4"/>
        Saved Plans
      </Link>
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <ThemeSwitcher />
      </div>
    </div>
  </div>
)}

    </nav>
  )
}
