"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";
import { store, RevisionItemData } from "@/lib/db/store";

export default function SmartRevisionPage() {
  const [revisionItems, setRevisionItems] = useState<RevisionItemData[]>(
    store.revisionItems
  );

  const handleMarkKnown = (id: string) => {
    const updated = revisionItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          performance: Math.min(100, item.performance + 15),
          intervalDays: item.intervalDays * 2,
          needsPractice: false,
          nextRevisionAt: new Date(
            Date.now() + item.intervalDays * 2 * 86400000
          ).toISOString(),
        };
      }
      return item;
    });
    setRevisionItems(updated);
    store.revisionItems = updated;
  };

  const handleNeedPractice = (id: string) => {
    const updated = revisionItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          performance: Math.max(30, item.performance - 15),
          intervalDays: 1,
          needsPractice: true,
          nextRevisionAt: new Date(Date.now() + 86400000).toISOString(),
        };
      }
      return item;
    });
    setRevisionItems(updated);
    store.revisionItems = updated;
  };

  const dueToday = revisionItems.filter(
    (i) => new Date(i.nextRevisionAt) <= new Date(Date.now() + 3600000 * 6)
  );
  const upcoming = revisionItems.filter(
    (i) => new Date(i.nextRevisionAt) > new Date(Date.now() + 3600000 * 6)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
          Scientifically Grounded Spaced Repetition
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
          Smart Revision System
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Automatically schedules review checkpoints right before your memory retention decays.
        </p>
      </div>

      {/* Due Today Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-rose-500" />
            <span>Due for Review Today ({dueToday.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            High priority for memory retention
          </span>
        </div>

        {dueToday.length > 0 ? (
          <div className="space-y-3">
            {dueToday.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-rose-200/80 bg-gradient-to-r from-white via-rose-50/20 to-orange-50/20 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.topicTitle}
                    </h3>
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
                    {item.needsPractice && (
                      <span className="rounded-md bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5">
                        Focus Needed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Course: {item.courseTitle}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Performance: {item.performance}%</span>
                    <span>•</span>
                    <span>Interval: {item.intervalDays} days</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:self-center">
                  <Link
                    href={`/assistant?q=Help me revise ${encodeURIComponent(item.topicTitle)} with a 3-bullet summary and practice question`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Review Now</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleMarkKnown(item.id)}
                    className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    Mark as Known
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNeedPractice(item.id)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                  >
                    Need Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 text-center text-xs text-emerald-800">
            🎉 All caught up for today! No topics currently due for immediate revision.
          </div>
        )}
      </div>

      {/* Upcoming Scheduled Revisions */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-violet-500" />
          <span>Upcoming Scheduled Revisions ({upcoming.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{item.topicTitle}</h4>
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                  Next in {item.intervalDays}d
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Course: {item.courseTitle}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Mastery: {item.performance}%
                </span>
                <Link
                  href="/flashcards"
                  className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Practice Flashcards</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
