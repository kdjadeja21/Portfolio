"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { links } from "@/lib/data";
import { useActiveSectionContext } from "@/context/active-section-context";
import { getLenis } from "@/components/smooth-scroll";

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.classList.add("overflow-hidden");
    } else {
      lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => {
      lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleNavClick = (name: (typeof links)[number]["name"]) => {
    setActiveSection(name);
    setTimeOfLastClick(Date.now());
    setMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <div
        className={clsx(
          "flex items-center justify-between px-5 py-4 transition-all duration-500 sm:px-8",
          scrolled && !menuOpen
            ? "border-b border-line bg-ink/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <Link
          href="#home"
          className="relative z-[110] font-display text-sm font-extrabold uppercase tracking-[0.08em]"
          onClick={() => handleNavClick("Home")}
        >
          Krushnasinh<span className="text-accent">©</span>
        </Link>

        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.hash}>
                <Link
                  href={link.hash}
                  onClick={() => handleNavClick(link.name)}
                  className={clsx(
                    "group flex items-center gap-2 px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors",
                    activeSection === link.name
                      ? "text-accent"
                      : "text-muted hover:text-paper"
                  )}
                >
                  <span
                    className={clsx(
                      "h-1 w-1 rounded-full transition-all duration-300",
                      activeSection === link.name
                        ? "bg-accent"
                        : "bg-transparent group-hover:bg-paper/40"
                    )}
                    aria-hidden
                  />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="relative z-[110] flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-paper md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
          <span className="flex flex-col gap-[5px]" aria-hidden>
            <span
              className={clsx(
                "block h-px w-5 bg-current transition-transform duration-300",
                menuOpen && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={clsx(
                "block h-px w-5 bg-current transition-transform duration-300",
                menuOpen && "-translate-y-[3px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={clsx(
          "fixed inset-0 z-[105] flex flex-col justify-center bg-ink px-8 transition-[opacity,visibility] duration-500 md:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
        data-lenis-prevent
      >
        <p className="mb-8 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted">
          Navigation
        </p>
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-2">
            {links.map((link, index) => (
              <li key={link.hash} className="overflow-hidden">
                <Link
                  href={link.hash}
                  onClick={() => handleNavClick(link.name)}
                  className={clsx(
                    "flex items-baseline gap-4 py-2 font-display text-4xl font-bold uppercase tracking-tight transition-all duration-500",
                    menuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0",
                    activeSection === link.name ? "text-accent" : "text-paper"
                  )}
                  style={{ transitionDelay: menuOpen ? `${index * 60}ms` : "0ms" }}
                >
                  <span className="font-mono text-xs font-normal text-muted">
                    0{index + 1}
                  </span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-12 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted">
          Gujarat, India — UTC+5:30
        </p>
      </div>
    </header>
  );
}
