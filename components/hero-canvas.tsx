"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION } from "@/lib/gsap";

const GAP = 26;
const POINTER_RADIUS = 170;

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let dots: { x: number; y: number }[] = [];
    let rafId = 0;
    let inView = true;
    const pointer = { x: -9999, y: -9999 };

    const build = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) {
          dots.push({ x, y });
        }
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const dist = Math.hypot(dx, dy);

        const idle = reducedMotion
          ? 0.4
          : (Math.sin((dot.x + dot.y) * 0.02 + time * 0.0011) + 1) * 0.5;

        let x = dot.x;
        let y = dot.y;
        let alpha = 0.07 + idle * 0.08;
        let size = 1.1;
        let accent = false;

        if (dist < POINTER_RADIUS) {
          const force = 1 - dist / POINTER_RADIUS;
          const push = force * force * 16;
          const norm = dist || 1;
          x += (dx / norm) * push;
          y += (dy / norm) * push;
          alpha = 0.2 + force * 0.75;
          size = 1.1 + force * 1.4;
          accent = force > 0.2;
        }

        ctx.fillStyle = accent
          ? `rgba(205, 241, 56, ${alpha})`
          : `rgba(240, 239, 233, ${alpha})`;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    };

    const loop = (time: number) => {
      if (inView) draw(time);
      rafId = requestAnimationFrame(loop);
    };

    build();

    if (reducedMotion) {
      draw(0);
    } else {
      rafId = requestAnimationFrame(loop);
    }

    const resizeObserver = new ResizeObserver(() => {
      build();
      if (reducedMotion) draw(0);
    });
    resizeObserver.observe(parent);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    if (finePointer && !reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
