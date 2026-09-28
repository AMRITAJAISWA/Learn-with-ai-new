"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Mail, Lock, Users, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";
import { INITIAL_REGISTERED_USERS } from "@/lib/db/connectionStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, allRegisteredUsers } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      login(email, password);
      router.push("/dashboard");
    }, 400);
  };

  const handleSelectAccount = (accEmail: string) => {
    setEmail(accEmail);
    setPassword("password123");
    setErrorMsg("");
  };

  const displayUsers =
    allRegisteredUsers && allRegisteredUsers.length > 0
      ? allRegisteredUsers.slice(0, 4)
      : INITIAL_REGISTERED_USERS.slice(0, 4);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-7 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Learn<span className="text-sky-600">WithAI</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
            Sign In to your Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access your courses, revision schedule, and study buddy network.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Real Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="student@university.edu"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <span className="text-[10px] font-semibold text-sky-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In to LearnWithAI</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Switch Profiles for Testing Connection Requests */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-2">
            <Users className="h-3.5 w-3.5 text-sky-600" />
            <span>Switch / Test Profiles (Click to fill credentials):</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {displayUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectAccount(u.email)}
                className={`text-left p-2 rounded-xl border text-[11px] transition-all flex items-center gap-2 ${
                  email.toLowerCase() === u.email.toLowerCase()
                    ? "border-sky-500 bg-sky-50/90 text-sky-900 font-bold"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="h-6 w-6 rounded-full border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{u.name}</div>
                  <div className="truncate text-[9px] text-slate-500">{u.college}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-sky-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
