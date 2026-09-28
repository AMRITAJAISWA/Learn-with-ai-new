"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileQuestion,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Play,
  Layers,
} from "lucide-react";
import { store, QuizData } from "@/lib/db/store";

export default function QuizCenterPage() {
  const router = useRouter();

  const [topic, setTopic] = useState("Binary Trees & Recursive Traversals");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [questionCount, setQuestionCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  const availableQuizzes = store.quizzes;
  const recentAttempts = store.quizAttempts;

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          questionCount,
        }),
      });

      const data = await res.json();
      if (data.success && data.quiz) {
        const newQuiz = data.quiz;
        const exists = store.quizzes.some((q) => q.id === newQuiz.id);
        if (!exists) {
          store.quizzes.unshift(newQuiz);
        }
        router.push(`/quizzes/${newQuiz.id}`);
      } else {
        throw new Error(data.error || "Failed to generate quiz");
      }
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
            Active Recall & Mastery
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Quiz & Diagnostic Test Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate custom tests on any course, module, or topic to benchmark knowledge and pinpoint weak areas.
          </p>
        </div>
      </div>

      {/* Generator Card */}
      <form
        onSubmit={handleGenerateQuiz}
        className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Generate New Diagnostic Quiz
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Topic / Concept
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Python Dictionaries or BFS"
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Difficulty Tier
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 bg-white"
            >
              <option value="Beginner">Beginner (Foundational)</option>
              <option value="Intermediate">Intermediate (Standard)</option>
              <option value="Advanced">Advanced (Edge Cases & Big-O)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 bg-white"
            >
              <option value={4}>4 Questions (Quick Check)</option>
              <option value={8}>8 Questions (Standard Test)</option>
              <option value={12}>12 Questions (Deep Exam Prep)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            Automatically calculates accuracy and detects weak topics for smart revision.
          </span>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-7 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 active:scale-95 transition-all"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Synthesizing Test...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate & Start Quiz</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Available Quizzes & Recent Attempts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Ready Quizzes */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileQuestion className="h-4 w-4 text-amber-500" />
            <span>Ready Diagnostic Quizzes</span>
          </h3>

          <div className="space-y-3">
            {availableQuizzes.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:border-amber-200 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{q.title}</h4>
                    <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {q.questions.length} Questions • Topic: {q.topicTitle}
                  </p>
                </div>

                <Link
                  href={`/quizzes/${q.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <Play className="h-3 w-3" />
                  <span>Start</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Performance & Weak Topics */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="h-4 w-4 text-sky-600" />
            <span>Recent Test Diagnostics</span>
          </h3>

          {recentAttempts.length > 0 ? (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{attempt.quizTitle}</h4>
                    <span className="text-xs font-black text-emerald-600">
                      {attempt.score}/{attempt.totalQuestions} ({attempt.accuracyPct}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {attempt.timeSpentSec}s taken
                    </span>
                  </div>

                  {attempt.weakTopics && attempt.weakTopics.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                        Detected Weak Areas:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {attempt.weakTopics.map((w, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No attempts yet. Take a quiz to generate diagnostics.</p>
          )}
        </div>
      </div>
    </div>
  );
}
