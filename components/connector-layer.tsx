"use client";

import { useEffect, useRef } from "react";
import { gsap, REDUCED_MOTION } from "@/lib/gsap";
import { nearestAnchor, getAnchor, hasAnchors } from "@/lib/ambient";

const SVG_NS = "http://www.w3.org/2000/svg";
const ACCENT = "205, 241, 56";

type ConnectorState = {
  el: Element;
  group: SVGGElement;
  glow: SVGPathElement;
  line: SVGPathElement;
  dot: SVGCircleElement;
  ring: SVGCircleElement;
  progress: number;
  visible: boolean;
  engaged: boolean;
  anchorId: number | null;
  /** Lerped endpoint so anchor re-targets and wraps glide instead of snap. */
  tx: number;
  ty: number;
  endInitialized: boolean;
  tween: gsap.core.Tween | null;
};

function createPath(parent: SVGGElement, strokeWidth: number, alpha: number) {
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", `rgba(${ACCENT}, ${alpha})`);
  path.setAttribute("stroke-width", String(strokeWidth));
  path.setAttribute("stroke-linecap", "round");
  parent.appendChild(path);
  return path;
}

export default function ConnectorLayer() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    const states = new Map<Element, ConnectorState>();

    const buildState = (el: Element): ConnectorState => {
      const group = document.createElementNS(SVG_NS, "g");
      group.style.opacity = "0";
      const glow = createPath(group, 5, 0.1);
      const line = createPath(group, 1.25, 0.5);

      const dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("r", "2.5");
      dot.setAttribute("fill", `rgba(${ACCENT}, 0.95)`);
      group.appendChild(dot);

      const ring = document.createElementNS(SVG_NS, "circle");
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", `rgba(${ACCENT}, 0.55)`);
      ring.setAttribute("stroke-width", "1");
      group.appendChild(ring);

      svg.appendChild(group);
      return {
        el,
        group,
        glow,
        line,
        dot,
        ring,
        progress: 0,
        visible: false,
        engaged: false,
        anchorId: null,
        tx: 0,
        ty: 0,
        endInitialized: false,
        tween: null,
      };
    };

    const activate = (state: ConnectorState) => {
      const rect = state.el.getBoundingClientRect();
      const anchor = nearestAnchor(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        window.innerWidth,
        window.innerHeight
      );
      if (!anchor) return;
      state.engaged = true;
      state.anchorId = anchor.id;
      state.endInitialized = false;
      state.tween?.kill();
      state.tween = gsap.to(state, {
        progress: 1,
        duration: 1.5,
        ease: "power3.inOut",
      });
      state.el.classList.add("connector-node--active");
    };

    const deactivate = (state: ConnectorState) => {
      state.engaged = false;
      state.tween?.kill();
      state.tween = gsap.to(state, {
        progress: 0,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          // Forget the anchor so the connector re-targets whichever orb is
          // nearest the next time it scrolls into view.
          state.anchorId = null;
        },
      });
      state.el.classList.remove("connector-node--active");
    };

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const state = states.get(entry.target);
          if (state) state.visible = entry.isIntersecting;
        }
      },
      { rootMargin: "-8% 0px -8% 0px" }
    );

    const removeState = (state: ConnectorState) => {
      state.tween?.kill();
      intersection.unobserve(state.el);
      state.group.remove();
      states.delete(state.el);
    };

    const scan = () => {
      const found = document.querySelectorAll("[data-connector]");
      const present = new Set<Element>(found);

      for (const [el, state] of states) {
        if (!present.has(el)) removeState(state);
      }
      for (const el of found) {
        if (!states.has(el)) {
          states.set(el, buildState(el));
          intersection.observe(el);
        }
      }
    };

    // Pick up connector elements that mount later (route changes,
    // conditional renders, lazily loaded sections).
    let scanScheduled = false;
    const mutation = new MutationObserver(() => {
      if (scanScheduled) return;
      scanScheduled = true;
      requestAnimationFrame(() => {
        scanScheduled = false;
        scan();
      });
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    const update = (time: number) => {
      if (document.hidden) return;

      for (const state of states.values()) {
        // Activation is driven from the frame loop (not the observer
        // callback) so connectors that become visible before the canvas
        // publishes its first anchors still hook up on the next frame.
        if (state.visible && !state.engaged && hasAnchors()) {
          activate(state);
        } else if (!state.visible && state.engaged) {
          deactivate(state);
        }

        if (state.progress < 0.002 || state.anchorId === null) {
          state.group.style.opacity = "0";
          continue;
        }

        const anchor = getAnchor(state.anchorId);
        const rect = state.el.getBoundingClientRect();
        if (!anchor || rect.width === 0) {
          state.group.style.opacity = "0";
          continue;
        }

        const sx = rect.left + rect.width / 2;
        const sy = rect.top + rect.height / 2;

        if (!state.endInitialized) {
          state.tx = anchor.x;
          state.ty = anchor.y;
          state.endInitialized = true;
        } else {
          state.tx += (anchor.x - state.tx) * 0.085;
          state.ty += (anchor.y - state.ty) * 0.085;
        }

        let dx = state.tx - sx;
        let dy = state.ty - sy;
        const dist = Math.hypot(dx, dy) || 1;

        // Land on the orb's edge, not its center.
        const ex = state.tx - (dx / dist) * anchor.radius;
        const ey = state.ty - (dy / dist) * anchor.radius;
        dx = ex - sx;
        dy = ey - sy;

        // Perpendicular bulge gives the line a relaxed, drawn-by-hand arc.
        const bend = Math.min(dist * 0.16, 90);
        const nx = (-dy / dist) * bend;
        const ny = (dx / dist) * bend;
        const c1x = sx + dx * 0.3 + nx;
        const c1y = sy + dy * 0.3 + ny;
        const c2x = sx + dx * 0.7 + nx;
        const c2y = sy + dy * 0.7 + ny;

        const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(
          1
        )} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(
          1
        )}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;

        state.line.setAttribute("d", d);
        state.glow.setAttribute("d", d);

        const length = state.line.getTotalLength();
        const dash = `${length}`;
        const offset = String(length * (1 - state.progress));
        state.line.style.strokeDasharray = dash;
        state.line.style.strokeDashoffset = offset;
        state.glow.style.strokeDasharray = dash;
        state.glow.style.strokeDashoffset = offset;

        const tip = state.line.getPointAtLength(length * state.progress);
        state.dot.setAttribute("cx", tip.x.toFixed(1));
        state.dot.setAttribute("cy", tip.y.toFixed(1));
        state.dot.setAttribute(
          "r",
          (2 + Math.sin(time * 6) * 0.6).toFixed(2)
        );

        // Landing ring blooms once the line has fully arrived.
        const arrival = Math.max(0, (state.progress - 0.85) / 0.15);
        const ringPulse = 1 + ((time * 0.9) % 1);
        state.ring.setAttribute("cx", state.tx.toFixed(1));
        state.ring.setAttribute("cy", state.ty.toFixed(1));
        state.ring.setAttribute(
          "r",
          (anchor.radius * ringPulse * 1.4).toFixed(1)
        );
        state.ring.setAttribute(
          "stroke-opacity",
          (arrival * (1 - ((time * 0.9) % 1)) * 0.55).toFixed(2)
        );

        state.group.style.opacity = "1";
      }
    };

    scan();
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      mutation.disconnect();
      intersection.disconnect();
      for (const state of [...states.values()]) removeState(state);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] h-full w-full"
    />
  );
}
