"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Plus,
  Users,
  Sparkles,
  Check,
} from "lucide-react";
import { store, StudySessionData } from "@/lib/db/store";
import { useAuth } from "@/lib/auth/authContext";

export default function StudySessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySessionData[]>(store.studySessions);
  const [showModal, setShowModal] = useState(false);

  // New session form state
  const [title, setTitle] = useState("Array Broadcasting & Matrix Math Review");
  const [subject, setSubject] = useState("Python for Data Science");
  const [topic, setTopic] = useState("NumPy Operations");
  const [durationMin, setDurationMin] = useState(60);
  const [goal, setGoal] = useState("Complete 15 practice problems & review weak areas.");
  const [participant, setParticipant] = useState("Sarah Lin");

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: StudySessionData = {
      id: `session_${Date.now()}`,
      title,
      subject,
      topic,
      scheduledAt: new Date(Date.now() + 3600000 * 3).toISOString(),
      durationMin,
      goal,
      participants: [user?.name || "Aarav Patel", participant],
      isCompleted: false,
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    store.studySessions = updated;
    setShowModal(false);
  };

  const handleToggleComplete = (id: string) => {
    const updated = sessions.map((s) => {
      if (s.id === id) {
        return { ...s, isCompleted: !s.isCompleted };
      }
      return s;
    });
    setSessions(updated);
    store.studySessions = updated;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
            Collaborative Accountability
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Shared Study Sessions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule dedicated peer sessions with specific topics, target goals, and completion tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Study Session</span>
        </button>
      </div>

      {/* Modal for Creating Session */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreateSession}
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Schedule Collaborative Session
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Session Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject / Course
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  required
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Invite Study Buddy
                </label>
                <select
                  value={participant}
                  onChange={(e) => setParticipant(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs bg-white"
                >
                  <option value="Sarah Lin">Sarah Lin (96% match)</option>
                  <option value="David Kim">David Kim (91% match)</option>
                  <option value="Amina Al-Mansoor">Amina Al-Mansoor (88% match)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Concrete Session Goal
              </label>
              <textarea
                rows={2}
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Confirm & Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Session Cards List */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`rounded-3xl border p-6 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              session.isCompleted
                ? "border-slate-200 bg-slate-50/70 opacity-75"
                : "border-slate-200/90 bg-white hover:border-sky-300"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-sky-50 text-sky-700 font-bold px-2 py-0.5 text-[10px] border border-sky-200">
                  {session.subject}
                </span>
                <span className="text-[10px] text-slate-400">• Topic: {session.topic}</span>
              </div>

              <h3 className={`text-sm font-bold ${session.isCompleted ? "line-through text-slate-500" : "text-slate-900"}`}>
                {session.title}
              </h3>

              <p className="text-xs text-slate-600">
                <strong>Goal:</strong> {session.goal}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {session.durationMin} Minutes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-slate-400" />
                  {session.participants.join(", ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleToggleComplete(session.id)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                  session.isCompleted
                    ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>{session.isCompleted ? "Mark Incomplete" : "Mark as Completed"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
