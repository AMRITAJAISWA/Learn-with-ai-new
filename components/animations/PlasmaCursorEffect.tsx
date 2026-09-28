"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * High-Performance Eulerian Fluid Plasma Simulation
 * Faithfully mirrors the TypeGPU Navier-Stokes fluid dynamics from CursorGesture/:
 * - Incompressible fluid grid with velocity (u, v) and multi-channel plasma dye
 * - Advection via Semi-Lagrangian backtracing with bilinear interpolation
 * - Divergence calculation & Poisson pressure solve (Jacobi relaxation)
 * - Incompressibility projection (subtracting pressure gradient)
 * - Mouse & touch brush impulse injection with Gaussian spatial falloff exp(-r^2/R^2)
 * - Chromatic plasma color mapping (electric cyan, neon violet, cosmic magenta, amber)
 * - Streamline vortex particles that ride the fluid velocity field
 */
export function PlasmaCursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("learnwithai_plasma_enabled");
    if (saved !== null) {
      setIsEnabled(saved === "true");
    }

    const handleToggle = (e: CustomEvent<{ enabled: boolean }>) => {
      setIsEnabled(e.detail.enabled);
    };

    window.addEventListener("toggle-plasma" as any, handleToggle);
    return () => {
      window.removeEventListener("toggle-plasma" as any, handleToggle);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Simulation grid dimensions (matching CursorGesture SIM_N)
    const SIM_W = 128;
    const SIM_H = 128;
    const SIM_SIZE = SIM_W * SIM_H;

    // Fluid fields: double buffered for velocity, density, and pressure
    let u0 = new Float32Array(SIM_SIZE);
    let u1 = new Float32Array(SIM_SIZE);
    let v0 = new Float32Array(SIM_SIZE);
    let v1 = new Float32Array(SIM_SIZE);

    // Multi-component plasma dye channels: R, G, B
    let r0 = new Float32Array(SIM_SIZE);
    let r1 = new Float32Array(SIM_SIZE);
    let g0 = new Float32Array(SIM_SIZE);
    let g1 = new Float32Array(SIM_SIZE);
    let b0 = new Float32Array(SIM_SIZE);
    let b1 = new Float32Array(SIM_SIZE);

    let div = new Float32Array(SIM_SIZE);
    let p0 = new Float32Array(SIM_SIZE);
    let p1 = new Float32Array(SIM_SIZE);

    // Streamline plasma particles that travel along fluid velocities
    const NUM_STREAMLINE_PARTICLES = 120;
    interface StreamlineParticle {
      x: number;
      y: number;
      age: number;
      life: number;
      hue: number;
      size: number;
    }
    const streamlineParticles: StreamlineParticle[] = [];

    for (let i = 0; i < NUM_STREAMLINE_PARTICLES; i++) {
      streamlineParticles.push({
        x: Math.random() * SIM_W,
        y: Math.random() * SIM_H,
        age: Math.random() * 100,
        life: 60 + Math.random() * 60,
        hue: 180 + Math.random() * 90,
        size: 1 + Math.random() * 2,
      });
    }

    // Color cycle for mouse injection
    let colorCycle = 0;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Offscreen render canvas for blitting the simulation grid
    const offscreen = document.createElement("canvas");
    offscreen.width = SIM_W;
    offscreen.height = SIM_H;
    const offCtx = offscreen.getContext("2d");
    const imgData = offCtx ? offCtx.createImageData(SIM_W, SIM_H) : null;

    let animId: number;
    let prevMouseX = -1;
    let prevMouseY = -1;
    let mouseDeltaX = 0;
    let mouseDeltaY = 0;
    let isMouseDown = false;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Helper: grid coordinate clamping
    const idx = (x: number, y: number) => {
      const cx = x < 0 ? 0 : x >= SIM_W ? SIM_W - 1 : x;
      const cy = y < 0 ? 0 : y >= SIM_H ? SIM_H - 1 : y;
      return cy * SIM_W + cx;
    };

    // Bilinear interpolation sampling
    const sampleField = (field: Float32Array, x: number, y: number): number => {
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const x1 = Math.min(SIM_W - 1, x0 + 1);
      const y1 = Math.min(SIM_H - 1, y0 + 1);
      const s1 = x - x0;
      const s0 = 1 - s1;
      const t1 = y - y0;
      const t0 = 1 - t1;

      return (
        s0 * (t0 * field[idx(x0, y0)] + t1 * field[idx(x0, y1)]) +
        s1 * (t0 * field[idx(x1, y0)] + t1 * field[idx(x1, y1)])
      );
    };

    // 1. Fluid Advection (Semi-Lagrangian backtracing)
    const advect = (
      src: Float32Array,
      dst: Float32Array,
      uField: Float32Array,
      vField: Float32Array,
      dt: number
    ) => {
      for (let y = 0; y < SIM_H; y++) {
        for (let x = 0; x < SIM_W; x++) {
          const i = y * SIM_W + x;
          const px = x - uField[i] * dt;
          const py = y - vField[i] * dt;
          dst[i] = sampleField(src, px, py);
        }
      }
    };

    // 2. Compute Divergence of velocity field
    const computeDivergence = (uField: Float32Array, vField: Float32Array) => {
      for (let y = 1; y < SIM_H - 1; y++) {
        for (let x = 1; x < SIM_W - 1; x++) {
          const i = y * SIM_W + x;
          const du = uField[i + 1] - uField[i - 1];
          const dv = vField[i + SIM_W] - vField[i - SIM_W];
          div[i] = -0.5 * (du + dv);
          p0[i] = 0; // reset initial pressure estimate
        }
      }
    };

    // 3. Pressure Poisson solve via Jacobi relaxation (matching CursorGesture params.jacobiIter)
    const solvePressure = (iterations = 10) => {
      for (let it = 0; it < iterations; it++) {
        for (let y = 1; y < SIM_H - 1; y++) {
          for (let x = 1; x < SIM_W - 1; x++) {
            const i = y * SIM_W + x;
            p1[i] =
              (div[i] +
                p0[i - 1] +
                p0[i + 1] +
                p0[i - SIM_W] +
                p0[i + SIM_W]) *
              0.25;
          }
        }
        // Swap pressure buffers
        const tmp = p0;
        p0 = p1;
        p1 = tmp;
      }
    };

    // 4. Project: Subtract pressure gradient to make field divergence-free (incompressible)
    const project = (
      uDst: Float32Array,
      vDst: Float32Array,
      uSrc: Float32Array,
      vSrc: Float32Array,
      pField: Float32Array
    ) => {
      for (let y = 1; y < SIM_H - 1; y++) {
        for (let x = 1; x < SIM_W - 1; x++) {
          const i = y * SIM_W + x;
          uDst[i] = uSrc[i] - 0.5 * (pField[i + 1] - pField[i - 1]);
          vDst[i] = vSrc[i] - 0.5 * (pField[i + SIM_W] - pField[i - SIM_W]);
        }
      }
    };

    // 5. Ingest mouse brush impulse (matching brushFn in simulation.ts)
    const injectBrush = (
      gx: number,
      gy: number,
      dx: number,
      dy: number,
      strength: number = 1.0
    ) => {
      const radius = 9;
      const radiusSq = radius * radius;
      const forceScale = 0.85 * strength;

      // Dynamic plasma color based on hue cycling
      colorCycle += 0.05;
      const rVal = Math.sin(colorCycle) * 0.5 + 0.5;
      const gVal = Math.sin(colorCycle + 2.0) * 0.5 + 0.5;
      const bVal = Math.sin(colorCycle + 4.0) * 0.5 + 0.5;

      const minX = Math.max(1, Math.floor(gx - radius));
      const maxX = Math.min(SIM_W - 2, Math.ceil(gx + radius));
      const minY = Math.max(1, Math.floor(gy - radius));
      const maxY = Math.min(SIM_H - 2, Math.ceil(gy + radius));

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const distSq = (x - gx) * (x - gx) + (y - gy) * (y - gy);
          if (distSq < radiusSq) {
            const weight = Math.exp(-distSq / radiusSq);
            const i = y * SIM_W + x;

            u0[i] += dx * forceScale * weight;
            v0[i] += dy * forceScale * weight;

            r0[i] += rVal * 1.5 * weight;
            g0[i] += gVal * 1.5 * weight;
            b0[i] += bVal * 1.8 * weight;
          }
        }
      }
    };

    // Pointer events
    const handlePointerMove = (e: PointerEvent) => {
      const gx = (e.clientX / width) * SIM_W;
      const gy = (e.clientY / height) * SIM_H;

      if (prevMouseX >= 0 && prevMouseY >= 0) {
        mouseDeltaX = gx - prevMouseX;
        mouseDeltaY = gy - prevMouseY;
        injectBrush(gx, gy, mouseDeltaX, mouseDeltaY, isMouseDown ? 2.5 : 1.2);
      }

      prevMouseX = gx;
      prevMouseY = gy;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isMouseDown = true;
      const gx = (e.clientX / width) * SIM_W;
      const gy = (e.clientY / height) * SIM_H;
      // High-energy vortex splat on click
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const dx = Math.cos(angle) * 4.0;
        const dy = Math.sin(angle) * 4.0;
        injectBrush(gx + dx, gy + dy, dx * 1.5, dy * 1.5, 3.0);
      }
    };

    const handlePointerUp = () => {
      isMouseDown = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    // Main 60 FPS Fluid Simulation Step
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.033) * 18.0;
      lastTime = time;

      // 1. Advect velocity field
      advect(u0, u1, u0, v0, dt);
      advect(v0, v1, u0, v0, dt);

      // 2. Project velocity to maintain incompressibility
      computeDivergence(u1, v1);
      solvePressure(8);
      project(u0, v0, u1, v1, p0);

      // 3. Advect dye channels
      advect(r0, r1, u0, v0, dt);
      advect(g0, g1, u0, v0, dt);
      advect(b0, b1, u0, v0, dt);

      // Copy back with slight decay / dissipation
      for (let i = 0; i < SIM_SIZE; i++) {
        r0[i] = r1[i] * 0.985;
        g0[i] = g1[i] * 0.985;
        b0[i] = b1[i] * 0.988;
        u0[i] *= 0.99;
        v0[i] *= 0.99;
      }

      // 4. Update offscreen ImageData with glowing plasma colors
      if (imgData && offCtx) {
        const data = imgData.data;
        for (let i = 0; i < SIM_SIZE; i++) {
          const pIdx = i * 4;
          const r = r0[i];
          const g = g0[i];
          const b = b0[i];
          const density = Math.min(1.0, Math.max(0, (r + g + b) * 0.33));

          // Plasma chromatic mapping: cyan, electric violet, blue glow
          data[pIdx] = Math.min(255, Math.floor((r * 0.8 + b * 0.4) * 255));
          data[pIdx + 1] = Math.min(255, Math.floor((g * 0.9 + r * 0.2) * 255));
          data[pIdx + 2] = Math.min(255, Math.floor((b * 1.0 + g * 0.3) * 255));
          data[pIdx + 3] = Math.min(255, Math.floor(density * 220));
        }

        offCtx.putImageData(imgData, 0, 0);

        // 5. Draw to main canvas with smoothing & additive blending
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(offscreen, 0, 0, width, height);

        // 6. Render fluid velocity streamlines & particles for extra depth
        ctx.fillStyle = "rgba(125, 211, 252, 0.4)";
        for (let i = 0; i < streamlineParticles.length; i++) {
          const sp = streamlineParticles[i];
          const gx = Math.floor(sp.x);
          const gy = Math.floor(sp.y);
          const fIdx = idx(gx, gy);

          const vx = u0[fIdx];
          const vy = v0[fIdx];

          sp.x += vx * 0.8;
          sp.y += vy * 0.8;
          sp.age++;

          if (sp.age > sp.life || sp.x < 0 || sp.x >= SIM_W || sp.y < 0 || sp.y >= SIM_H) {
            sp.x = Math.random() * SIM_W;
            sp.y = Math.random() * SIM_H;
            sp.age = 0;
          }

          const screenX = (sp.x / SIM_W) * width;
          const screenY = (sp.y / SIM_H) * height;
          const speed = Math.sqrt(vx * vx + vy * vy);

          if (speed > 0.05) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, sp.size * Math.min(2.5, speed * 2), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${sp.hue}, 90%, 65%, ${Math.min(0.6, speed * 0.5)})`;
            ctx.fill();
          }
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
      aria-hidden="true"
    />
  );
}
