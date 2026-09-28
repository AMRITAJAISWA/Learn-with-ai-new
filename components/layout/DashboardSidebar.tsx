"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Bot,
  PlaySquare,
  FileQuestion,
  Layers,
  RotateCcw,
  Users,
  MessageSquare,
  Calendar,
  User,
  Settings,
  Sparkles,
  Flame,
  Award,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/courses", label: "My Courses", icon: BookOpen },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/videos", label: "Recommended Videos", icon: PlaySquare },
  { href: "/quizzes", label: "Quiz Center", icon: FileQuestion },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/revision", label: "Smart Revision", icon: RotateCcw },
  { href: "/study-buddies", label: "Study Buddies", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/study-sessions", label: "Study Sessions", icon: Calendar },
  { href: "/profile", label: "Student Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl lg:flex text-slate-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Learn<span className="text-sky-400">WithAI</span>
          </span>
        </Link>
      </div>

      {/* Gamification Streak & XP Badge */}
      <div className="mx-4 my-3 flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-white/10 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>{user?.streakDays || 7} Day Streak</span>
        </div>
        <div className="flex items-center gap-1 text-sky-300 font-bold">
          <Award className="h-3.5 w-3.5 text-sky-400" />
          <span>{user?.totalXP || 1250} XP</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm"
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive ? "text-sky-400" : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Mini Card or Sign In */}
      <div className="p-3 border-t border-white/10">
        {user ? (
          <div className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-900/60 transition-colors">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 flex-1 min-w-0 group"
            >
              <img
                src={user?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav"}
                alt={user?.name || "Student"}
                className="h-8 w-8 rounded-full border border-sky-400/30 bg-slate-900 group-hover:border-sky-400 transition-colors flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                  {user?.name || "Aarav Patel"}
                </span>
                <span className="truncate text-[10px] text-slate-400">
                  {user?.college || "Stanford University"}
                </span>
              </div>
            </Link>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 transition-all flex-shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
