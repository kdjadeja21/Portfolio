"use client";

import React, { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiArrowUpRight } from "react-icons/hi2";
import SectionHeading from "./section-heading";
import SubmitBtn from "./submit-btn";
import TurnstileWidget from "./turnstile-widget";
import {
  fetchContactPrepare,
  readHoneypotValues,
  submitContactForm,
  type ContactPrepare,
} from "@/lib/contact/client";
import {
  EMAIL_MAX_LENGTH,
  HONEYPOT_FIELDS,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
} from "@/lib/contact/schema";
import { useSectionInView } from "@/lib/hooks";
import { useMergedRefs } from "@/lib/merge-refs";
import { email, socialLinks } from "@/lib/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export default function Contact() {
  const { ref } = useSectionInView("Contact");
  const sectionRef = useRef<HTMLElement>(null);
  const setRefs = useMergedRefs(sectionRef, ref);
  const hasRequestedTicketRef = useRef(false);
  const [prepare, setPrepare] = useState<ContactPrepare | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Submit tickets are single use, so a fresh one is fetched after every
   * attempt.
   */
  const refreshPrepare = useCallback(async () => {
    const next = await fetchContactPrepare();

    setPrepare(next);

    return next;
  }, []);

  /**
   * Requested on first contact with the form rather than on page load: it keeps
   * crawlers out of the quota and gives the ticket time to age past the
   * minimum fill delay before a human finishes typing.
   */
  const handleFormActivate = () => {
    if (hasRequestedTicketRef.current) {
      return;
    }

    hasRequestedTicketRef.current = true;
    void refreshPrepare();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);

    try {
      const isTicketUsable =
        prepare !== null && prepare.expiresAt > Date.now() + 5000;
      const ticket = isTicketUsable ? prepare : await refreshPrepare();

      if (!ticket) {
        toast.error("Could not reach the server. Please reload and try again.");
        return;
      }

      if (ticket.turnstile.enabled && !turnstileToken) {
        toast.error("Please complete the human verification, then send again.");
        return;
      }

      // The server rejects submissions that arrive suspiciously fast after the
      // ticket was issued; wait it out instead of surfacing an error.
      const waitMs = ticket.notBefore - Date.now();

      if (waitMs > 0) {
        await sleep(waitMs);
      }

      const result = await submitContactForm({
        senderEmail: String(formData.get("senderEmail") ?? ""),
        message: String(formData.get("message") ?? ""),
        formToken: ticket.token,
        turnstileToken,
        honeypots: readHoneypotValues(formData),
      });

      // Both the ticket and the Turnstile token are spent now, whatever the
      // outcome, so replace them before the visitor can submit again.
      setTurnstileToken(null);
      setTurnstileResetSignal((signal) => signal + 1);
      void refreshPrepare();

      if (result.ok) {
        toast.success("Message sent — I'll get back to you soon.");
        form.reset();
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onSubmit={handleSubmit}
              onFocus={handleFormActivate}
              onPointerEnter={handleFormActivate}
            >
              <div className="honeypot" aria-hidden>
                {HONEYPOT_FIELDS.map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    tabIndex={-1}
                    autoComplete="off"
                    defaultValue=""
                  />
                ))}
              </div>

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
                maxLength={EMAIL_MAX_LENGTH}
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
                minLength={MESSAGE_MIN_LENGTH}
                maxLength={MESSAGE_MAX_LENGTH}
                rows={6}
                placeholder="Tell me about it…"
                className="mt-3 resize-none border-b border-line bg-transparent pb-4 text-lg text-paper outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
              />

              {prepare?.turnstile.enabled && prepare.turnstile.siteKey ? (
                <TurnstileWidget
                  siteKey={prepare.turnstile.siteKey}
                  onToken={setTurnstileToken}
                  resetSignal={turnstileResetSignal}
                />
              ) : null}

              <div className="mt-10">
                <SubmitBtn pending={isSubmitting} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
