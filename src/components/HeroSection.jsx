'use client'
import React from 'react';
import { Calendar1, CloudLightningIcon, MoonStar, Book } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

const HeroSection = () => {

  

  return (
    <div className="pt-10 transition-colors duration-500 bg-zinc-50 dark:bg-zinc-950 px-8">
      <div className="container mx-auto px-6 py-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-32 items-center w-full">

          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent tracking-tight bg-gradient-to-r from-primary to-purple-300">
              Plan Your Perfect
              <span className="block bg-clip-text text-transparent tracking-tight bg-gradient-to-r from-pink-400 to-purple-700">
                Weekend ✨
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className="text-base lg:text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
              Choose activities, set the vibe, and create a personalized weekend schedule in minutes.
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start lg:items-center">
              <Link href="/weekend-planner">
                <button
                  className="px-8 py-3 text-[15px] bg-gradient-to-r from-indigo-600 to-purple-500 flex items-center gap-2 cursor-pointer text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-600 transition-all duration-200 shadow-md"
                >
                  <Calendar1 className='h-5 w-5'/>
                  Start Planning
                </button>
              </Link>
              <Link href="/saved">
                <Button 
                  variant="outline" 
                  className="px-8 py-6 cursor-pointer"
                >
                  <Book className="h-4 w-4" />
                  Saved Plans
                </Button>
              </Link>
            </div>

            {/* Features Preview */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl"><Calendar1/></span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Easy Scheduling
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl"><CloudLightningIcon/></span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Drag & Drop
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl"><MoonStar/></span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Themes & Moods
                </span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="relative p-8 rounded-3xl bg-white border border-zinc-200 shadow-md dark:bg-zinc-900 dark:border-zinc-800">
              {/* Calendar Mockup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    This Weekend
                  </h3>
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Saturday */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                  <h4 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">
                    Saturday
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 font-medium p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600">
                      <span className="text-lg">☕</span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Morning Coffee & Brunch
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 font-medium p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600">
                      <span className="text-lg">🥾</span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Nature Hiking
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sunday */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                  <h4 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">
                    Sunday
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 font-medium p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600">
                      <span className="text-lg">🎬</span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Movie Marathon
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 font-medium p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600">
                      <span className="text-lg">🍕</span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Pizza Night
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Activity Icons */}
              <div
                className="absolute -top-4 -right-4 text-white p-3 rounded-full shadow-md animate-pulse"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                🎨
              </div>

              <div
                className="absolute -bottom-4 -left-4 text-white p-3 rounded-full shadow-md animate-pulse delay-1000"
                style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)" }}
              >
                🏊‍♀️
              </div>

              <div
                className="absolute top-1/2 -left-8 text-white p-2 rounded-full shadow-md animate-bounce"
                style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)" }}
              >
                🚴‍♂️
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
