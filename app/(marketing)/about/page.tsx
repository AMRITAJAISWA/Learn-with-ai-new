import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sparkles, Heart, Compass, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Our Mission
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              About LearnWithAI
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              "Learn Smarter. Learn Together. Learn With AI."
            </p>
          </div>

          <div className="space-y-8 text-slate-700 text-sm leading-relaxed bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Why We Built LearnWithAI
            </h2>
            <p>
              Traditional online education is broken for most students. Learners are handed massive, static 60-hour video playlists that assume everyone starts at the same baseline, learns at the same speed, and retains concepts indefinitely without spaced reinforcement.
            </p>
            <p>
              When students get stuck, they either spend hours searching forums or simply give up. When they study alone, isolation erodes their motivation.
            </p>
            <p>
              <strong>LearnWithAI was conceived as a dynamic companion.</strong> Rather than a passive archive of videos, it is an active cognitive partner that creates custom courses, surfaces verified explanations, identifies your specific weak areas before tests, and connects you with study partners learning the exact same material.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <Compass className="h-6 w-6 text-sky-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-xs">Personalized Guidance</h4>
                <p className="mt-1 text-[11px] text-slate-500">
                  Every curriculum is uniquely synthesized around your goals and available time.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <Zap className="h-6 w-6 text-amber-500 mb-2" />
                <h4 className="font-bold text-slate-900 text-xs">Active Recall Science</h4>
                <p className="mt-1 text-[11px] text-slate-500">
                  Spaced repetition and automatic weak-spot detection maximize retention.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <Heart className="h-6 w-6 text-rose-500 mb-2" />
                <h4 className="font-bold text-slate-900 text-xs">Peer Accountability</h4>
                <p className="mt-1 text-[11px] text-slate-500">
                  Study buddy compatibility matching turns isolated cramming into collaborative mastery.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Ready to join our learning community?</h4>
                <p className="text-[11px] text-slate-500">Start learning today for free.</p>
              </div>
              <Link
                href="/onboarding"
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
