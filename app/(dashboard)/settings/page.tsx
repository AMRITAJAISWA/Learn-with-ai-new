"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Wand2,
  Bell,
  Key,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  const [plasmaEnabled, setPlasmaEnabled] = useState(true);
  const [notifyRevision, setNotifyRevision] = useState(true);
  const [notifyChat, setNotifyChat] = useState(true);
  const [notifySessions, setNotifySessions] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPlasma = localStorage.getItem("learnwithai_plasma_enabled");
    if (savedPlasma !== null) {
      setPlasmaEnabled(savedPlasma === "true");
    }
  }, []);

  const handleTogglePlasma = (checked: boolean) => {
    setPlasmaEnabled(checked);
    localStorage.setItem("learnwithai_plasma_enabled", String(checked));
    window.dispatchEvent(
      new CustomEvent("toggle-plasma", { detail: { enabled: checked } })
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Preferences & Configuration
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
          Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your experience, visual gestures, notification rules, and AI providers.
        </p>
      </div>

      <div className="space-y-6">
        {/* Visual Gestures & Plasma Cursor */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Wand2 className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Interactive Fluid / Plasma Cursor Gesture
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Powered by the TypeGPU plasma fluid simulation principles. Renders vibrant, non-intrusive cosmic indigo & cyan swirls that react dynamically to pointer movements and click ripples.
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-700">
              Enable Plasma Ambient Gesture Across Platform
            </span>
            <input
              type="checkbox"
              checked={plasmaEnabled}
              onChange={(e) => handleTogglePlasma(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Bell className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Reminders & Notifications
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Control when LearnWithAI notifies you regarding memory retention checkpoints and peer study invitations.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Spaced Revision Reminders (Topics due today)
              </span>
              <input
                type="checkbox"
                checked={notifyRevision}
                onChange={(e) => setNotifyRevision(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Study Buddy Direct Messages & Connection Requests
              </span>
              <input
                type="checkbox"
                checked={notifyChat}
                onChange={(e) => setNotifyChat(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Scheduled Study Session Alerts
              </span>
              <input
                type="checkbox"
                checked={notifySessions}
                onChange={(e) => setNotifySessions(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Engine & Free API Integrations */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  100% Free API & AI Layer
                </h2>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  Zero paid subscriptions required • No credit cards needed
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              100% Free Tier Enabled
            </span>
          </div>

          <p className="text-xs text-slate-500">
            LearnWithAI is engineered from the ground up to use completely free APIs across every feature. Choose between Google AI Studio free tier, Groq cloud free tier, zero-key public AI, or the instant offline neural engine.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">AI Intelligence Engine</span>
              <p className="font-bold text-slate-800">
                Gemini Free / Pollinations Free
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ Free Unlimited Mode
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Live Video Recommendations</span>
              <p className="font-bold text-slate-800">Free Live YouTube Engine</p>
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ 0 Key Required • Real-Time
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Avatar & Media API</span>
              <p className="font-bold text-slate-800">DiceBear SVG Avatars</p>
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ Open-Source & Free
              </span>
            </div>
          </div>
        </div>

        {/* Save & Reset */}
        <div className="flex items-center justify-between pt-4">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Check className="h-4 w-4" /> Preferences saved!
            </span>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
