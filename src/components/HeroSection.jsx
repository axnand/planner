'use client'
import React from 'react';
import { Calendar1, CloudLightningIcon, MoonStar, Book, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

const HeroSection = () => {

  

  return (
    <div className=" pt-16 sm:pt-10 transition-colors duration-500 bg-zinc-50 dark:bg-zinc-950 sm:px-8 px-2">
      <div className="container mx-auto md:px-6 px-4 py-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center w-full">

         
          <div className="space-y-8 sm:text-center lg:text-left">
           
            <h1 className="text-5xl sm:text-5xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent tracking-tight bg-gradient-to-r from-primary to-indigo-300">
              Plan Your Perfect
              <div className='flex items-center gap-4'>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-500">
                  Weekend
                </span>
                <div className="w-14 h-14 rounded-lg bg-indigo-500 shadow-lg flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white transition-transform transform group-hover:scale-110"></div>
                </div>
              </div>
            </h1>

            
            <h2 className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Choose activities, set the vibe, and create a personalized weekend schedule in minutes.
            </h2>

           
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start lg:items-center">
              <Link href="/weekend-planner">
                <button
                  className="px-6 sm:px-8 py-3 text-sm sm:text-[15px] bg-gradient-to-r from-teal-500 to-indigo-500 flex items-center gap-2 cursor-pointer text-white font-medium rounded-lg hover:from-teal-700 hover:to-indigo-600 transition duration-200 shadow-md w-full sm:w-auto justify-center"
                >
                  <Calendar1 className='h-5 w-5'/>
                  Start Planning
                </button>
              </Link>
              <Link href="/saved" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="px-6 sm:px-8 py-[22px] w-full sm:w-auto cursor-pointer flex items-center gap-2 justify-center"
                >
                  <Book className="h-4 w-4" />
                  Saved Plans
                </Button>
              </Link>
            </div>

            
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

          
          <div className="relative">
            <div className="relative md:p-8 p-6 rounded-3xl bg-white border border-zinc-200 shadow-md dark:bg-zinc-900 dark:border-zinc-800">
             
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

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
