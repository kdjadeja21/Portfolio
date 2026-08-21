import React from "react";
import { email, socialLinks } from "@/lib/site";
import Marquee from "@/components/marquee";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <Marquee
        items={["Krushnasinh Jadeja", "Gujarat, India", "Open to collaborations"]}
        className="border-b border-line py-6"
        itemClassName="text-outline font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl"
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <small className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
          © {currentYear} Krushnasinh Jadeja
        </small>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="link-underline font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-paper"
              >
                {link.name}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${email}`}
              className="link-underline font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-paper"
            >
              Email
            </a>
          </li>
        </ul>

        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
          Next.js · TypeScript · Tailwind · GSAP
        </p>
      </div>
    </footer>
  );
}
