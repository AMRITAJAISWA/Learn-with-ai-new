"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, BrainCircuit, PlayCircle, Users, CheckCircle2 } from "lucide-react";

interface StickyScrollFramePlayerProps {
  totalFrames?: number;
}

export function StickyScrollFramePlayer({ totalFrames = 148 }: StickyScrollFramePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Store preloaded images in a persistent ref cache
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const lastDrawnFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);

  // Helper to format frame number e.g. 1 -> "001"
  const getFrameUrl = useCallback((index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/frames/ezgif-frame-${padded}.png`;
  }, []);

  // Preload a single frame
  const preloadFrame = useCallback(
    (index: number): Promise<HTMLImageElement> => {
      if (imageCacheRef.current.has(index)) {
        return Promise.resolve(imageCacheRef.current.get(index)!);
      }
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          imageCacheRef.current.set(index, img);
          resolve(img);
        };
        img.onerror = () => {
          resolve(img); // resolve gracefully
        };
      });
    },
    [getFrameUrl]
  );

  // Draw frame to canvas maintaining aspect ratio
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imageCacheRef.current.get(frameIndex);
    // If target frame not loaded yet, use closest available frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = imageCacheRef.current.get(lastDrawnFrameRef.current);
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate cover / contain sizing
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    lastDrawnFrameRef.current = frameIndex;
  }, []);

  // Initial preload of first 10 frames
  useEffect(() => {
    let isMounted = true;
    const initialPromises = [];
    for (let i = 1; i <= Math.min(12, totalFrames); i++) {
      initialPromises.push(preloadFrame(i));
    }

    Promise.all(initialPromises).then(() => {
      if (!isMounted) return;
      setIsLoadingInitial(false);
      drawFrame(1);
    });

    return () => {
      isMounted = false;
    };
  }, [totalFrames, preloadFrame, drawFrame]);

  // Handle Canvas Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawFrame(lastDrawnFrameRef.current);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  // Scroll tracking and dynamic window preloader
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = containerRef.current!.getBoundingClientRect();
          const scrollableDistance = rect.height - window.innerHeight;

          if (scrollableDistance <= 0) {
            ticking = false;
            return;
          }

          // Progress from 0 to 1
          const rawProgress = -rect.top / scrollableDistance;
          const progress = Math.min(Math.max(rawProgress, 0), 1);
          setScrollProgress(progress);

          const frameIdx = Math.min(
            totalFrames,
            Math.max(1, Math.round(1 + progress * (totalFrames - 1)))
          );

          targetFrameRef.current = frameIdx;
          setCurrentFrame(frameIdx);

          // Dynamic preloader: preload a window around target frame [frameIdx - 3, frameIdx + 12]
          const start = Math.max(1, frameIdx - 3);
          const end = Math.min(totalFrames, frameIdx + 12);
          for (let i = start; i <= end; i++) {
            if (!imageCacheRef.current.has(i)) {
              preloadFrame(i);
            }
          }

          drawFrame(frameIdx);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalFrames, preloadFrame, drawFrame]);

  // Overlay phase details
  const getPhaseContent = () => {
    if (scrollProgress < 0.28) {
      return {
        badge: "Phase 1 • Goal Analysis",
        icon: BrainCircuit,
        title: "Personalized Course Synthesis",
        desc: "LearnWithAI ingests your background, time budget, and target milestones to synthesize a complete modular curriculum.",
        stat: "Custom Syllabus • Tailored to Skill Level",
      };
    } else if (scrollProgress < 0.56) {
      return {
        badge: "Phase 2 • Knowledge Curation",
        icon: PlayCircle,
        title: "Smart Educational Video Engine",
        desc: "Contextually queries high-yield YouTube lectures and verified resources filtered by exact difficulty and learning goals.",
        stat: "Zero Clickbait • Concept Focused",
      };
    } else if (scrollProgress < 0.82) {
      return {
        badge: "Phase 3 • Active Mastery",
        icon: Sparkles,
        title: "AI Tutor & Spaced Revision",
        desc: "Solve step-by-step doubts, generate instant diagnostic quizzes, and automatically schedule spaced-repetition flashcards.",
        stat: "Active Recall • Weak Spot Detection",
      };
    } else {
      return {
        badge: "Phase 4 • Peer Synergy",
        icon: Users,
        title: "Compatible Study Buddy Matching",
        desc: "Match with students studying the same concepts on compatible schedules. Collaborate in real-time study sessions.",
        stat: "Higher Retention • Collaborative Learning",
      };
    }
  };

  const phase = getPhaseContent();
  const PhaseIcon = phase.icon;

  return (
    <section ref={containerRef} className="relative h-[320vh] bg-slate-900 text-white">
      {/* Sticky Frame Container */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        {/* Background ambient glowing gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950" />

        {/* Top Header Floating Badge */}
        <div className="absolute top-6 z-20 flex items-center gap-3 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md shadow-lg">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Scrollytelling Experience</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-sky-400">
            Frame {currentFrame} / {totalFrames}
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-400">{Math.round(scrollProgress * 100)}%</span>
        </div>

        {/* Canvas Visual Area */}
        <div className="relative mx-auto flex h-[62vh] w-[90vw] max-w-5xl items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 p-2 shadow-2xl shadow-sky-950/40 backdrop-blur-sm md:h-[70vh]">
          {isLoadingInitial && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 text-sm text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              <span>Optimizing 148-frame cinematic animation...</span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="h-full w-full rounded-xl object-contain shadow-inner"
          />

          {/* Bottom Floating Step Card */}
          <div className="absolute -bottom-8 left-4 right-4 z-20 mx-auto max-w-xl md:left-8 md:right-auto">
            <div className="rounded-xl border border-sky-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md transition-all duration-300">
              <div className="flex items-center justify-between pb-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
                  <PhaseIcon className="h-3.5 w-3.5" />
                  {phase.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  {phase.stat}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{phase.title}</h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">{phase.desc}</p>

              {/* Progress track */}
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-100"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint indicator */}
        <div className="absolute bottom-4 z-10 flex flex-col items-center text-xs text-slate-400">
          <span>Scroll down to advance the learning journey</span>
          <div className="mt-1 h-4 w-0.5 animate-bounce bg-sky-400" />
        </div>
      </div>
    </section>
  );
}
