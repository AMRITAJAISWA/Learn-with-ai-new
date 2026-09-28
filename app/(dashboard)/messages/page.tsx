"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Search,
  User,
  CheckCheck,
  MessageSquare,
  ShieldCheck,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { store } from "@/lib/db/store";
import { useAuth } from "@/lib/auth/authContext";
import {
  PeerMessage,
  getAllRegisteredUsers,
  getPeerMessagesBetween,
  sendPeerMessage,
  clearPeerMessagesBetween,
  getConnectionStatusBetween,
} from "@/lib/db/connectionStore";

interface ChatPeer {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  college: string;
  courses: string[];
  status: "CONNECTED" | "PENDING_SENT" | "PENDING_RECEIVED" | "NONE";
  lastMessage?: PeerMessage;
}

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const buddyParam = searchParams.get("buddy") || searchParams.get("email");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [activeMessages, setActiveMessages] = useState<PeerMessage[]>([]);
  const [peers, setPeers] = useState<ChatPeer[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Build the list of peers for the current user
  const refreshPeersAndMessages = () => {
    if (!user) return;

    const registered = getAllRegisteredUsers();
    const myEmail = (user.email || "").toLowerCase().trim();
    const myId = (user.id || "").toLowerCase().trim();

    // Map all potential buddies from store and registered users
    const peerMap = new Map<string, ChatPeer>();

    // 1. Add registered users (excluding current user)
    registered.forEach((u) => {
      const uEmail = (u.email || "").toLowerCase().trim();
      const uId = (u.id || "").toLowerCase().trim();
      if ((uEmail && uEmail === myEmail) || (uId && uId === myId)) return;

      const conn = getConnectionStatusBetween(user, u.email || u.id);
      const msgs = getPeerMessagesBetween(
        { id: user.id, email: user.email },
        { id: u.id, email: u.email }
      );
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : undefined;

      peerMap.set(uEmail || uId, {
        id: u.id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
        college: u.college || "University Student",
        courses: u.targetSubjects || ["General Studies"],
        status: conn.status,
        lastMessage: lastMsg,
      });
    });

    // 2. Add studyBuddies from store if not already present
    store.studyBuddies.forEach((b) => {
      const bId = b.id.toLowerCase().trim();
      const existing = Array.from(peerMap.values()).find(
        (p) => p.id.toLowerCase() === bId || p.name.toLowerCase() === b.name.toLowerCase()
      );

      if (!existing) {
        const conn = getConnectionStatusBetween(user, b.id);
        const msgs = getPeerMessagesBetween(
          { id: user.id, email: user.email },
          { id: b.id, email: `${b.id}@learnwithai.edu` }
        );
        const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : undefined;

        peerMap.set(bId, {
          id: b.id,
          name: b.name,
          email: `${b.id}@learnwithai.edu`,
          avatarUrl: b.avatarUrl,
          college: b.college,
          courses: b.courses,
          status: conn.status,
          lastMessage: lastMsg,
        });
      }
    });

    const peerList = Array.from(peerMap.values());

    // Sort peers: peers with active messages first, then connected peers, then others
    peerList.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt || 0;
      const timeB = b.lastMessage?.createdAt || 0;
      if (timeA !== timeB) return timeB - timeA;
      if (a.status === "CONNECTED" && b.status !== "CONNECTED") return -1;
      if (b.status === "CONNECTED" && a.status !== "CONNECTED") return 1;
      return a.name.localeCompare(b.name);
    });

    setPeers(peerList);

    // Set selected peer if not already set or if passed in URL query
    if (buddyParam) {
      const matched = peerList.find(
        (p) =>
          p.id.toLowerCase() === buddyParam.toLowerCase() ||
          p.email.toLowerCase() === buddyParam.toLowerCase()
      );
      if (matched) {
        setSelectedPeerId(matched.id);
        return;
      }
    }

    if (!selectedPeerId && peerList.length > 0) {
      setSelectedPeerId(peerList[0].id);
    }
  };

  useEffect(() => {
    refreshPeersAndMessages();

    const handleUpdate = () => {
      refreshPeersAndMessages();
    };

    window.addEventListener("peer-messages-updated", handleUpdate);
    window.addEventListener("connection-requests-updated", handleUpdate);

    return () => {
      window.removeEventListener("peer-messages-updated", handleUpdate);
      window.removeEventListener("connection-requests-updated", handleUpdate);
    };
  }, [user, buddyParam]);

  const activePeer =
    peers.find((p) => p.id === selectedPeerId) || peers[0] || null;

  // Load messages for currently active conversation
  useEffect(() => {
    if (!user || !activePeer) {
      setActiveMessages([]);
      return;
    }

    const msgs = getPeerMessagesBetween(
      { id: user.id, email: user.email },
      { id: activePeer.id, email: activePeer.email }
    );
    setActiveMessages(msgs);
  }, [user, activePeer, selectedPeerId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Send message handler: 100% human-to-human, zero automated replies
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activePeer) return;

    sendPeerMessage(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      {
        id: activePeer.id,
        name: activePeer.name,
        email: activePeer.email,
        avatarUrl: activePeer.avatarUrl,
      },
      inputText
    );

    // Refresh current chat immediately
    const updated = getPeerMessagesBetween(
      { id: user.id, email: user.email },
      { id: activePeer.id, email: activePeer.email }
    );
    setActiveMessages(updated);
    setInputText("");
    // NO AUTOMATED REPLIES TRIGGERED
  };

  const handleClearChat = () => {
    if (!user || !activePeer) return;
    if (window.confirm(`Clear chat history with ${activePeer.name}?`)) {
      clearPeerMessagesBetween(
        { id: user.id, email: user.email },
        { id: activePeer.id, email: activePeer.email }
      );
      setActiveMessages([]);
    }
  };

  // Filter peers by search query
  const filteredPeers = peers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.courses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-8rem)] max-w-4xl mx-auto items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/85 p-8 text-center backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In to Access Messages</h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Log in to your account to send direct messages to your study buddies and coordinate study sessions in real-time.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 text-xs font-bold text-white shadow-lg hover:from-sky-400 hover:to-indigo-500 transition-all"
          >
            <LogIn className="h-4 w-4" />
            <span>Go to Sign In</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-6xl mx-auto rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden">
      {/* Left Conversations Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/60">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-sky-600" />
              <span>Direct Messages</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
              {peers.length} peers
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search peers or subjects..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredPeers.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No study buddies found matching your search.
            </div>
          ) : (
            filteredPeers.map((peer) => {
              const isSelected = activePeer?.id === peer.id;
              const hasMessages = Boolean(peer.lastMessage);

              return (
                <button
                  key={peer.id}
                  onClick={() => setSelectedPeerId(peer.id)}
                  className={`w-full flex items-start gap-3 p-3.5 text-left transition-all ${
                    isSelected
                      ? "bg-white shadow-sm border-l-4 border-l-sky-500"
                      : "hover:bg-white/80"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={peer.avatarUrl}
                      alt={peer.name}
                      className="h-10 w-10 rounded-full border border-slate-200 bg-sky-50 object-cover"
                    />
                    {peer.status === "CONNECTED" && (
                      <span
                        title="Connected study buddy"
                        className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {peer.name}
                      </h4>
                      {peer.lastMessage ? (
                        <span className="text-[10px] text-slate-400">
                          {peer.lastMessage.timestamp}
                        </span>
                      ) : (
                        peer.status === "CONNECTED" && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Connected
                          </span>
                        )
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {peer.lastMessage
                        ? `${peer.lastMessage.senderId === user.id ? "You: " : ""}${peer.lastMessage.content}`
                        : peer.college}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Active Chat Window */}
      {activePeer ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activePeer.avatarUrl}
                  alt={activePeer.name}
                  className="h-10 w-10 rounded-full border border-slate-200 bg-sky-50 object-cover"
                />
                {activePeer.status === "CONNECTED" && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{activePeer.name}</h3>
                  {activePeer.status === "CONNECTED" ? (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      ✓ Connected Study Buddy
                    </span>
                  ) : activePeer.status === "PENDING_SENT" ? (
                    <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                      Request Pending
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-slate-500">
                  {activePeer.college} {activePeer.courses[0] ? `• ${activePeer.courses[0]}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/study-buddies`}
                className="text-[11px] font-semibold text-slate-600 hover:text-sky-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Find More Buddies
              </Link>

              {activeMessages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
                <div className="relative mb-3">
                  <img
                    src={activePeer.avatarUrl}
                    alt={activePeer.name}
                    className="h-16 w-16 rounded-full border-2 border-white shadow-md bg-sky-50"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white">
                    <MessageSquare className="h-3 w-3" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Direct chat with {activePeer.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Start your conversation to coordinate study sessions, discuss problem sets, or exchange study materials.
                </p>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-800 mb-6">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Real Peer Chat • Zero Automated Bot Messages</span>
                </div>

                {/* Conversation starter chips */}
                <div className="w-full space-y-2 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Click to start message:
                  </span>
                  {[
                    `👋 Hey ${activePeer.name.split(" ")[0]}! Are you free to study together?`,
                    `Would you like to review the practice quiz questions?`,
                    `How is your progress on the latest module?`,
                  ].map((starter, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInputText(starter)}
                      className="w-full rounded-xl border border-slate-200/80 bg-white p-2.5 text-xs text-slate-700 hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-900 transition-all text-left shadow-2xs"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMe =
                  msg.senderId === user.id ||
                  (user.email && msg.senderEmail.toLowerCase() === user.email.toLowerCase());

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                      <span>{isMe ? "You" : msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? "bg-slate-900 text-white rounded-br-xs"
                          : "bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {isMe && (
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-1 px-1">
                        <CheckCheck className="h-3 w-3 text-sky-500" />
                        <span>Sent</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-100 bg-white flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activePeer.name}... (Press Enter to send)`}
              className="flex-1 rounded-2xl border border-slate-200 py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800 disabled:opacity-40 transition-all active:scale-95 shadow-sm inline-flex items-center gap-1.5 text-xs font-bold"
              aria-label="Send message"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-slate-400">
          Select a peer to start messaging.
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-8rem)] max-w-6xl mx-auto items-center justify-center">
          <div className="text-xs font-semibold text-slate-400 animate-pulse">
            Loading messages...
          </div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
