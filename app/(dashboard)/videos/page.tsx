"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  PlaySquare,
  Search,
  Clock,
  Sparkles,
  ExternalLink,
  Play,
  X,
  CheckCircle2,
} from "lucide-react";
import type { RecommendedVideo } from "@/lib/youtube/videoService";

const POPULAR_TOPICS = [
  "Java",
  "Python",
  "React JS",
  "Data Structures",
  "C++",
  "Machine Learning",
  "System Design",
];

function VideosContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "Python Data Structures & Algorithms";

  const [query, setQuery] = useState(initialQuery);
  const [difficulty, setDifficulty] = useState("All");
  const [duration, setDuration] = useState("All");
  const [videos, setVideos] = useState<RecommendedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModalVideo, setActiveModalVideo] = useState<RecommendedVideo | null>(null);

  const loadVideos = async (q: string, diff: string, dur: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: q.trim() || "Computer Science",
        difficulty: diff,
        duration: dur,
      });
      const res = await fetch(`/api/videos/recommendations?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.videos)) {
        setVideos(data.videos);
      }
    } catch (e) {
      console.error("Failed to load video recommendations:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos(query, difficulty, duration);
  }, [difficulty, duration]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    loadVideos(query, difficulty, duration);
  };

  const handleTopicChipClick = (topic: string) => {
    setQuery(topic);
    loadVideos(topic, difficulty, duration);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
          Curated Visual Learning
        </span>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
          Educational Video Recommendations
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          High-yield educational lectures filtered for conceptual depth, verified instructors, and zero clickbait.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topic (e.g. Java, Python, Binary Trees, React, Machine Learning)..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-3.5 w-3.5" />
                <span>Search Videos</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Topic Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Popular Topics:
          </span>
          {POPULAR_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleTopicChipClick(topic)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                query.toLowerCase() === topic.toLowerCase()
                  ? "bg-rose-50 text-rose-700 border-rose-200 shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Difficulty:
            </span>
            {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                  difficulty === d
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Duration:
            </span>
            {["All", "Short", "Long"].map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setDuration(dur)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                  duration === dur
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {dur === "Short" ? "Short (<30m)" : dur === "Long" ? "Deep Dive (>45m)" : "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-300 transition-all group"
            >
              <div>
                {/* Thumbnail container */}
                <div
                  onClick={() => setActiveModalVideo(video)}
                  className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center group-hover:bg-slate-950/20 transition-colors">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded-md bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white">
                    {video.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">
                      {video.channel}
                    </span>
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-700 border border-rose-100">
                      {video.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
                    {video.title}
                  </h3>

                  {/* AI reason pill */}
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-sky-700 mb-0.5">
                      <Sparkles className="h-3 w-3 text-sky-500" />
                      <span>Why AI Recommends This:</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {video.aiReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalVideo(video)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  <Play className="h-3 w-3 fill-rose-600" />
                  <span>Watch in Focus Mode</span>
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <span>YouTube</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Focus Mode Embedded Video Modal */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-3xl border border-slate-700 bg-slate-900 text-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  Focus Learning Mode
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {activeModalVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeModalVideo.youtubeId}?autoplay=1`}
                title={activeModalVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Channel: {activeModalVideo.channel}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Ad-free educational environment
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
        </div>
      }
    >
      <VideosContent />
    </Suspense>
  );
}
