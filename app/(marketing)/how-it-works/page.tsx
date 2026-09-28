import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  BrainCircuit,
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
  PlayCircle,
  Bot,
  RotateCcw,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Set Goals & Preferences",
      desc: "Tell us what you want to learn, your current skill tier (Beginner, Intermediate, Advanced), daily available time, and target milestone.",
      icon: BrainCircuit,
    },
    {
      num: "02",
      title: "Neural Course Generation",
      desc: "Our AI constructs a personalized modular curriculum with sequenced topics, prerequisites, and estimated completion times. No two courses are identical.",
      icon: Sparkles,
    },
    {
      num: "03",
      title: "Contextual Video Curation",
      desc: "For every single topic, LearnWithAI fetches verified educational lectures from YouTube, filtered for depth, relevance, and zero clickbait.",
      icon: PlayCircle,
    },
    {
      num: "04",
      title: "Active Learning & AI Tutor",
      desc: "Learn actively with your dedicated AI Tutor. Explore deep conceptual analogies, ask questions, and reinforce your understanding at your own pace.",
      icon: Bot,
    },
    {
      num: "05",
      title: "Diagnostic Quizzes & Weak Spot Tracking",
      desc: "Test your retention with AI-generated quizzes. Weak topics are automatically flagged and queued for spaced-repetition revision.",
      icon: Layers,
    },
    {
      num: "06",
      title: "Smart Spaced Revision",
      desc: "Long-term memory is cemented through scheduled flashcard reviews and spaced-repetition checklists that alert you right before you forget.",
      icon: RotateCcw,
    },
    {
      num: "07",
      title: "Study Buddy Synergy",
      desc: "Connect with students studying the same concepts on compatible schedules. Share study sessions, exchange notes, and stay accountable.",
      icon: Users,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              The Architecture of Learning
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              How LearnWithAI Works
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              From your initial goal to continuous revision and peer collaboration, here is the complete journey of an empowered learner.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center spine */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-sky-200 -translate-x-1/2" />

            <div className="space-y-12">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={step.num}
                    className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Node on spine */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-sky-600 text-xs font-bold text-white shadow-md z-10">
                      {step.num}
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-1/2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-sky-300 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          Step {step.num}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Empty spacing opposite side */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
            >
              <span>Begin Your Custom Journey</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
