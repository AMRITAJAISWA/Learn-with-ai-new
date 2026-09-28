"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, BookOpen, Clock, Target, Calendar, CheckCircle2 } from "lucide-react";
import { generateCourseWithAI } from "@/lib/ai/courseGenerator";
import { store } from "@/lib/db/store";

export default function NewCourseGeneratorPage() {
  const router = useRouter();

  const [goal, setGoal] = useState("Python for Data Science & Neural Computing");
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [availableTime, setAvailableTime] = useState("1 hour/day");
  const [duration, setDuration] = useState("30 days");
  const [target, setTarget] = useState("Interview preparation");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch("/api/courses/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          skillLevel,
          availableTime,
          duration,
          target,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.course) {
        throw new Error(data.error || "Failed to generate course");
      }

      const course = data.course;
      const exists = store.courses.some((c) => c.id === course.id);
      if (!exists) {
        store.courses.unshift(course);
      }

      // Add to revision
      store.revisionItems.unshift({
        id: `rev_${Date.now()}`,
        topicTitle: course.modules[0]?.topics[0]?.title || "Fundamentals",
        courseTitle: course.title,
        lastStudied: new Date().toISOString(),
        nextRevisionAt: new Date().toISOString(),
        intervalDays: 1,
        difficulty: "Medium",
        performance: 70,
        needsPractice: false,
      });

      router.push(`/courses/${course.id}`);
    } catch (err) {
      console.error("Failed to generate course:", err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            AI Architecture
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            Google Gemini API
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          AI Course Outline Generator
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dynamically generate personalized course outlines powered by Google Gemini API. Structured by topic name and in-depth definition (pure concepts, no code).
        </p>
      </div>

      <form
        onSubmit={handleGenerate}
        className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* Goal */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Learning Goal / Subject
          </label>
          <input
            type="text"
            required
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Learn Python for Data Science or Graph Algorithms"
            className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Skill Level & Available Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Skill Level
            </label>
            <select
              value={skillLevel}
              onChange={(e) =>
                setSkillLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced")
              }
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 bg-white"
            >
              <option value="Beginner">Beginner (Ground up)</option>
              <option value="Intermediate">Intermediate (Have basics)</option>
              <option value="Advanced">Advanced (Deep optimization)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Available Time per Day
            </label>
            <select
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 bg-white"
            >
              <option value="15 minutes/day">15 minutes/day</option>
              <option value="30 minutes/day">30 minutes/day</option>
              <option value="1 hour/day">1 hour/day</option>
              <option value="2 hours/day">2 hours/day</option>
              <option value="3+ hours/day">3+ hours/day</option>
            </select>
          </div>
        </div>

        {/* Duration & Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 bg-white"
            >
              <option value="7 days">7 days</option>
              <option value="14 days">14 days</option>
              <option value="30 days">30 days</option>
              <option value="60 days">60 days</option>
              <option value="90 days">90 days</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Outcome
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 bg-white"
            >
              <option value="University exam">University exam</option>
              <option value="Interview preparation">Interview preparation</option>
              <option value="Skill development">Skill development</option>
              <option value="Project development">Project development</option>
              <option value="Certification">Certification</option>
              <option value="Personal learning">Personal learning</option>
            </select>
          </div>
        </div>

        {/* Generate CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Powered by LearnWithAI Neural Curriculum Engine
          </span>

          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-sky-600/20 hover:from-sky-500 hover:to-blue-500 active:scale-95 transition-all"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Generating Course Structure...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Personalized Course</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
