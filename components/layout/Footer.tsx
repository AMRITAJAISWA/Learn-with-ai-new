import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/15 bg-black/40 backdrop-blur-[2px] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-slate-950">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white">
                Learn<span className="text-sky-400">WithAI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Learn Smarter. Learn Together. Learn With AI."
              <br />
              An intelligent personalized learning ecosystem unifying curriculum synthesis, educational video curation, active revision, and peer study buddy matching.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses" className="hover:text-sky-600">
                  AI Course Generator
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-sky-600">
                  Educational Video Engine
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-sky-600">
                  AI Learning Assistant
                </Link>
              </li>
              <li>
                <Link href="/quizzes" className="hover:text-sky-600">
                  Quiz & Test Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Collaboration & Revision */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Collaboration & Mastery
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/study-buddies" className="hover:text-sky-600">
                  Study Buddy Matching
                </Link>
              </li>
              <li>
                <Link href="/study-sessions" className="hover:text-sky-600">
                  Peer Study Sessions
                </Link>
              </li>
              <li>
                <Link href="/revision" className="hover:text-sky-600">
                  Smart Spaced Revision
                </Link>
              </li>
              <li>
                <Link href="/flashcards" className="hover:text-sky-600">
                  AI Flashcard Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Account */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Account & Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="text-sky-400 hover:text-sky-300 font-semibold">
                  Sign In to Account →
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white">
                  Platform Features
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} LearnWithAI. Built with precision for students worldwide.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Powered by Next.js, TypeGPU plasma concepts & AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
