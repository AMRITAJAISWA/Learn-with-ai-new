"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  PlaySquare,
  Users,
  RotateCcw,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  FileQuestion,
  BarChart2,
  ChevronRight,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";
import { store } from "@/lib/db/store";
import { generatePersonalizedInsights } from "@/lib/ai/recommendationEngine";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [askInput, setAskInput] = useState("");

  const activeCourse = store.courses[0];
  const revisionItems = store.revisionItems.slice(0, 3);
  const studyBuddies = store.studyBuddies.slice(0, 2);
  const studySessions = store.studySessions;
  const quizAttempt = store.quizAttempts[0];

  const insights = generatePersonalizedInsights({
    learningGoal: user?.learningGoals || "Python for Data Science",
    skillLevel: user?.skillLevel || "Intermediate",
    completedTopicCount: 8,
    weakTopics: quizAttempt?.weakTopics || ["Memory Allocation & Generators"],
    recentQuizScore: quizAttempt?.score,
    studyStreak: user?.streakDays || 7,
  });

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(askInput)}`);
  };

  return (
    <div className="space-y-8">
      {/* Greeting Header & Hero Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-gradient-to-r from-white via-sky-50/40 to-blue-50/30 p-6 sm:p-8 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/80 px-2.5 py-0.5 text-xs font-bold text-sky-800">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <span>AI Learning Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Hello, {user?.name || "Aarav"} 👋
          </h1>
          <p className="text-xs text-slate-500">
            "What do you want to learn today?" • Daily target: {user?.preferredStudyDuration || 60} minutes
          </p>
        </div>

        {/* Ask AI Search Box */}
        <form onSubmit={handleAskSubmit} className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder="Ask AI or start learning (e.g. explain recursion)..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-24 text-xs text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Ask AI
          </button>
        </form>
      </div>

      {/* AI Insights Bar */}
      {insights.length > 0 && (
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-yellow-50/80 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white flex-shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  AI Recommendation
                </span>
                <h4 className="text-xs font-bold text-slate-900">{insights[0].title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{insights[0].description}</p>
              </div>
            </div>
            <Link
              href={insights[0].actionHref}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 shadow-sm flex-shrink-0"
            >
              <span>{insights[0].actionText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Top 3 Metric Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Learning Streak</span>
            <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{user?.streakDays || 7}</span>
            <span className="text-xs font-bold text-emerald-600">+1 today</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Keep it going! Revise 1 topic to protect streak.</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Mastery XP</span>
            <Award className="h-5 w-5 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{user?.totalXP || 1250}</span>
            <span className="text-xs font-bold text-sky-600">Level 4 Scholar</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">250 XP until next achievement badge.</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Diagnostics Accuracy</span>
            <BarChart2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">75%</span>
            <span className="text-xs font-bold text-slate-400">Recent Quizzes</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Strongest: Dictionaries • Focus: Generators</p>
        </div>
      </div>

      {/* Main Grid: Continue Learning + Today's Revision */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Learning & Action Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Course Card */}
          {activeCourse && (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                      Primary Course
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{activeCourse.title}</h3>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                  {activeCourse.completionPct}% Complete
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {activeCourse.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Current Module: {activeCourse.modules[1]?.title || "Core Data Structures"}</span>
                  <span>{activeCourse.completionPct}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all"
                    style={{ width: `${activeCourse.completionPct}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/courses/${activeCourse.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 active:scale-95 transition-all"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/quizzes"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Take Topic Quiz</span>
                </Link>

                <Link
                  href="/flashcards"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <span>Practice Flashcards</span>
                </Link>
              </div>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/assistant"
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-sky-300 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:scale-105 transition-transform mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">AI Tutor</span>
              <span className="text-[10px] text-slate-400">Interactive</span>
            </Link>

            <Link
              href="/quizzes"
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-sky-300 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform mb-2">
                <FileQuestion className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Quiz Center</span>
              <span className="text-[10px] text-slate-400">Test Mastery</span>
            </Link>

            <Link
              href="/videos"
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-sky-300 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform mb-2">
                <PlaySquare className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Edu Videos</span>
              <span className="text-[10px] text-slate-400">Curated YT</span>
            </Link>

            <Link
              href="/study-buddies"
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-sky-300 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform mb-2">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Study Buddies</span>
              <span className="text-[10px] text-slate-400">Match & Chat</span>
            </Link>
          </div>

          {/* Upcoming Shared Study Sessions */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Study Sessions</h3>
              </div>
              <Link href="/study-sessions" className="text-xs font-semibold text-sky-600 hover:underline">
                Schedule Session +
              </Link>
            </div>

            <div className="space-y-3">
              {studySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:border-sky-200 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{session.title}</h4>
                      <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800">
                        {session.durationMin} mins
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Goal: <span className="text-slate-700">{session.goal}</span>
                    </p>
                    <div className="text-[10px] text-slate-400">
                      Participants: {session.participants.join(", ")}
                    </div>
                  </div>

                  <Link
                    href="/messages"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-sky-600" />
                    <span>Open Chat</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Revision & Study Buddy Match */}
        <div className="space-y-6">
          {/* Today's Revision Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">Today's Revision</h3>
              </div>
              <Link href="/revision" className="text-xs font-semibold text-sky-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {revisionItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-2 hover:border-violet-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900">{item.topicTitle}</h5>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.difficulty === "Hard"
                          ? "bg-rose-100 text-rose-700"
                          : item.difficulty === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Course: {item.courseTitle}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href="/revision"
                      className="rounded-lg bg-slate-900 px-3 py-1 text-[10px] font-bold text-white hover:bg-slate-800"
                    >
                      Review Now
                    </Link>
                    <Link
                      href="/flashcards"
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Flashcards
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Buddy Suggestions */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Suggested Buddies</h3>
              </div>
              <Link href="/study-buddies" className="text-xs font-semibold text-sky-600 hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-4">
              {studyBuddies.map((buddy) => (
                <div
                  key={buddy.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={buddy.avatarUrl}
                        alt={buddy.name}
                        className="h-9 w-9 rounded-full border border-slate-200 bg-white"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{buddy.name}</h5>
                        <p className="text-[10px] text-slate-500">{buddy.college}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {buddy.compatibilityPct}% Match
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                    "{buddy.about}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/study-buddies/${buddy.id}`}
                      className="flex-1 text-center rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/messages"
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      Message
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
