"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  FileCode,
  CheckCircle2,
} from "lucide-react";
import { askAiTutor, TutorMessage } from "@/lib/ai/tutor";
import { store } from "@/lib/db/store";
import { useAuth } from "@/lib/auth/authContext";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { user } = useAuth();

  const [activeCourseTitle, setActiveCourseTitle] = useState(
    store.courses[0]?.title || "General Computer Science & AI"
  );
  const [activeTopic, setActiveTopic] = useState("All Subjects");

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: "assistant",
      content: `Hello ${user?.name || "Student"}! 👋 I am your dedicated AI Learning Assistant powered by Google Gemini 1.5 Flash.\n\nI can explain any concept across Computer Science, Data Structures, Python, Java, Mathematics, AI, and Web Development. Ask me anything or try the quick action buttons below!`,
    },
  ]);

  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (userText: string, quickAction?: any) => {
    if (!userText.trim()) return;

    const newMessages: TutorMessage[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          contextTopic: activeTopic === "All Subjects" ? undefined : activeTopic,
          contextCourse: activeCourseTitle,
          quickAction,
        }),
      });

      const data = await res.json();
      const response = data.message || "I'm ready for your next question!";

      setMessages([
        ...newMessages,
        { role: "assistant", content: response },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I encountered a hiccup processing your request. Please try asking again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: "explain_simply" | "give_example" | "summarize" | "quiz_me") => {
    const defaultPrompts = {
      explain_simply: "Explain the core mechanics simply with an analogy.",
      give_example: "Show me a clean, practical code example.",
      summarize: "Provide a quick 3-bullet summary of key takeaways.",
      quiz_me: "Quiz me on this concept with a practice question.",
    };
    handleSendMessage(defaultPrompts[action], action);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat history cleared. What would you like to study next with Google Gemini 1.5 Flash?`,
      },
    ]);
  };

  const suggestedQuestions = [
    "What is recursion and call stack limits?",
    "Explain binary search in simple terms.",
    "Give me an example of array broadcasting.",
    "Explain time complexity O(log N) vs O(N).",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-4">
      {/* Top Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-600 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">AI Learning Assistant</h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                <Sparkles className="h-2.5 w-2.5 text-emerald-600" />
                Google Gemini 1.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Active Context: <span className="font-semibold text-sky-700">{activeTopic}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Topic Focus Selector */}
          <select
            value={activeTopic}
            onChange={(e) => setActiveTopic(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:border-sky-400"
          >
            <option value="All Subjects">🌐 All Subjects (General AI Tutor)</option>
            <option value="Java Architecture & OOP">☕ Java Architecture & OOP</option>
            <option value="Python for Data Science">🐍 Python for Data Science</option>
            <option value="Binary Trees & Recursive Logic">🌳 Binary Trees & Recursive Logic</option>
            <option value="Data Structures & Algorithms">⚡ Data Structures & Algorithms</option>
            <option value="SQL & Databases">🗄️ SQL & Databases</option>
          </select>

          {/* Quick Clear */}
          <button
            onClick={clearChat}
            title="Clear chat history"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Action Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
          Quick Actions:
        </span>
        <button
          onClick={() => handleQuickAction("explain_simply")}
          className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-sky-800 font-semibold hover:bg-sky-100 transition-colors whitespace-nowrap"
        >
          <Lightbulb className="h-3.5 w-3.5 text-sky-600" />
          <span>Explain Simply</span>
        </button>

        <button
          onClick={() => handleQuickAction("give_example")}
          className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-blue-800 font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap"
        >
          <FileCode className="h-3.5 w-3.5 text-blue-600" />
          <span>Give Example</span>
        </button>

        <button
          onClick={() => handleQuickAction("summarize")}
          className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors whitespace-nowrap"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Summarize</span>
        </button>

        <button
          onClick={() => handleQuickAction("quiz_me")}
          className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-amber-800 font-semibold hover:bg-amber-100 transition-colors whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Quiz Me</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";

          return (
            <div
              key={idx}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-700 flex-shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 border border-slate-200/80 text-slate-800 shadow-2xs"
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap font-sans">
                    {m.content}
                  </div>
                ) : (
                  <MarkdownRenderer content={m.content} />
                )}
              </div>

              {isUser && (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-slate-700 flex-shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center text-xs text-slate-400 pl-11">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
            <span>AI Tutor is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions below chat if short history */}
      {messages.length <= 2 && (
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-600">
          <span className="text-slate-400 font-bold whitespace-nowrap">Suggested:</span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1 hover:border-sky-300 hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            activeTopic === "All Subjects"
              ? "Ask any question (e.g. Java, Python, Binary Trees, Calculus, React)..."
              : `Ask anything about ${activeTopic}...`
          }
          className="w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 pl-4 pr-14 text-xs text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2.5 rounded-xl bg-slate-900 p-2 text-white hover:bg-slate-800 disabled:opacity-40 transition-all active:scale-95"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
