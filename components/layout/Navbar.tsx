"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight, Wand2, LogIn } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [plasmaOn, setPlasmaOn] = useState(true);

  const togglePlasma = () => {
    const next = !plasmaOn;
    setPlasmaOn(next);
    localStorage.setItem("learnwithai_plasma_enabled", String(next));
    window.dispatchEvent(
      new CustomEvent("toggle-plasma", { detail: { enabled: next } })
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/15 bg-black/35 backdrop-blur-[2px] text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white">
              Learn<span className="text-sky-400">WithAI</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-slate-400 -mt-1 hidden sm:block">
              Learn Smarter • Together
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link
            href="/features"
            className="hover:text-sky-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-sky-400 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="hover:text-sky-400 transition-colors"
          >
            About
          </Link>
          <Link
            href="/dashboard"
            className="text-sky-400 font-semibold hover:text-sky-300 flex items-center gap-1"
          >
            Live Demo
          </Link>
        </nav>

        {/* Right CTA / Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Plasma Toggle Button */}
          <button
            onClick={togglePlasma}
            title="Toggle interactive plasma fluid trail"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              plasmaOn
                ? "bg-sky-50 border-sky-300 text-sky-700 shadow-sm"
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}
          >
            <Wand2 className={`h-3.5 w-3.5 ${plasmaOn ? "text-sky-600" : ""}`} />
            <span>Plasma {plasmaOn ? "On" : "Off"}</span>
          </button>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <LogIn className="h-3.5 w-3.5 text-sky-400" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link
            href="/features"
            className="block py-2 text-base font-medium text-slate-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="block py-2 text-base font-medium text-slate-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="block py-2 text-base font-medium text-slate-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn className="h-4 w-4 text-sky-600" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/dashboard"
              className="w-full text-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Learning Free (Live Demo)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
