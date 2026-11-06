import React from "react";

export default function KitchenerNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F0EB]/80 backdrop-blur-xl border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/assets/logo-official.png"
            alt="AKW Marketing Logo"
            className="w-8 h-8 rounded-md object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
        </a>
        <div className="flex items-center gap-5">
          <a href="/about" className="hidden sm:inline text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors">
            About
          </a>
          <a href="https://akwmarketing.com/landing">
            <button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2 transition-colors">
              Sign Up
            </button>
          </a>
        </div>
      </div>
    </nav>
  );
}