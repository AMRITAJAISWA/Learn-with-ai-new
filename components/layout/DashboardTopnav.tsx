"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Wand2,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";
import { store } from "@/lib/db/store";

export function DashboardTopnav() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [plasmaOn, setPlasmaOn] = useState(true);

  const [incomingReqs, setIncomingReqs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const updateReqs = () => {
      try {
        const raw = localStorage.getItem("learnwithai_connection_requests");
        if (raw) {
          const all = JSON.parse(raw);
          const mine = all.filter(
            (r: any) =>
              r.status === "PENDING" &&
              (r.receiverEmail?.toLowerCase() === user.email?.toLowerCase() ||
                r.receiverId?.toLowerCase() === user.id?.toLowerCase())
          );
          setIncomingReqs(mine);
        }
      } catch {}
    };

    updateReqs();
    window.addEventListener("connection-requests-updated", updateReqs);
    return () => window.removeEventListener("connection-requests-updated", updateReqs);
  }, [user]);

  const notifications = store.notifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length + incomingReqs.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(searchQuery)}`);
  };

  const togglePlasma = () => {
    const next = !plasmaOn;
    setPlasmaOn(next);
    localStorage.setItem("learnwithai_plasma_enabled", String(next));
    window.dispatchEvent(
      new CustomEvent("toggle-plasma", { detail: { enabled: next } })
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-slate-950/75 px-4 backdrop-blur-2xl text-white lg:px-8">
      {/* Mobile brand & menu */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-900"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-slate-950">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-bold text-white">LearnWithAI</span>
        </Link>
      </div>

      {/* Center / Left Global Search */}
      <div className="hidden sm:flex flex-1 max-w-lg items-center">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask AI or search courses, doubts, flashcards..."
            className="w-full rounded-xl border border-white/15 bg-slate-900/80 py-2 pl-9 pr-16 text-xs text-white placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-sky-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 hover:bg-sky-400"
          >
            Ask AI
          </button>
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Plasma Canvas Toggle */}
        <button
          onClick={togglePlasma}
          title="Toggle interactive plasma fluid trail"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            plasmaOn
              ? "bg-sky-50 border-sky-300 text-sky-700 shadow-sm"
              : "bg-slate-100 border-slate-200 text-slate-500"
          }`}
        >
          <Wand2 className={`h-3.5 w-3.5 ${plasmaOn ? "text-sky-600" : ""}`} />
          <span className="hidden sm:inline">Plasma {plasmaOn ? "On" : "Off"}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <Link
                  href="/study-buddies"
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-semibold text-sky-600 hover:underline"
                >
                  Manage requests →
                </Link>
              </div>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                {/* Pending incoming connection requests */}
                {incomingReqs.map((req) => (
                  <Link
                    key={req.id}
                    href="/study-buddies"
                    onClick={() => setShowNotifications(false)}
                    className="block rounded-xl p-2.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition-colors"
                  >
                    <div className="flex items-center justify-between font-bold text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Connection Request
                      </span>
                      <span className="text-[9px] font-normal text-emerald-600">Action</span>
                    </div>
                    <p className="mt-1 text-[11px] text-emerald-800 leading-snug">
                      <strong>{req.senderName}</strong> sent you a study buddy request! Click to accept or decline.
                    </p>
                  </Link>
                ))}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-2.5 text-xs transition-colors ${
                      n.isRead ? "bg-slate-50 text-slate-600" : "bg-sky-50/70 border border-sky-100 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px]">
                      <span>{n.title}</span>
                      <span className="text-[9px] font-normal text-slate-400">{n.createdAt}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Logout / Sign In */}
        <div className="flex items-center gap-2">
          <Link
            href="/courses/new"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-sky-500 hover:to-blue-500 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Course</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" title="View Profile" className="flex items-center gap-2 group">
                <img
                  src={user?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav"}
                  alt={user?.name || "Student"}
                  className="h-8 w-8 rounded-full border border-sky-400/40 bg-sky-950/50 cursor-pointer group-hover:scale-105 transition-transform"
                />
              </Link>
              <button
                onClick={logout}
                title="Sign Out of LearnWithAI"
                className="flex items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-300 hover:text-rose-200 transition-all shadow-sm active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-all shadow-sm active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md p-4 space-y-2 shadow-2xl">
          <Link
            href="/dashboard"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            🏠 Dashboard
          </Link>
          <Link
            href="/courses"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            📚 My Courses
          </Link>
          <Link
            href="/assistant"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            🤖 AI Assistant
          </Link>
          <Link
            href="/videos"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            🎥 Educational Videos
          </Link>
          <Link
            href="/quizzes"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            📝 Quiz Center
          </Link>
          <Link
            href="/flashcards"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            🃏 Flashcards
          </Link>
          <Link
            href="/revision"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            🔄 Smart Revision
          </Link>
          <Link
            href="/study-buddies"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            👥 Study Buddies
          </Link>
          <Link
            href="/messages"
            onClick={() => setMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            💬 Messages
          </Link>
          <div className="pt-2 border-t border-slate-200">
            {user ? (
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 w-full text-left rounded-lg px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out ({user.name})</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 w-full text-left rounded-lg px-3 py-2 text-sm font-bold text-sky-600 hover:bg-sky-50"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
