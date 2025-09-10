'use client'
import React, {useState} from 'react';
import { useTheme } from 'next-themes';
import { Calendar, Calendar1, CloudLightningIcon, Moon, MoonStar, Sun } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

import Link from 'next/link';
import WeekendPlanner from './WeekendPlanner';

const HeroSection = () => {
  const { theme, setTheme } = useTheme();
  const [showPlanner, setShowPlanner] = useState(false);

  if (showPlanner) {
    return <WeekendPlanner onBack={() => setShowPlanner(false)} />;
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className=" pt-10 transition-colors duration-500 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 px-8">
      

      <div className="container mx-auto px-6 py-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-14 items-center w-full">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">


            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
              Plan Your Perfect
              <span className="block text-indigo-600">
                Weekend ✨
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className="text-base lg:text-lg font-medium  leading-relaxed text-zinc-600 dark:text-zinc-400">
              Choose activities, set the vibe, and create a personalized weekend schedule in minutes.
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="px-8 py-4 bg-indigo-600 flex items-center gap-2 cursor-pointer text-white font-semibold rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-md"
              >
                <Calendar1 className='h-5 w-5'/>
                <Link href="/weekend-planner">Start Planning</Link>
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 font-semibold rounded-full cursor-pointer border transition-all duration-200 border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                See How It Works
              </button>
            </div>

            {/* Features Preview */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl"><Calendar/></span>
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
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600">
                      <span className="text-lg">☕</span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Morning Coffee & Brunch
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600">
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
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600">
                      <span className="text-lg">🎬</span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Movie Marathon
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600">
                      <span className="text-lg">🍕</span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Pizza Night
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Activity Icons */}
              <div className="absolute -top-4 -right-4 bg-indigo-600 text-white p-3 rounded-full shadow-md animate-pulse">
                🎨
              </div>
              <div className="absolute -bottom-4 -left-4 bg-sky-600 text-white p-3 rounded-full shadow-md animate-pulse delay-1000">
                🏊‍♀️
              </div>
              <div className="absolute top-1/2 -left-8 bg-emerald-600 text-white p-2 rounded-full shadow-md animate-bounce">
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