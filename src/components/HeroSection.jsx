'use client'
import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeQuery.matches);

    const handleThemeChange = (e) => setIsDark(e.matches);
    darkModeQuery.addEventListener('change', handleThemeChange);
    
    return () => darkModeQuery.removeEventListener('change', handleThemeChange);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? 'bg-zinc-950 text-zinc-100'
          : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 shadow-sm ${
            isDark
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
              : 'bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="container mx-auto px-6 py-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Brand */}
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <span className="text-2xl font-bold text-indigo-600">
                Weekendly
              </span>
              <span className="text-2xl">✨</span>
            </div>

            {/* Headline */}
            <h1
              className={`text-5xl lg:text-6xl font-bold leading-tight ${
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              }`}
            >
              Plan Your Perfect
              <span className="block text-indigo-600">
                Weekend ✨
              </span>
            </h1>

            {/* Subheadline */}
            <h2
              className={`text-xl lg:text-2xl font-light leading-relaxed ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              Choose activities, set the vibe, and create a personalized weekend schedule in minutes.
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection('planner')}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-md"
              >
                Start Planning →
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`px-8 py-4 font-semibold rounded-full border transition-all duration-200 ${
                  isDark
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                See How It Works
              </button>
            </div>

            {/* Features Preview */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🗓️</span>
                <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Easy Scheduling
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Drag & Drop
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌙</span>
                <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Themes & Moods
                </span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div
              className={`relative p-8 rounded-3xl ${
                isDark
                  ? 'bg-zinc-900 border border-zinc-800'
                  : 'bg-white border border-zinc-200 shadow-md'
              }`}
            >
              {/* Calendar Mockup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    This Weekend
                  </h3>
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Saturday */}
                <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                  <h4 className={`font-semibold mb-3 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    Saturday
                  </h4>
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-3 p-2 rounded-lg ${isDark ? 'bg-zinc-700' : 'bg-white border border-zinc-200'}`}>
                      <span className="text-lg">☕</span>
                      <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Morning Coffee & Brunch
                      </span>
                    </div>
                    <div className={`flex items-center space-x-3 p-2 rounded-lg ${isDark ? 'bg-zinc-700' : 'bg-white border border-zinc-200'}`}>
                      <span className="text-lg">🥾</span>
                      <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Nature Hiking
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sunday */}
                <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                  <h4 className={`font-semibold mb-3 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    Sunday
                  </h4>
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-3 p-2 rounded-lg ${isDark ? 'bg-zinc-700' : 'bg-white border border-zinc-200'}`}>
                      <span className="text-lg">🎬</span>
                      <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Movie Marathon
                      </span>
                    </div>
                    <div className={`flex items-center space-x-3 p-2 rounded-lg ${isDark ? 'bg-zinc-700' : 'bg-white border border-zinc-200'}`}>
                      <span className="text-lg">🍕</span>
                      <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
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

      {/* Demo Sections */}
      <div id="planner" className="h-20"></div>
      <div id="features" className="h-20"></div>
    </div>
  );
};

export default HeroSection;
