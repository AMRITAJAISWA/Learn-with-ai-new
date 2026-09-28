"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface GlobalScrollFrameAnimationProps {
  totalFrames?: number;
}

/**
 * Universal Global Full-Viewport Background Robot Animation
 * Replaces the plain white background across the ENTIRE website with the 148-frame
 * 3D Robot learning mascot video layer.
 *
 * Features:
 * - Covers the full viewport across all sections and pages (fixed inset-0 -z-10)
 * - Smoothly plays and scrubs dynamically as the user scrolls
 * - Dual motion engine: responsive scroll scrubbing + smooth continuous playback
 * - Translucent ambient contrast scrim ensures 100% legibility of text, cards, and buttons
 * - High-speed sliding-window preloader with zero memory leaks
 * - Fully responsive on mobile, tablet, and desktop (aspect-ratio cover math)
 */
export function GlobalScrollFrameAnimation({
  totalFrames = 148,
}: GlobalScrollFrameAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrameFloatRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);
  const isPreloadingRef = useRef<boolean>(false);
  const lastScrollTimeRef = useRef<number>(Date.now());

  // Helper to format frame number e.g. 1 -> "/frames/ezgif-frame-001.png"
  const getFrameUrl = useCallback((index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/frames/ezgif-frame-${padded}.png`;
  }, []);

  // Preload a single frame safely
  const preloadFrame = useCallback(
    (index: number): Promise<HTMLImageElement | null> => {
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
          resolve(null);
        };
      });
    },
    [getFrameUrl]
  );

  // Proactive sliding-window preloader (keeps memory light and fast)
  const preloadWindow = useCallback(
    async (centerFrame: number) => {
      if (isPreloadingRef.current) return;
      isPreloadingRef.current = true;

      const start = Math.max(1, centerFrame - 6);
      const end = Math.min(totalFrames, centerFrame + 18);

      const promises: Promise<any>[] = [];
      for (let i = start; i <= end; i++) {
        if (!imageCacheRef.current.has(i)) {
          promises.push(preloadFrame(i));
        }
      }
      await Promise.all(promises);

      // Memory cleanup: discard frames outside active window to prevent leaks
      if (imageCacheRef.current.size > 50) {
        for (const [key] of imageCacheRef.current) {
          if (key < centerFrame - 20 || key > centerFrame + 30) {
            imageCacheRef.current.delete(key);
          }
        }
      }

      isPreloadingRef.current = false;
    },
    [preloadFrame, totalFrames]
  );

  // Draw frame to full-viewport canvas with aspect-ratio cover math
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let img = imageCacheRef.current.get(frameIndex);
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = imageCacheRef.current.get(lastDrawnFrameRef.current);
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Aspect-ratio cover math: fills full viewport with 0 letterboxing
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

  // Initial preload of startup frames
  useEffect(() => {
    for (let i = 1; i <= Math.min(16, totalFrames); i++) {
      preloadFrame(i);
    }
  }, [preloadFrame, totalFrames]);

  // Handle global scroll across the whole website
  useEffect(() => {
    const handleScroll = () => {
      lastScrollTimeRef.current = Date.now();

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight || 1;
      const winHeight = window.innerHeight || 1;
      const maxScroll = Math.max(1, docHeight - winHeight);

      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const target = Math.min(
        totalFrames,
        Math.max(1, Math.round(progress * (totalFrames - 1)) + 1)
      );

      targetFrameRef.current = target;
      preloadWindow(target);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalFrames, preloadWindow]);

  // Handle responsive viewport resize
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(lastDrawnFrameRef.current);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [drawFrame]);

  // Smooth continuous playback & scroll scrubbing loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const timeSinceScroll = Date.now() - lastScrollTimeRef.current;
      const isActivelyScrolling = timeSinceScroll < 600;

      if (isActivelyScrolling) {
        // Fast, smooth spring lerp to target scroll frame
        const diff = targetFrameRef.current - currentFrameFloatRef.current;
        currentFrameFloatRef.current += diff * 0.18;
      } else {
        // Continuous smooth ambient video playback when idle
        // Gently advances through the video loop so the robot is always moving
        currentFrameFloatRef.current += delta * 12.0; // 12 FPS gentle ambient speed
        if (currentFrameFloatRef.current > totalFrames) {
          currentFrameFloatRef.current = 1;
        }
      }

      const frameToDraw = Math.min(
        totalFrames,
        Math.max(1, Math.round(currentFrameFloatRef.current))
      );

      if (frameToDraw !== lastDrawnFrameRef.current) {
        drawFrame(frameToDraw);
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [drawFrame, totalFrames]);

  return (
    <div
      className="fixed inset-0 w-screen h-screen -z-50 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Full Viewport HTML5 Canvas - 100% Crystal Clear & Bright */}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover filter contrast-[1.05] brightness-[1.03]"
      />

      {/* Ultra-subtle edge vignette to preserve text contrast without dimming the robot */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none" />
    </div>
  );
}
