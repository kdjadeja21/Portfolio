"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION } from "@/lib/gsap";
import { publishAnchor, clearAnchors } from "@/lib/ambient";

type FlowLine = {
  id: number;
  baseY: number;
  amplitude: number;
  wavelength: number;
  speed: number;
  depth: number;
  phase: number;
  width: number;
  alpha: number;
  accent: boolean;
};

type Grain = {
  x: number;
  y: number;
  size: number;
  speed: number;
  depth: number;
  alpha: number;
};

const FLOW_LINES: readonly FlowLine[] = [
  {
    id: 0,
    baseY: 0.18,
    amplitude: 0.12,
    wavelength: 0.62,
    speed: 0.00018,
    depth: 0.16,
    phase: 0.2,
    width: 1.2,
    alpha: 0.34,
    accent: true,
  },
  {
    id: 1,
    baseY: 0.34,
    amplitude: 0.18,
    wavelength: 0.78,
    speed: 0.00014,
    depth: 0.22,
    phase: 1.8,
    width: 0.85,
    alpha: 0.18,
    accent: false,
  },
  {
    id: 2,
    baseY: 0.58,
    amplitude: 0.16,
    wavelength: 0.7,
    speed: 0.0002,
    depth: 0.3,
    phase: 3.2,
    width: 1,
    alpha: 0.22,
    accent: true,
  },
  {
    id: 3,
    baseY: 0.78,
    amplitude: 0.14,
    wavelength: 0.85,
    speed: 0.00012,
    depth: 0.38,
    phase: 4.7,
    width: 0.75,
    alpha: 0.14,
    accent: false,
  },
  {
    id: 4,
    baseY: 0.96,
    amplitude: 0.11,
    wavelength: 0.54,
    speed: 0.00024,
    depth: 0.44,
    phase: 5.6,
    width: 1.4,
    alpha: 0.24,
    accent: true,
  },
] as const;

const wrap = (value: number, min: number, max: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION).matches;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let grains: Grain[] = [];

    let smoothScroll = window.scrollY;
    let lastScroll = window.scrollY;
    let velocity = 0;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      grains = [];
      const grainCount = width < 768 ? 34 : 76;
      for (let i = 0; i < grainCount; i++) {
        grains.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: rand(0.8, 1.8),
          speed: rand(0.01, 0.035),
          depth: rand(0.08, 0.34),
          alpha: rand(0.05, 0.18),
        });
      }
    };

    const flowPoint = (
      flow: FlowLine,
      x: number,
      time: number,
      progress: number,
      scroll: number,
      energy: number
    ) => {
      const base = flow.baseY * height - scroll * flow.depth;
      const wave =
        Math.sin(
          x / (width * flow.wavelength) +
            time * flow.speed +
            progress * Math.PI * 2 +
            flow.phase
        ) *
        flow.amplitude *
        height;
      const crossWave =
        Math.sin(
          x / (width * flow.wavelength * 0.42) +
            time * flow.speed * 0.62 +
            flow.phase * 1.7
        ) *
        flow.amplitude *
        height *
        0.42;
      const pull = Math.sin(progress * Math.PI + flow.phase) * height * 0.08;

      return wrap(base + wave + crossWave + pull + energy * height * 0.04, -180, height + 180);
    };

    const drawFlow = (
      flow: FlowLine,
      time: number,
      progress: number,
      scroll: number,
      energy: number
    ) => {
      const skew = velocity * 0.26;
      const step = Math.max(34, width / 24);

      const points: { x: number; y: number }[] = [];
      for (let x = -step; x <= width + step; x += step) {
        const y = flowPoint(flow, x, time, progress, scroll, energy);
        const shiftedX = x + Math.sin(y * 0.008 + flow.phase) * 18 + skew;
        points.push({ x: shiftedX, y });
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);

      const lineAlpha = flow.alpha + energy * 0.18;
      ctx.lineWidth = flow.width + energy * 1.25;
      ctx.strokeStyle = flow.accent
        ? `rgba(205, 241, 56, ${lineAlpha})`
        : `rgba(240, 239, 233, ${lineAlpha})`;
      ctx.shadowBlur = flow.accent ? 20 + energy * 28 : 14 + energy * 18;
      ctx.shadowColor = flow.accent
        ? "rgba(205, 241, 56, 0.35)"
        : "rgba(240, 239, 233, 0.14)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      const anchorX =
        width *
        (0.16 +
          0.7 *
            ((Math.sin(time * flow.speed * 1.8 + flow.phase + progress * 4) +
              1) /
              2));
      const anchorY = flowPoint(flow, anchorX, time, progress, scroll, energy);
      const bead = flow.accent ? 3.2 + energy * 1.4 : 2.4 + energy;

      ctx.fillStyle = flow.accent
        ? `rgba(205, 241, 56, ${0.65 + energy * 0.25})`
        : `rgba(240, 239, 233, ${0.36 + energy * 0.2})`;
      ctx.beginPath();
      ctx.arc(anchorX + skew, anchorY, bead, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = flow.accent
        ? "rgba(205, 241, 56, 0.08)"
        : "rgba(240, 239, 233, 0.045)";
      ctx.beginPath();
      ctx.arc(anchorX + skew, anchorY, bead * 6, 0, Math.PI * 2);
      ctx.fill();

      publishAnchor({
        id: flow.id,
        x: anchorX + skew,
        y: anchorY,
        radius: bead + 4,
      });
    };

    const draw = (time: number) => {
      const target = window.scrollY;
      smoothScroll += (target - smoothScroll) * 0.095;
      velocity += (target - lastScroll - velocity) * 0.12;
      lastScroll = target;

      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - height, 1);
      const progress = clamp(smoothScroll / maxScroll, 0, 1);
      const energy = clamp(Math.abs(velocity) / 72, 0, 1);

      ctx.clearRect(0, 0, width, height);

      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        height * 0.1,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.75
      );
      vignette.addColorStop(0, "rgba(205, 241, 56, 0.045)");
      vignette.addColorStop(0.42, "rgba(20, 18, 11, 0.02)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.42)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      for (const grain of grains) {
        const x = wrap(
          grain.x + Math.sin(time * 0.00022 + grain.y) * 18,
          -12,
          width + 12
        );
        const y = wrap(
          grain.y + time * grain.speed - smoothScroll * grain.depth,
          -12,
          height + 12
        );
        const alpha =
          grain.alpha * (0.65 + Math.sin(time * 0.001 + grain.x) * 0.35);
        ctx.fillStyle = `rgba(240, 239, 233, ${alpha})`;
        ctx.fillRect(x, y, grain.size, grain.size);
      }

      ctx.globalCompositeOperation = "lighter";
      for (const flow of FLOW_LINES) {
        drawFlow(flow, time, progress, smoothScroll, energy);
      }

      // A soft scanline that travels with page progress, hinting at a
      // scroll engine underneath without copying the Lenis identity.
      const scanY = height * (0.18 + progress * 0.64);
      const scan = ctx.createLinearGradient(0, scanY - 90, 0, scanY + 90);
      scan.addColorStop(0, "rgba(205, 241, 56, 0)");
      scan.addColorStop(0.5, `rgba(205, 241, 56, ${0.035 + energy * 0.04})`);
      scan.addColorStop(1, "rgba(205, 241, 56, 0)");
      ctx.fillStyle = scan;
      ctx.fillRect(0, scanY - 90, width, 180);
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (time: number) => {
      if (!document.hidden) draw(time);
      rafId = requestAnimationFrame(loop);
    };

    build();

    if (reducedMotion) {
      draw(0);
      clearAnchors();
    } else {
      rafId = requestAnimationFrame(loop);
    }

    const onResize = () => {
      build();
      if (reducedMotion) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      clearAnchors();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
