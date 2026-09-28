"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowLeft,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { store, StudyBuddyData } from "@/lib/db/store";
import { useAuth } from "@/lib/auth/authContext";
import { calculateStudyBuddyMatch } from "@/lib/matching/studyBuddy";
import {
  getConnectionStatusBetween,
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  getAllRegisteredUsers,
} from "@/lib/db/connectionStore";

export default function StudyBuddyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const buddyId = params.id as string;
  const { user } = useAuth();

  const [buddy, setBuddy] = useState<StudyBuddyData | null>(null);
  const [connStatus, setConnStatus] = useState<{
    status: "CONNECTED" | "PENDING_SENT" | "PENDING_RECEIVED" | "NONE";
    requestId?: string;
  }>({ status: "NONE" });
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    // Look up in registered users or store
    const allUsers = getAllRegisteredUsers();
    const matchedAccount = allUsers.find((u) => u.id === buddyId || u.email === buddyId);
    
    if (matchedAccount) {
      setBuddy({
        id: matchedAccount.id,
        name: matchedAccount.name,
        avatarUrl: matchedAccount.avatarUrl,
        education: matchedAccount.educationLevel || "Student",
        college: matchedAccount.college,
        courses: matchedAccount.targetSubjects || ["Computer Science"],
        learningGoals: matchedAccount.learningGoals || "Prepare for AI Roles",
        skillLevel: (matchedAccount.skillLevel as any) || "Intermediate",
        preferredStudyTime: matchedAccount.preferredStudyTime || "Evening",
        studyDuration: matchedAccount.preferredStudyDuration || 60,
        interests: matchedAccount.interests || ["AI"],
        about: matchedAccount.bio || "Passionate about learning and collaborating.",
        compatibilityPct: 88,
        status: "DISCOVERABLE",
        isOnline: true,
      });
    } else {
      const found = store.studyBuddies.find((b) => b.id === buddyId) || store.studyBuddies[0];
      if (found) setBuddy(found);
    }
  }, [buddyId]);

  useEffect(() => {
    if (user && buddy) {
      const status = getConnectionStatusBetween(user, buddy.id);
      setConnStatus(status);
    }
  }, [user, buddy, actionNotice]);

  if (!buddy) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const matchEval = user
    ? calculateStudyBuddyMatch(user, buddy)
    : { score: buddy.compatibilityPct, matchReasons: ["Compatible Schedule"] };

  const handleSend = () => {
    if (!user || !buddy) return;
    sendConnectionRequest(user, {
      id: buddy.id,
      name: buddy.name,
      email: (buddy as any).email || `${buddy.id}@university.edu`,
      college: buddy.college,
      avatarUrl: buddy.avatarUrl,
    });
    setActionNotice(`Connection request sent to ${buddy.name}!`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleAccept = () => {
    if (!connStatus.requestId) return;
    acceptConnectionRequest(connStatus.requestId);
    setActionNotice(`Connected with ${buddy.name}!`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDecline = () => {
    if (!connStatus.requestId) return;
    declineConnectionRequest(connStatus.requestId);
    setActionNotice(`Declined connection request.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Back button */}
      <Link
        href="/study-buddies"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Study Buddies</span>
      </Link>

      {/* Main Profile Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={buddy.avatarUrl}
                alt={buddy.name}
                className="h-16 w-16 rounded-full border-2 border-slate-100 bg-sky-50 object-cover"
              />
              {buddy.isOnline && (
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{buddy.name}</h1>
                {buddy.isOnline && (
                  <span className="text-xs text-emerald-600 font-semibold">• Online</span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {buddy.education} • {buddy.college}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-right">
            <span className="text-sm font-black text-emerald-700">
              {matchEval.score}% Match
            </span>
            <span className="block text-[10px] font-bold text-emerald-600 uppercase">
              Learning Synergy
            </span>
          </div>
        </div>

        {/* Why You Matched Box */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Why You Matched with {buddy.name}</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-950">
            {matchEval.matchReasons.map((reason, idx) => (
              <li key={idx} className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Enrolled Courses</span>
            <p className="mt-1 font-bold text-slate-900">{buddy.courses.join(", ")}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Learning Goals</span>
            <p className="mt-1 font-bold text-slate-900">{buddy.learningGoals}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Study Availability</span>
            <p className="mt-1 font-bold text-slate-900">
              {buddy.preferredStudyTime} ({buddy.studyDuration}m duration)
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Skill Tier</span>
            <p className="mt-1 font-bold text-slate-900">{buddy.skillLevel}</p>
          </div>
        </div>

        {/* Interests */}
        <div>
          <span className="text-xs font-bold text-slate-700">Academic & Tech Interests</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {buddy.interests.map((interest, i) => (
              <span
                key={i}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <div>
          <span className="text-xs font-bold text-slate-700">About</span>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
            "{buddy.about}"
          </p>
        </div>

        {/* Floating Action Alert */}
        {actionNotice && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex items-center justify-between">
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {connStatus.status === "CONNECTED" && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
              <CheckCircle2 className="h-4 w-4" /> Connected Peer
            </span>
          )}

          {connStatus.status === "PENDING_SENT" && (
            <span className="text-xs text-amber-700 font-bold flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl">
              <Clock className="h-4 w-4 animate-spin" /> Request Sent (Waiting for {buddy.name})
            </span>
          )}

          {connStatus.status === "PENDING_RECEIVED" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAccept}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
              >
                <span>Accept Request</span>
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 px-3 py-2 text-xs font-semibold text-slate-700 transition-all"
              >
                <span>Decline</span>
              </button>
            </div>
          )}

          {connStatus.status === "NONE" && (
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span>Connect with {buddy.name}</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <Link
              href="/study-sessions"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Calendar className="h-4 w-4 text-sky-600" />
              <span>Schedule Study Session</span>
            </Link>

            <Link
              href={`/messages?buddy=${buddy.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
