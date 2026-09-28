"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
  Calendar,
  Layers,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";
import { generateCourseWithAI } from "@/lib/ai/courseGenerator";
import { store } from "@/lib/db/store";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("Python for Data Science & AI");
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [timeDaily, setTimeDaily] = useState("1 hour/day");
  const [target, setTarget] = useState("Interview preparation");
  const [duration, setDuration] = useState("30 days");
  const [isGenerating, setIsGenerating] = useState(false);

  const predefinedGoals = [
    "Python for Data Science & AI",
    "Data Structures & Algorithms",
    "Full-Stack Web Development",
    "Machine Learning & Deep Neural Nets",
    "Computer Networks & Systems",
    "Discrete Mathematics & Logic",
    "Cloud Architecture & DevOps",
  ];

  const skillLevels: ("Beginner" | "Intermediate" | "Advanced")[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  const dailyTimeOptions = [
    "15 minutes/day",
    "30 minutes/day",
    "1 hour/day",
    "2 hours/day",
    "3+ hours/day",
  ];

  const targetOptions = [
    "University exam",
    "Interview preparation",
    "Skill development",
    "Project development",
    "Certification",
    "Personal learning",
  ];

  const durationOptions = [
    "7 days",
    "14 days",
    "30 days",
    "60 days",
    "90 days",
  ];

  const handleFinish = async () => {
    setIsGenerating(true);
    updateProfile({
      learningGoals: `${goal} (${target})`,
      skillLevel,
      preferredStudyDuration: timeDaily.includes("15") ? 15 : timeDaily.includes("30") ? 30 : 60,
    });

    try {
      const newCourse = await generateCourseWithAI({
        goal,
        skillLevel,
        availableTime: timeDaily,
        duration,
        target,
      });

      // Save course to store
      store.courses.unshift(newCourse);

      // Add to revision
      store.revisionItems.unshift({
        id: `rev_${Date.now()}`,
        topicTitle: newCourse.modules[0]?.topics[0]?.title || "Core Fundamentals",
        courseTitle: newCourse.title,
        lastStudied: new Date().toISOString(),
        nextRevisionAt: new Date().toISOString(),
        intervalDays: 1,
        difficulty: "Medium",
        performance: 70,
        needsPractice: false,
      });

      router.push(`/courses/${newCourse.id}`);
    } catch (e) {
      console.error(e);
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span>Step {step} of 5</span>
          <span className="text-sky-600 font-semibold">{Math.round((step / 5) * 100)}% Completed</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl">
        {/* STEP 1: What do you want to learn? */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Step 1: Your Learning Objective
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                What do you want to learn?
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Select a popular track or type your custom learning goal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {predefinedGoals.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`text-left rounded-xl p-3 text-xs font-semibold border transition-all ${
                    goal === g
                      ? "border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom Topic / Specialized Field
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Distributed Consensus in Go"
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Current Skill Level */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Step 2: Baseline Proficiency
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                What is your current skill level?
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                This calibrates the pacing and difficulty of the AI curriculum.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {skillLevels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSkillLevel(lvl)}
                  className={`flex items-center justify-between rounded-2xl p-4 border text-left transition-all ${
                    skillLevel === lvl
                      ? "border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold">{lvl}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lvl === "Beginner" && "Starting from scratch. Need fundamentals, mental models, and step-by-step guidance."}
                      {lvl === "Intermediate" && "Have coded before or taken classes. Ready for data structures, patterns, and labs."}
                      {lvl === "Advanced" && "Solid foundations. Want high-throughput optimization, system design, and edge cases."}
                    </p>
                  </div>
                  {skillLevel === lvl && (
                    <CheckCircle2 className="h-5 w-5 text-sky-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Available Daily Study Time */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Step 3: Daily Cadence
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                How much time can you spend learning?
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                We pace topic durations so you can finish consistently without burning out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dailyTimeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeDaily(t)}
                  className={`flex items-center gap-3 rounded-2xl p-4 border text-left transition-all ${
                    timeDaily === t
                      ? "border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <Clock className={`h-5 w-5 ${timeDaily === t ? "text-sky-600" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Target Outcome */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Step 4: Ultimate Milestone
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                What is your target?
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                The AI structures the capstone and quiz challenges around this target.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {targetOptions.map((tgt) => (
                <button
                  key={tgt}
                  type="button"
                  onClick={() => setTarget(tgt)}
                  className={`flex items-center gap-3 rounded-2xl p-4 border text-left transition-all ${
                    target === tgt
                      ? "border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <Target className={`h-5 w-5 ${target === tgt ? "text-sky-600" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">{tgt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Learning Duration */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Step 5: Planned Duration
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                How long do you want to learn?
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Choose your total timeframe for completing this curriculum.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {durationOptions.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={`flex items-center justify-center gap-2 rounded-2xl p-4 border text-center transition-all ${
                    duration === dur
                      ? "border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <Calendar className={`h-4 w-4 ${duration === dur ? "text-sky-600" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">{dur}</span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50/70 p-4">
              <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <span>Ready to synthesize your personal roadmap</span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Goal: <strong className="text-slate-900">{goal}</strong> • Level: <strong className="text-slate-900">{skillLevel}</strong> • Time: <strong className="text-slate-900">{timeDaily}</strong> • Target: <strong className="text-slate-900">{target}</strong> ({duration})
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleFinish}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-sky-600/20 hover:from-sky-500 hover:to-blue-500 active:scale-95 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Building Personalized Course...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Build My Personalized Course</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
