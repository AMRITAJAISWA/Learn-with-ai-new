import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  BookOpen,
  PlaySquare,
  Users,
  Bot,
  FileQuestion,
  BarChart3,
  RotateCcw,
  Layers,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function FeaturesPage() {
  const deepFeatures = [
    {
      title: "AI Course Generator",
      subtitle: "Personalized Curricula in Seconds",
      desc: "Our neural curriculum architect takes your input (topic, skill level, daily time budget, target milestone) and maps out a structured syllabus complete with modules, topics, prerequisites, and estimated completion times.",
      icon: BookOpen,
      color: "from-blue-600 to-sky-500",
      bullets: [
        "Dynamic topic estimation and modular scaffolding",
        "Adaptive pacing based on beginner, intermediate, or advanced skills",
        "Persistent cloud storage with editable topic statuses",
      ],
      href: "/courses/new",
    },
    {
      title: "AI Video Recommendation",
      subtitle: "Verified Educational Content Without Fluff",
      desc: "Queries the YouTube Data API for lectures and visual explanations matched to your syllabus topic. Uses AI filtering to prioritize conceptual depth and eliminate clickbait.",
      icon: PlaySquare,
      color: "from-rose-500 to-amber-500",
      bullets: [
        "Search filtered by topic, skill level, and course context",
        "AI explanations of why each lecture is valuable",
        "Filters for short (<15m) vs deep-dive (>45m) formats",
      ],
      href: "/videos",
    },
    {
      title: "Study Buddy Matching",
      subtitle: "Find Peers Who Learn Like You",
      desc: "Calculates mathematical compatibility scores between students based on common courses, skill tiers, schedule overlaps, and shared interests. Collaborate in real-time study sessions.",
      icon: Users,
      color: "from-indigo-600 to-blue-500",
      bullets: [
        "Transparent match score algorithm (e.g. 96% match)",
        "Schedule alignment (Morning, Afternoon, Evening, Night)",
        "Integrated peer chat with 'Ask AI' integration",
      ],
      href: "/study-buddies",
    },
    {
      title: "AI Learning Assistant & Tutor",
      subtitle: "Contextual Doubts Solved Instantly",
      desc: "An empathetic, pedagogical tutor that knows exactly which course and topic you are working on. Features one-click shortcuts: 'Explain Simply', 'Give Example', 'Summarize', and 'Quiz Me'.",
      icon: Bot,
      color: "from-cyan-500 to-teal-500",
      bullets: [
        "Context-aware memory tied to your active module",
        "Simple analogies for complex theoretical mechanisms",
        "Clean markdown formatting with syntax-highlighted code",
      ],
      href: "/assistant",
    },
    {
      title: "AI Quiz & Test Generator",
      subtitle: "Instant Active Recall & Weak-Spot Diagnostics",
      desc: "Generate targeted MCQs and conceptual true/false questions on any topic. Submissions are scored immediately, highlighting weak areas and updating your revision schedule.",
      icon: FileQuestion,
      color: "from-amber-500 to-orange-500",
      bullets: [
        "Configurable difficulty and question count",
        "In-depth answer explanations for every question",
        "Automatic push of weak topics into Smart Revision",
      ],
      href: "/quizzes",
    },
    {
      title: "Smart Spaced Revision",
      subtitle: "Supercharge Long-Term Memory Retention",
      desc: "Implements a scientifically grounded spaced-repetition scheduler. Tracks topic intervals, difficulty ratings, and performance to notify you precisely when a topic is due for review.",
      icon: RotateCcw,
      color: "from-violet-600 to-purple-500",
      bullets: [
        "Spaced repetition algorithms tailored to quiz scores",
        "One-click 'Review Now', 'Mark as Known', and 'Need More Practice'",
        "Daily revision queue on your main dashboard",
      ],
      href: "/revision",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Deep-Dive Capabilities
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Platform Features
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Every tool in LearnWithAI is crafted with one mission: empowering students to learn faster, retain deeper, and stay motivated through collaboration.
            </p>
          </div>

          <div className="space-y-12">
            {deepFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={feat.title}
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-center gap-8 lg:gap-12 rounded-3xl border border-slate-200/80 bg-white p-8 lg:p-12 shadow-sm`}
                >
                  <div className="flex-1 space-y-4">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-md`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-sky-600">
                      {feat.subtitle}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {feat.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-slate-700">
                      {feat.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2">
                      <Link
                        href={feat.href}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
                      >
                        <span>Try {feat.title}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 rounded-2xl border border-slate-100 bg-slate-50 p-6 flex items-center justify-center min-h-[220px]">
                    <div className="text-center space-y-2">
                      <Icon className="h-12 w-12 text-slate-400 mx-auto" />
                      <h4 className="text-xs font-bold text-slate-700">{feat.title}</h4>
                      <p className="text-[11px] text-slate-400 max-w-xs">
                        Interactive component live in student dashboard
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
