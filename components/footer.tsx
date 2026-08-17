import React from "react";
import { email, socialLinks } from "@/lib/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mb-10 px-4 text-center text-gray-500">
      <small className="mb-2 block text-xs">
        &copy; {currentYear} Krushnasinh Jadeja. All rights reserved.
      </small>
      <p className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-gray-950 dark:hover:text-white/80"
          >
            {"display" in link ? link.display : link.name}
          </a>
        ))}
        <a
          href={`mailto:${email}`}
          className="underline underline-offset-4 hover:text-gray-950 dark:hover:text-white/80"
        >
          {email}
        </a>
      </p>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS,
        Framer Motion, React Email & Resend, Vercel hosting.
      </p>
    </footer>
  );
}
