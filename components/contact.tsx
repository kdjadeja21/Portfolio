"use client";

import React, { useRef } from "react";
import toast from "react-hot-toast";
import { HiArrowUpRight } from "react-icons/hi2";
import SectionHeading from "./section-heading";
import SubmitBtn from "./submit-btn";
import { sendEmail } from "@/actions/sendEmail";
import { useSectionInView } from "@/lib/hooks";
import { useMergedRefs } from "@/lib/merge-refs";
import { email, socialLinks } from "@/lib/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Contact() {
  const { ref } = useSectionInView("Contact");
  const sectionRef = useRef<HTMLElement>(null);
  const setRefs = useMergedRefs(sectionRef, ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-contact-col]", {
          y: 56,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: "[data-contact-grid]",
            start: "top 82%",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={setRefs}
      id="contact"
      aria-label="Contact"
      className="relative border-t border-line px-5 py-24 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="07"
          eyebrow="Contact"
          title="Let's build something"
        />

        <div
          data-contact-grid
          className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-24"
        >
          <div data-contact-col>
            <p className="max-w-md text-xl leading-relaxed text-paper/80 sm:text-2xl">
              Have a project, an AI-adoption question, or a role that fits?
              My inbox is open.
            </p>

            <a
              href={`mailto:${email}`}
              className="link-underline mt-8 inline-block break-all font-display text-xl font-bold tracking-tight text-accent sm:text-3xl"
            >
              {email}
            </a>

            <ul className="mt-12 border-t border-line">
              {socialLinks.map((link) => (
                <li key={link.name} className="border-b border-line">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between py-4 transition-colors hover:text-accent"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.2em]">
                      {link.name}
                    </span>
                    <span className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                      {"display" in link ? link.display : null}
                      <HiArrowUpRight className="text-sm text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-10 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted">
              Gujarat, India — UTC+5:30
            </p>
          </div>

          <div data-contact-col>
            <form
              className="flex flex-col"
              action={async (formData) => {
                const { error } = await sendEmail(formData);

                if (error) {
                  toast.error(error);
                  return;
                }

                toast.success("Email sent successfully!");
              }}
            >
              <label
                htmlFor="senderEmail"
                className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted"
              >
                Your email
              </label>
              <input
                id="senderEmail"
                name="senderEmail"
                type="email"
                required
                maxLength={500}
                placeholder="name@company.com"
                className="mt-3 border-b border-line bg-transparent pb-4 text-lg text-paper outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
              />

              <label
                htmlFor="message"
                className="mt-10 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted"
              >
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                required
                maxLength={5000}
                rows={6}
                placeholder="Tell me about it…"
                className="mt-3 resize-none border-b border-line bg-transparent pb-4 text-lg text-paper outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
              />

              <div className="mt-10">
                <SubmitBtn />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
