"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  Layers,
  HelpCircle,
  Copy,
  Check,
  Video,
  FileText,
  AlertTriangle,
  Send,
  ExternalLink,
} from "lucide-react";
import { store, CourseData, TopicData } from "@/lib/db/store";
import { getEnrichedTopicContent, EnrichedTopicDetails } from "@/lib/db/courseContent";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

export default function CourseDetailsPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [activeTopic, setActiveTopic] = useState<TopicData | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"content" | "video" | "ai">("content");
  const [copiedCode, setCopiedCode] = useState(false);

  // In-lesson AI tutor state
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Dynamic Gemini Lesson Generator State
  const [topicLessons, setTopicLessons] = useState<Record<string, EnrichedTopicDetails>>({});
  const [isLessonLoading, setIsLessonLoading] = useState(false);

  const fetchGeminiLesson = async (topic: TopicData, moduleId: string, force = false) => {
    if (!force && topicLessons[topic.id]) return;
    setIsLessonLoading(true);

    try {
      const currentMod = course?.modules.find((m) => m.id === moduleId);
      const res = await fetch("/api/ai/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle: topic.title,
          moduleTitle: currentMod?.title || "Core Module",
          courseTitle: course?.title || "Computer Science",
          skillLevel: course?.skillLevel || "Beginner",
        }),
      });

      const data = await res.json();
      if (data.success && data.lesson) {
        const fallback = getEnrichedTopicContent(topic.id, topic.title, currentMod?.title);
        setTopicLessons((prev) => ({
          ...prev,
          [topic.id]: {
            textBasedContent: data.lesson.textBasedContent,
            codeSnippet: data.lesson.codeSnippet || "",
            commonMistakes: data.lesson.commonMistakes || fallback.commonMistakes,
            keyTakeaways: data.lesson.keyTakeaways || fallback.keyTakeaways,
            videoSuggestion: fallback.videoSuggestion,
          },
        }));
      }
    } catch (err) {
      console.warn("Error fetching Gemini lesson:", err);
    } finally {
      setIsLessonLoading(false);
    }
  };

  useEffect(() => {
    const found = store.courses.find((c) => c.id === courseId) || store.courses[0];
    if (found) {
      setCourse({ ...found });
      // Expand first module by default and select first topic
      if (found.modules[0]) {
        setExpandedModules({ [found.modules[0].id]: true });
        setActiveModuleId(found.modules[0].id);
        const firstTopic = found.modules[0].topics[0] || null;
        setActiveTopic(firstTopic);
        if (firstTopic) {
          fetchGeminiLesson(firstTopic, found.modules[0].id);
        }
      }
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectTopic = (topic: TopicData, moduleId: string) => {
    setActiveTopic(topic);
    setActiveModuleId(moduleId);
    setAiAnswer(null);
    setAiQuestion("");
    fetchGeminiLesson(topic, moduleId);
  };

  const updateTopicStatus = (
    moduleId: string,
    topicId: string,
    newStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    const updated = { ...course };
    const mod = updated.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    const top = mod.topics.find((t) => t.id === topicId);
    if (!top) return;

    top.status = newStatus;

    // Recalculate course completion percentage
    const totalTopics = updated.modules.reduce((acc, m) => acc + m.topics.length, 0);
    const completedTopics = updated.modules.reduce(
      (acc, m) => acc + m.topics.filter((t) => t.status === "COMPLETED").length,
      0
    );

    updated.completionPct = Math.round((completedTopics / Math.max(1, totalTopics)) * 100);
    setCourse(updated);

    if (activeTopic?.id === topicId) {
      setActiveTopic({ ...top });
    }

    // Sync to store
    const storeIdx = store.courses.findIndex((c) => c.id === course.id);
    if (storeIdx !== -1) {
      store.courses[storeIdx] = updated;
    }
  };

  const handleNextTopic = () => {
    if (!activeTopic || !activeModuleId) return;

    let foundCurrent = false;
    for (const mod of course.modules) {
      for (const top of mod.topics) {
        if (foundCurrent) {
          selectTopic(top, mod.id);
          setExpandedModules((prev) => ({ ...prev, [mod.id]: true }));
          return;
        }
        if (top.id === activeTopic.id) {
          foundCurrent = true;
        }
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAskInLessonAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || !activeTopic) return;

    setIsAiLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: aiQuestion }],
          contextTopic: activeTopic.title,
          contextCourse: course.title,
        }),
      });

      const data = await res.json();
      setAiAnswer(data.message || "Here is the explanation for this topic.");
    } catch {
      setAiAnswer("Unable to fetch response right now. Please try again!");
    } finally {
      setIsAiLoading(false);
    }
  };

  const totalTopics = course.modules.reduce((acc, m) => acc + m.topics.length, 0);

  // Retrieve enriched lesson content and video recommendation
  const currentModule = course.modules.find((m) => m.id === activeModuleId);
  const fallbackEnriched = activeTopic
    ? getEnrichedTopicContent(activeTopic.id, activeTopic.title, currentModule?.title)
    : null;
  const enriched: EnrichedTopicDetails | null = activeTopic
    ? (topicLessons[activeTopic.id] || fallbackEnriched)
    : null;

  return (
    <div className="space-y-8">
      {/* Course Banner */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">
                {course.category}
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                Level: {course.skillLevel}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {course.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Overall Progress</span>
              <div className="text-2xl font-black text-sky-600">{course.completionPct}%</div>
            </div>
            <div className="w-40 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${course.completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Meta Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Modules</span>
            <p className="text-sm font-bold text-slate-900">{course.modules.length} Modules</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Topics</span>
            <p className="text-sm font-bold text-slate-900">{totalTopics} Lessons</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Time</span>
            <p className="text-sm font-bold text-slate-900">{course.estimatedHours} Hours</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Target Outcome</span>
            <p className="text-sm font-bold text-slate-900 truncate">{course.targetOutcome}</p>
          </div>
        </div>
      </div>

      {/* Course Content Grid: Left Modules Accordion, Right Active Topic Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Modules Accordion (Left 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
            <span>Curriculum Modules</span>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              {course.modules.length} modules
            </span>
          </h2>

          <div className="space-y-4">
            {course.modules.map((module, mIdx) => {
              const isExpanded = !!expandedModules[module.id];
              const completedCount = module.topics.filter(
                (t) => t.status === "COMPLETED"
              ).length;
              const modulePct = Math.round(
                (completedCount / Math.max(1, module.topics.length)) * 100
              );

              return (
                <div
                  key={module.id}
                  className="rounded-2xl border border-slate-200/90 bg-white/95 shadow-sm overflow-hidden"
                >
                  {/* Module Header */}
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                          Module {mIdx + 1}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                          {completedCount}/{module.topics.length} done
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{module.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-[10px] font-bold text-sky-600">{modulePct}%</div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Module Topics List */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/50">
                      {module.topics.map((topic, tIdx) => {
                        const isCurrentActive = activeTopic?.id === topic.id;

                        return (
                          <div
                            key={topic.id}
                            onClick={() => selectTopic(topic, module.id)}
                            className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isCurrentActive
                                ? "bg-sky-50/90 border-l-4 border-l-sky-500 shadow-2xs"
                                : "hover:bg-white"
                            }`}
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono text-slate-400">
                                  {mIdx + 1}.{tIdx + 1}
                                </span>
                                <h4 className={`text-xs font-bold truncate ${isCurrentActive ? "text-sky-900" : "text-slate-800"}`}>
                                  {topic.title}
                                </h4>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 pl-4">
                                {topic.summary}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="text-[10px] text-slate-400 font-mono">
                                {topic.estimatedMinutes}m
                              </span>
                              {topic.status === "COMPLETED" ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : topic.status === "IN_PROGRESS" ? (
                                <Circle className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                              ) : (
                                <Circle className="h-4 w-4 text-slate-300" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Lesson Reader & Video Companion (Right 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-sky-600" />
              <span>Interactive Lesson & Video Companion</span>
            </h2>

            {activeTopic && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateTopicStatus(
                      activeModuleId,
                      activeTopic.id,
                      activeTopic.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED"
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    activeTopic.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>
                    {activeTopic.status === "COMPLETED" ? "✓ Completed" : "Mark Complete"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleNextTopic}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <span>Next</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {activeTopic && enriched ? (
            <div className="rounded-3xl border border-slate-200/90 bg-white shadow-md overflow-hidden">
              {/* Lesson Top Header */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                    {currentModule?.title || "Curriculum Lesson"}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{activeTopic.estimatedMinutes} mins study time</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {activeTopic.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeTopic.summary}
                </p>

                {/* Tabs: Text-Based Content vs Video Suggestion vs Ask AI */}
                <div className="flex items-center gap-2 mt-5 border-b border-slate-200/60 pb-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("content")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === "content"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>📖 Text Lesson & Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("video")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === "video"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>🎬 Video Suggestion</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("ai")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === "ai"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>💡 Ask AI About This</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Comprehensive Text-Based Content */}
              {activeTab === "content" && (
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Google Gemini API Dynamic Lesson Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50/40 to-slate-50 border border-sky-100/80">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-sky-700 border border-sky-200 shadow-xs">
                        <Sparkles className="h-3 w-3 text-sky-600" />
                        Google Gemini API
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                        Topic Name & In-Depth Definition (Pure Concepts, No Code)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => activeTopic && fetchGeminiLesson(activeTopic, activeModuleId, true)}
                      disabled={isLessonLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-white text-xs font-bold text-sky-700 hover:bg-sky-50 shadow-xs active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Sparkles className={`h-3.5 w-3.5 text-sky-600 ${isLessonLoading ? "animate-spin" : ""}`} />
                      <span>{isLessonLoading ? "Generating with Gemini..." : "Regenerate with Gemini"}</span>
                    </button>
                  </div>

                  {isLessonLoading && !topicLessons[activeTopic.id] && (
                    <div className="flex items-center justify-center p-6 text-xs text-sky-800 bg-sky-50/60 rounded-2xl border border-sky-100 animate-pulse gap-2">
                      <Sparkles className="h-4 w-4 animate-spin text-sky-600" />
                      <span>Google Gemini API is preparing your topic definition for {activeTopic.title}...</span>
                    </div>
                  )}

                  {/* Detailed Text Explanations */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 sm:p-6 shadow-2xs">
                    <MarkdownRenderer content={enriched.textBasedContent} />
                  </div>

                  {/* Practical Verified Code Snippet */}
                  {enriched.codeSnippet && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-300 text-xs">
                        <span className="font-mono text-[11px] font-semibold flex items-center gap-2 text-sky-400">
                          <span>●</span> Practical Code Implementation
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(enriched.codeSnippet)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                        <code>{enriched.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  {enriched.keyTakeaways && enriched.keyTakeaways.length > 0 && (
                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-5 space-y-2">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Core Takeaways for Mastery</span>
                      </span>
                      <ul className="text-xs text-emerald-950 space-y-1.5 pl-1">
                        {enriched.keyTakeaways.map((k, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{k}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Pitfalls & Mistakes */}
                  {enriched.commonMistakes && enriched.commonMistakes.length > 0 && (
                    <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 space-y-2">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>Common Pitfalls to Avoid</span>
                      </span>
                      <ul className="text-xs text-amber-950 space-y-1.5 pl-1">
                        {enriched.commonMistakes.map((m, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">✕</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Video Teaser Card */}
                  <div
                    onClick={() => setActiveTab("video")}
                    className="cursor-pointer rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 p-4 flex items-center justify-between hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm flex-shrink-0">
                        <PlayCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                          Suggested Video Lecture
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          {enriched.videoSuggestion.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {enriched.videoSuggestion.channel} • {enriched.videoSuggestion.duration}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                      <span>Watch</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: Curated Video Suggestion & Embedded Player */}
              {activeTab === "video" && (
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                        Recommended Educational Video
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {enriched.videoSuggestion.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Creator: <span className="font-semibold text-slate-800">{enriched.videoSuggestion.channel}</span> • Duration: <span className="font-mono">{enriched.videoSuggestion.duration}</span>
                      </p>
                    </div>

                    <a
                      href={enriched.videoSuggestion.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Responsive Embedded YouTube Video Player */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-slate-950 border border-slate-200">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${enriched.videoSuggestion.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                      title={enriched.videoSuggestion.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-1">
                    <h5 className="text-xs font-bold text-slate-900">Why this video was selected:</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {enriched.videoSuggestion.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: In-Lesson AI Learning Assistant */}
              {activeTab === "ai" && (
                <div className="p-6 sm:p-8 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Ask AI about {activeTopic.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Get immediate explanations, line-by-line code breakdowns, or real-world examples specifically focused on this topic.
                    </p>
                  </div>

                  <form onSubmit={handleAskInLessonAi} className="space-y-3">
                    <div className="relative">
                      <textarea
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        rows={3}
                        placeholder={`e.g. Can you give me a real-world analogy to remember ${activeTopic.title}?`}
                        className="w-full rounded-2xl border border-slate-200 p-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                        {[
                          "Explain Simply",
                          "Give Code Example",
                          "Summarize in 3 Points",
                        ].map((promptText, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAiQuestion(`${promptText} for ${activeTopic.title}`)}
                            className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-700 transition-colors font-medium text-[10px]"
                          >
                            {promptText}
                          </button>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={isAiLoading || !aiQuestion.trim()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 disabled:opacity-40 transition-all shadow-sm"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isAiLoading ? "Thinking..." : "Ask Assistant"}</span>
                      </button>
                    </div>
                  </form>

                  {/* AI Response Output */}
                  {aiAnswer && (
                    <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                        <Sparkles className="h-4 w-4 text-sky-600" />
                        <span>AI Tutor Explanation:</span>
                      </div>
                      <div className="bg-white/90 rounded-xl p-4 border border-sky-100 shadow-2xs">
                        <MarkdownRenderer content={aiAnswer} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Quick Action Strip */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/quizzes`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 transition-colors"
                  >
                    <FileQuestion className="h-3.5 w-3.5 text-amber-600" />
                    <span>Topic Quiz</span>
                  </Link>
                  <Link
                    href={`/flashcards`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-200 transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5 text-purple-600" />
                    <span>Practice Flashcards</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleNextTopic}
                  className="inline-flex items-center gap-1.5 text-sky-700 font-bold hover:underline"
                >
                  <span>Advance to Next Topic</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400 bg-white/60">
              Select a lesson from the curriculum on the left to read notes and watch videos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
