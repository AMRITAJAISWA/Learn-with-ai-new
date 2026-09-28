"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  PlaySquare,
  Users,
  Bot,
  FileQuestion,
  Calendar,
  RotateCcw,
  Layers,
  CheckCircle2,
  Flame,
  Award,
  Zap,
  Star,
  GraduationCap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  const featureCards = [
    {
      icon: BookOpen,
      title: "AI Course Generator",
      description:
        "Creates a structured course based on the user's learning goal; generates modules, topics, and a personalized learning sequence.",
      color: "from-blue-500 to-sky-400",
      href: "/courses/new",
      tag: "Neural Syllabus",
    },
    {
      icon: PlaySquare,
      title: "AI Video Recommendation",
      description:
        "Finds relevant educational videos from the internet and recommends resources matched to topic and skill level with 0-key free search.",
      color: "from-rose-500 to-amber-500",
      href: "/videos",
      tag: "Zero Clickbait",
    },
    {
      icon: Users,
      title: "Study Buddy Matching",
      description:
        "Matches students based on the same course, similar learning goals, similar skill level, and compatible study schedule.",
      color: "from-indigo-500 to-blue-500",
      href: "/study-buddies",
      tag: "Smart Synergy",
    },
    {
      icon: Bot,
      title: "AI Learning Assistant",
      description:
        "Answers questions, explains difficult concepts, and provides summaries and practice questions in real time.",
      color: "from-cyan-500 to-teal-400",
      href: "/assistant",
      tag: "24/7 Contextual",
    },
    {
      icon: FileQuestion,
      title: "AI Quiz & Test Generator",
      description:
        "Creates personalized quizzes, practice questions, and mock tests based on what the student is learning.",
      color: "from-amber-500 to-orange-400",
      href: "/quizzes",
      tag: "Active Recall",
    },
    {
      icon: Calendar,
      title: "Interactive Study Sessions",
      description:
        "Host and schedule collaborative peer study sessions with matched study buddies to learn together.",
      color: "from-emerald-500 to-teal-400",
      href: "/study-sessions",
      tag: "Virtual Rooms",
    },
    {
      icon: RotateCcw,
      title: "Smart Revision System",
      description:
        "Automatically identifies topics that need revision and schedules personalized review sessions based on spaced repetition.",
      color: "from-violet-500 to-purple-400",
      href: "/revision",
      tag: "Spaced Repetition",
    },
    {
      icon: Layers,
      title: "AI Flashcard Generator",
      description:
        "Creates interactive 3D flip flashcards from courses, notes, and learning material for rapid memory consolidation.",
      color: "from-blue-600 to-indigo-500",
      href: "/flashcards",
      tag: "3D Flip Cards",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-transparent selection:bg-sky-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-black/40 px-4 py-1.5 text-xs font-semibold text-sky-300 shadow-xl backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
            <span>Next-Generation Personalized EdTech</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200">Learn With AI</span>
          </div>

          {/* Main Headline with drop shadow for supreme clarity */}
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-[1.15] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Your AI-Powered Personal{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Learning Companion
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-100 font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            LearnWithAI creates personalized learning paths, recommends the right resources, helps you solve doubts, tracks your progress, and connects you with students who learn like you.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-sky-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-sky-500/30 hover:bg-sky-400 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-black/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all backdrop-blur-sm shadow-lg active:scale-95"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 flex items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-white flex-wrap">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 shadow-md">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Personalized Curricula</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 shadow-md">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Smart Spaced Revision</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 shadow-md">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Peer Study Match</span>
            </div>
          </div>

          {/* Interactive Visual Dashboard Mockup - Crystal Clear Transparent */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-3xl border border-white/25 bg-white/[0.04] p-3 sm:p-5 shadow-2xl backdrop-blur-[1px]">
            <div className="rounded-2xl border border-white/15 bg-black/25 p-4 sm:p-6 text-left">
              {/* Fake top app bar */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="ml-2 text-xs font-bold text-white drop-shadow">
                    LearnWithAI Dashboard • Active Session
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-400/40">
                    <Flame className="h-3.5 w-3.5 fill-amber-400" /> 7 Day Streak
                  </span>
                  <span className="flex items-center gap-1 text-sky-300 font-bold bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-400/40">
                    <Award className="h-3.5 w-3.5" /> 1,250 XP
                  </span>
                </div>
              </div>

              {/* Sample Dashboard Grid Cards - Crystal Clear */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Continue Learning card */}
                <div className="rounded-xl border border-sky-400/40 bg-white/[0.05] p-4 shadow-xl hover:bg-white/[0.08] transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    Continue Learning
                  </span>
                  <h4 className="mt-1 font-bold text-white text-sm drop-shadow">
                    Python for Data Science & Neural Computing
                  </h4>
                  <p className="mt-1 text-xs text-slate-200">Module 2: Dictionaries & Sets</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-semibold text-white mb-1">
                      <span>Progress</span>
                      <span className="text-sky-300 font-bold">64%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden border border-white/10">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: "64%" }} />
                    </div>
                  </div>
                  <Link
                    href="/courses"
                    className="mt-4 block text-center rounded-lg bg-sky-500 py-1.5 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-colors shadow-lg"
                  >
                    Resume Module →
                  </Link>
                </div>

                {/* Today's Goals */}
                <div className="rounded-xl border border-white/20 bg-white/[0.05] p-4 shadow-xl hover:bg-white/[0.08] transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Daily Schedule
                  </span>
                  <h4 className="mt-1 font-bold text-white text-sm drop-shadow">Today&apos;s Milestones</h4>
                  <ul className="mt-2 space-y-2 text-xs text-slate-100">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm" />
                      <span>Complete NumPy Quiz (10 Qs)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-sm" />
                      <span>Watch Pandas Lecture (15m)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-sm" />
                      <span>Revise 12 Due Flashcards</span>
                    </li>
                  </ul>
                  <Link
                    href="/quizzes"
                    className="mt-4 block text-center rounded-lg border border-white/30 bg-black/30 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Start Quick Quiz
                  </Link>
                </div>

                {/* Study Buddy Match */}
                <div className="rounded-xl border border-emerald-400/40 bg-white/[0.05] p-4 shadow-xl hover:bg-white/[0.08] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Study Buddy Match
                    </span>
                    <span className="rounded-full bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/40">
                      96% Match
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                      alt="Sarah Lin"
                      className="h-9 w-9 rounded-full border border-emerald-400 bg-slate-900 shadow-sm"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white">Sarah Lin</h5>
                      <p className="text-[10px] text-slate-300">MIT • Python & Neural Networks</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-100 leading-snug">
                    &ldquo;Studying array broadcasting today. Let&apos;s practice questions together!&rdquo;
                  </p>
                  <Link
                    href="/messages"
                    className="mt-3 block text-center rounded-lg border border-emerald-400/60 bg-emerald-950/40 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60"
                  >
                    Send Message
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Phase AI Learning Journey - Crystal Clear Transparent */}
      <section className="py-20 border-t border-white/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-300 bg-black/40 px-3.5 py-1.5 rounded-full border border-sky-400/40 shadow-md">
              Interactive Scrollytelling Journey
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              How AI Powers Your Learning in 4 Phases
            </h2>
            <p className="mt-3 text-sm text-slate-100 leading-relaxed drop-shadow">
              As you scroll across LearnWithAI, our global 3D mascot animation charts your academic evolution through four key milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px] hover:border-sky-400 hover:bg-white/[0.1] transition-all hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-950/60 text-sky-400 font-extrabold text-sm mb-4 border border-sky-400/50 shadow-sm">
                01
              </div>
              <h4 className="font-bold text-white text-base drop-shadow">Goal Analysis & Syllabus</h4>
              <p className="text-xs text-slate-100 mt-2 leading-relaxed drop-shadow">
                Enter any subject or exam objective. The AI analyzes prerequisites, synthesizes modules, and constructs a structured curriculum.
              </p>
              <div className="mt-4 text-[11px] font-bold text-sky-300">Frames 001 - 036 • Discovery</div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px] hover:border-blue-400 hover:bg-white/[0.1] transition-all hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950/60 text-blue-400 font-extrabold text-sm mb-4 border border-blue-400/50 shadow-sm">
                02
              </div>
              <h4 className="font-bold text-white text-base drop-shadow">Multimodal Videos & Media</h4>
              <p className="text-xs text-slate-100 mt-2 leading-relaxed drop-shadow">
                Connects live educational tutorials from YouTube with zero-key free search, perfectly matched to your comprehension level.
              </p>
              <div className="mt-4 text-[11px] font-bold text-blue-300">Frames 037 - 074 • Ingestion</div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px] hover:border-violet-400 hover:bg-white/[0.1] transition-all hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-950/60 text-violet-400 font-extrabold text-sm mb-4 border border-violet-400/50 shadow-sm">
                03
              </div>
              <h4 className="font-bold text-white text-base drop-shadow">Active Recall & Mastery</h4>
              <p className="text-xs text-slate-100 mt-2 leading-relaxed drop-shadow">
                Practice with adaptive quizzes, 3D interactive flashcards, and spaced repetition to cement concepts into long-term memory.
              </p>
              <div className="mt-4 text-[11px] font-bold text-violet-300">Frames 075 - 111 • Mastery</div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px] hover:border-emerald-400 hover:bg-white/[0.1] transition-all hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/60 text-emerald-400 font-extrabold text-sm mb-4 border border-emerald-400/50 shadow-sm">
                04
              </div>
              <h4 className="font-bold text-white text-base drop-shadow">Peer Synergy & Buddies</h4>
              <p className="text-xs text-slate-100 mt-2 leading-relaxed drop-shadow">
                Discover matched peers who share your goals, schedule virtual group sessions, and keep each other accountable.
              </p>
              <div className="mt-4 text-[11px] font-bold text-emerald-300">Frames 112 - 148 • Synergy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Cards Section - Crystal Clear Transparent */}
      <section id="features" className="py-20 border-t border-white/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-300 bg-black/40 px-3.5 py-1.5 rounded-full border border-sky-400/40 shadow-md">
              Built for Student Excellence
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Everything You Need to Learn Smarter
            </h2>
            <p className="mt-3 text-base text-slate-100 leading-relaxed drop-shadow">
              Experience an integrated learning ecosystem where course creation, video curation, active recall, and collaborative study buddies work together in harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.title}
                  href={f.href}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px] hover:border-sky-400 hover:bg-white/[0.1] transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${f.color} text-slate-950 shadow-md group-hover:scale-105 transition-transform font-bold`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider bg-black/40 border border-sky-400/40 px-2.5 py-1 rounded-md">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors drop-shadow">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-200 leading-relaxed drop-shadow">
                      {f.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-sky-300 group-hover:text-sky-200">
                    <span>Explore feature</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works High Level - Crystal Clear Transparent */}
      <section className="py-20 border-t border-white/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              The 4-Step Mastery Cycle
            </h2>
            <p className="mt-2 text-sm text-slate-100 drop-shadow">
              How LearnWithAI replaces disorganized learning with deliberate mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px]">
              <span className="text-2xl font-black text-sky-400">01</span>
              <h4 className="mt-2 text-base font-bold text-white drop-shadow">Enter Your Goal</h4>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed drop-shadow">
                Specify your topic, current skill level, and daily time budget.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px]">
              <span className="text-2xl font-black text-sky-400">02</span>
              <h4 className="mt-2 text-base font-bold text-white drop-shadow">Generate Curriculum</h4>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed drop-shadow">
                Receive custom modules, topics, and verified educational video pairings.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px]">
              <span className="text-2xl font-black text-sky-400">03</span>
              <h4 className="mt-2 text-base font-bold text-white drop-shadow">Learn & Active Recall</h4>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed drop-shadow">
                Ask AI questions, solve step-by-step doubts, and test yourself with quizzes.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px]">
              <span className="text-2xl font-black text-sky-400">04</span>
              <h4 className="mt-2 text-base font-bold text-white drop-shadow">Revise & Study Together</h4>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed drop-shadow">
                Reinforce weak spots with spaced repetition and study with matched peers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Crystal Clear Transparent */}
      <section className="py-20 border-t border-white/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Loved by Students & Self-Learners
            </h2>
            <p className="mt-2 text-sm text-slate-100 drop-shadow">
              Here is what students say after switching to LearnWithAI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px]">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-100 leading-relaxed italic drop-shadow">
                &ldquo;The study buddy matching was a game changer for my FAANG interview prep. I was matched with David, and we completed binary tree questions together every evening.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                  alt="Sarah"
                  className="h-8 w-8 rounded-full border border-sky-400 bg-slate-900"
                />
                <div>
                  <h5 className="text-xs font-bold text-white">Sarah Lin</h5>
                  <p className="text-[10px] text-slate-300">MIT • CS Senior</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px]">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-100 leading-relaxed italic drop-shadow">
                &ldquo;Smart Revision detected that I was consistently dropping points on recursion. It automatically scheduled spaced flashcards that finally made the concept click!&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=David"
                  alt="David"
                  className="h-8 w-8 rounded-full border border-sky-400 bg-slate-900"
                />
                <div>
                  <h5 className="text-xs font-bold text-white">David Kim</h5>
                  <p className="text-[10px] text-slate-300">UC Berkeley • Undergrad</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-[1px]">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-100 leading-relaxed italic drop-shadow">
                &ldquo;The video recommendations filter out all the clickbait fluff and link directly to high-yield lectures matched to my exact syllabus module.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amina"
                  alt="Amina"
                  className="h-8 w-8 rounded-full border border-sky-400 bg-slate-900"
                />
                <div>
                  <h5 className="text-xs font-bold text-white">Amina Al-Mansoor</h5>
                  <p className="text-[10px] text-slate-300">UW • Software Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Final CTA - Crystal Clear Transparent */}
      <section className="py-20 border-t border-white/10 bg-transparent text-white relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Ready to Accelerate Your Learning?
          </h2>
          <p className="mt-4 text-base text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Join thousands of students learning smarter with tailored AI courses, active recall practice, spaced revision, and compatible study buddies.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-sky-500/30 hover:bg-sky-400 active:scale-95 transition-all"
            >
              <span>Build My Personalized Course</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-black/40 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm"
            >
              <span>Enter Student Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
