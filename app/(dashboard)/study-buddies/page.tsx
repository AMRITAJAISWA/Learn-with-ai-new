"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  UserPlus,
  UserCheck,
  UserX,
  Hourglass,
  Bell,
  Check,
  X,
  BookOpen,
} from "lucide-react";
import { store, StudyBuddyData } from "@/lib/db/store";
import { useAuth } from "@/lib/auth/authContext";
import { calculateStudyBuddyMatch } from "@/lib/matching/studyBuddy";
import {
  getAllRegisteredUsers,
  getAllConnectionRequests,
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  getIncomingRequestsForUser,
  getConnectionStatusBetween,
  ConnectionRequest,
  RegisteredAccount,
} from "@/lib/db/connectionStore";

export default function StudyBuddiesPage() {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([]);
  const [allPeers, setAllPeers] = useState<RegisteredAccount[]>([]);
  const [requestsVersion, setRequestsVersion] = useState(0);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Sync state from storage whenever user changes or action is taken
  useEffect(() => {
    if (!user) return;
    const reqs = getIncomingRequestsForUser(user.email || user.id);
    setIncomingRequests(reqs);

    const accounts = getAllRegisteredUsers();
    // Exclude currently logged in user
    const otherAccounts = accounts.filter(
      (a) =>
        a.email.toLowerCase() !== user.email.toLowerCase() &&
        a.id.toLowerCase() !== user.id.toLowerCase()
    );
    setAllPeers(otherAccounts);
  }, [user, requestsVersion]);

  // Listen to cross-tab or custom update events
  useEffect(() => {
    const handleUpdate = () => {
      setRequestsVersion((v) => v + 1);
    };
    window.addEventListener("connection-requests-updated", handleUpdate);
    return () => window.removeEventListener("connection-requests-updated", handleUpdate);
  }, []);

  const handleSendRequest = (peer: RegisteredAccount) => {
    if (!user) return;
    sendConnectionRequest(user, peer);
    setRequestsVersion((v) => v + 1);
    setActionNotice(`Connection request sent to ${peer.name}! Waiting for them to accept.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleAccept = (requestId: string, senderName: string) => {
    acceptConnectionRequest(requestId);
    setRequestsVersion((v) => v + 1);
    setActionNotice(`Accepted connection request from ${senderName}! You are now study buddies.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDecline = (requestId: string, senderName: string) => {
    declineConnectionRequest(requestId);
    setRequestsVersion((v) => v + 1);
    setActionNotice(`Declined connection request from ${senderName}.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Peer Synergy & Collaboration
            </span>
            {user && (
              <span className="text-[11px] font-medium text-slate-500">
                Logged in as <strong className="text-slate-800">{user.name}</strong> ({user.college})
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Study Buddy Matching & Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Send real-time connection requests to peers, accept study invitations, and collaborate with matching goals.
          </p>
        </div>

        <Link
          href="/study-sessions"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
        >
          <Calendar className="h-4 w-4 text-sky-400" />
          <span>Shared Study Sessions</span>
        </Link>
      </div>

      {/* Floating Action Alert */}
      {actionNotice && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/95 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. INCOMING CONNECTION REQUESTS (High Priority) */}
      {incomingRequests.length > 0 && (
        <div className="rounded-3xl border-2 border-emerald-400 bg-emerald-50/50 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <h2 className="text-base font-extrabold text-emerald-950">
                Incoming Connection Requests ({incomingRequests.length})
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col justify-between rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={req.senderAvatar}
                    alt={req.senderName}
                    className="h-12 w-12 rounded-full border border-emerald-300 bg-sky-50 flex-shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{req.senderName}</h4>
                    <p className="text-xs text-slate-500">{req.senderCollege}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {req.senderSubjects?.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-semibold text-emerald-700"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                    <span className="block mt-1 text-[10px] text-slate-400">
                      Sent {req.createdAt}
                    </span>
                  </div>
                </div>

                {/* Accept / Decline Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleAccept(req.id, req.senderName)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 px-3 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
                  >
                    <Check className="h-4 w-4" />
                    <span>Accept Request</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecline(req.id, req.senderName)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 py-2 px-3 text-xs font-semibold text-slate-600 transition-all active:scale-95"
                  >
                    <X className="h-4 w-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. DISCOVER STUDY BUDDIES & CONNECT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <span>Discover Peers & Collaborative Study Buddies</span>
          </h2>
          <span className="text-xs text-slate-400">
            {allPeers.length} student profiles available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allPeers.map((peer) => {
            // Map peer to StudyBuddy format for calculateStudyBuddyMatch
            const peerBuddy: StudyBuddyData = {
              id: peer.id,
              name: peer.name,
              avatarUrl: peer.avatarUrl,
              education: peer.educationLevel || "Student",
              college: peer.college,
              courses: peer.targetSubjects || ["Computer Science"],
              learningGoals: peer.learningGoals || "Prepare for AI Roles",
              skillLevel: (peer.skillLevel as any) || "Intermediate",
              preferredStudyTime: peer.preferredStudyTime || "Evening",
              studyDuration: peer.preferredStudyDuration || 60,
              interests: peer.interests || ["AI"],
              about: peer.bio || "Passionate about learning and collaborating.",
              compatibilityPct: 88,
              status: "DISCOVERABLE",
              isOnline: true,
            };

            const matchEval = user
              ? calculateStudyBuddyMatch(user, peerBuddy)
              : { score: 85, matchReasons: ["Compatible goals"] };

            const conn = user
              ? getConnectionStatusBetween(user, peer.email || peer.id)
              : { status: "NONE" as const };

            return (
              <div
                key={peer.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all group"
              >
                <div className="space-y-4">
                  {/* Profile Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={peer.avatarUrl}
                          alt={peer.name}
                          className="h-12 w-12 rounded-full border-2 border-slate-100 bg-sky-50 object-cover"
                        />
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{peer.name}</h3>
                          <span className="text-[10px] text-emerald-600 font-semibold">• Active</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {peer.educationLevel || "Student"} • {peer.college}
                        </p>
                      </div>
                    </div>

                    {/* Calculated Compatibility Badge */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-right">
                      <span className="text-xs font-black text-emerald-700">
                        {matchEval.score}% Match
                      </span>
                      <span className="block text-[9px] font-bold text-emerald-600 uppercase">
                        Compatibility
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{peer.bio || peerBuddy.about}"
                  </p>

                  {/* Meta details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="text-slate-400 font-bold text-[10px] uppercase w-20">
                        Courses:
                      </span>
                      <span className="font-semibold">{peerBuddy.courses.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="text-slate-400 font-bold text-[10px] uppercase w-20">
                        Goal:
                      </span>
                      <span className="truncate">{peer.learningGoals || peerBuddy.learningGoals}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="text-slate-400 font-bold text-[10px] uppercase w-20">
                        Schedule:
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {peer.preferredStudyTime || "Evening"} ({peer.preferredStudyDuration || 60}m)
                      </span>
                    </div>
                  </div>

                  {/* Why You Matched tags */}
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Why You Matched:
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {matchEval.matchReasons.map((reason, rIdx) => (
                        <span
                          key={rIdx}
                          className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Connect, Accept/Decline, or Connected */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/study-buddies/${peer.id}`}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View Profile
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* Scenario 1: Already Connected */}
                    {conn.status === "CONNECTED" && (
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Connected</span>
                      </span>
                    )}

                    {/* Scenario 2: Request Sent by current user (Pending Peer Acceptance) */}
                    {conn.status === "PENDING_SENT" && (
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-700">
                        <Hourglass className="h-3.5 w-3.5 animate-spin" />
                        <span>Request Sent</span>
                      </span>
                    )}

                    {/* Scenario 3: Request Received from this peer (Can Accept or Decline) */}
                    {conn.status === "PENDING_RECEIVED" && conn.requestId && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAccept(conn.requestId!, peer.name)}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecline(conn.requestId!, peer.name)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-all"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Scenario 4: Not connected yet - Send Connection Request */}
                    {conn.status === "NONE" && (
                      <button
                        type="button"
                        onClick={() => handleSendRequest(peer)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 transition-all shadow-sm"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Send Request</span>
                      </button>
                    )}

                    <Link
                      href={`/messages?buddy=${peer.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Message</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
