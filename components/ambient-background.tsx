"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION } from "@/lib/gsap";
import { publishAnchor, clearAnchors } from "@/lib/ambient";

type Orb = {
  id: number;
  /** Base position as viewport fractions. */
  baseX: number;
  baseY: number;
  /** Radius as a fraction of the larger viewport dimension. */
  radiusScale: number;
  /** Parallax factor — how strongly scroll displaces the orb. */
  depth: number;
  driftX: number;
  driftY: number;
  speed: number;
  phase: number;
  color: [number, number, number];
  alpha: number;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  depth: number;
  drift: number;
  alpha: number;
  accent: boolean;
};

const ORBS: readonly Orb[] = [
  // Lime — the brand accent, kept top-right where the hero name sits.
  {
    id: 0,
    baseX: 0.84,
    baseY: 0.22,
    radiusScale: 0.3,
    depth: 0.14,
    driftX: 0.055,
    driftY: 0.045,
    speed: 0.00016,
    phase: 0.4,
    color: [205, 241, 56],
    alpha: 0.1,
  },
  {
    id: 1,
    baseX: 0.12,
    baseY: 0.6,
    radiusScale: 0.3,
    depth: 0.22,
    driftX: 0.05,
    driftY: 0.06,
    speed: 0.00012,
    phase: 2.3,
    color: [139, 92, 246],
    alpha: 0.085,
  },
  {
    id: 2,
    baseX: 0.68,
    baseY: 0.88,
    radiusScale: 0.24,
    depth: 0.3,
    driftX: 0.06,
    driftY: 0.04,
    speed: 0.0002,
    phase: 4.1,
    color: [94, 234, 212],
    alpha: 0.07,
  },
  {
    id: 3,
    baseX: 0.28,
    baseY: 0.08,
    radiusScale: 0.2,
    depth: 0.09,
    driftX: 0.04,
    driftY: 0.05,
    speed: 0.00014,
    phase: 5.6,
    color: [96, 165, 250],
    alpha: 0.06,
  },
] as const;

const wrap = (value: number, min: number, max: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

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
    let particles: Particle[] = [];

    let smoothScroll = window.scrollY;
    let lastScroll = window.scrollY;
    let velocity = 0;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 768 ? 42 : 90;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: rand(0.8, 1.9),
          depth: rand(0.06, 0.42),
          drift: rand(0.004, 0.016),
          alpha: rand(0.08, 0.3),
          accent: Math.random() < 0.14,
        });
      }
    };

    const draw = (time: number) => {
      // Smooth the scroll signal so the background glides even on
      // instant jumps (anchor links, reduced Lenis inertia, mobile flicks).
      const target = window.scrollY;
      smoothScroll += (target - smoothScroll) * 0.09;
      velocity += (target - lastScroll - velocity) * 0.1;
      lastScroll = target;

      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - height, 1);
      const progress = Math.min(Math.max(smoothScroll / maxScroll, 0), 1);
      const vel = Math.max(-60, Math.min(60, velocity));

      ctx.clearRect(0, 0, width, height);

      // --- Particle dust field, parallax-scrolled by depth ---
      const streak = Math.min(Math.abs(vel) * 0.35, 16);
      for (const p of particles) {
        const px = wrap(p.x + Math.sin(time * 0.0002 + p.y) * 12, -8, width + 8);
        const py = wrap(
          p.y + time * p.drift - smoothScroll * p.depth,
          -12,
          height + 12
        );
        const a = p.alpha * (0.75 + Math.sin(time * 0.001 + p.x) * 0.25);
        ctx.fillStyle = p.accent
          ? `rgba(205, 241, 56, ${a})`
          : `rgba(240, 239, 233, ${a})`;
        const stretch = streak * p.depth * 2.4;
        if (stretch > 1.5) {
          ctx.fillRect(
            px - p.size / 2,
            py - stretch * Math.sign(vel),
            p.size,
            p.size + stretch
          );
        } else {
          ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
        }
      }

      // --- Aurora orbs ---
      ctx.globalCompositeOperation = "lighter";
      const dim = Math.max(width, height);

      for (const orb of ORBS) {
        const t = time * orb.speed + orb.phase;
        const radius = orb.radiusScale * dim;

        // Continuous idle drift + a slow sweep tied to overall page progress.
        const driftX =
          Math.sin(t) * orb.driftX * width +
          Math.sin(progress * Math.PI * 2 + orb.phase) * width * 0.06;
        const driftY = Math.cos(t * 0.9) * orb.driftY * height;

        const x = orb.baseX * width + driftX;
        const rawY = orb.baseY * height + driftY - smoothScroll * orb.depth;
        const y = wrap(rawY, -radius, height + radius);

        // Scroll velocity stretches the glow and lifts its intensity.
        const energy = Math.min(Math.abs(vel) / 60, 1);
        const alpha = orb.alpha * (1 + energy * 0.55);
        const stretchY = 1 + energy * 0.28;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, stretchY);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        const [r, g, b] = orb.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Bright core node — the landing point for connector lines.
        const pulse = 1.6 + Math.sin(time * 0.0016 + orb.phase * 2) * 0.5;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.5 + energy * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.fill();

        publishAnchor({ id: orb.id, x, y, radius: pulse + 4 });
      }
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
