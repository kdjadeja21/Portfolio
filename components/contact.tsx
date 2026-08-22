"use client";

import React, { useRef, useState } from "react";
import type { FormEvent } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { HiArrowUpRight } from "react-icons/hi2";
import SectionHeading from "./section-heading";
import SubmitBtn from "./submit-btn";
import TurnstileWidget from "./turnstile-widget";
import { useSectionInView } from "@/lib/hooks";
import { useMergedRefs } from "@/lib/merge-refs";
import { email, socialLinks } from "@/lib/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { buildContactEmailHtml } from "@/lib/email-template";

const SITE_NAME = "Krushnasinh Jadeja Portfolio";

// Classic honeypot: a field that's hidden from sighted users and never
// exposed to autofill, but visible to bots/scripts that blindly fill every
// input in the form's HTML.
const HONEYPOT_FIELD_NAME = "company_website";

const getEmailJsErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "text" in error) {
    return String(error.text);
  }
  return "Email could not be sent. Please use the direct email link.";
};

export default function Contact() {
  const { ref } = useSectionInView("Contact");
  const sectionRef = useRef<HTMLElement>(null);
  const setRefs = useMergedRefs(sectionRef, ref);
  const [isSending, setIsSending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const captchaRequired = Boolean(turnstileSiteKey);
  const resetTurnstile = () => {
    setTurnstileToken(null);
    setTurnstileResetSignal((signal) => signal + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error(
        "Email service is not configured. Please use the direct email link."
      );
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const senderEmail = String(formData.get("senderEmail") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const honeypotValue = String(
      formData.get(HONEYPOT_FIELD_NAME) ?? ""
    ).trim();

    // A real visitor never sees or fills this field, so any value here means
    // a bot filled out the whole form programmatically. Pretend success so
    // the bot doesn't learn it was caught, without actually sending an email.
    if (honeypotValue) {
      toast.success("Email sent successfully!");
      form.reset();
      resetTurnstile();
      return;
    }

    if (!senderEmail || !message) {
      toast.error("Please enter your email and message.");
      return;
    }

    if (captchaRequired && !turnstileToken) {
      toast.error("Please complete the verification challenge.");
      return;
    }

    setIsSending(true);
    try {
      if (captchaRequired) {
        const verifyResponse = await fetch("/api/contact/verify-turnstile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: turnstileToken }),
        });
        const verifyResult = await verifyResponse
          .json()
          .catch(() => ({ success: false }));

        if (!verifyResponse.ok || !verifyResult.success) {
          toast.error(
            "Verification failed. Please retry the challenge and submit again."
          );
          resetTurnstile();
          return;
        }
      }

      const submittedAt = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      });

      const emailHtml = buildContactEmailHtml({
        senderEmail,
        message,
        submittedAt,
        siteName: SITE_NAME,
      });

      await emailjs.send(
        serviceId,
        templateId,
        {
          subject: `New portfolio inquiry from ${senderEmail}`,
          // Rendered by our own code, not the EmailJS dashboard editor. Sent
          // under both common variable names since EmailJS templates in the
          // wild reference this content as either `email_html` or
          // `message_html`. The EmailJS template must use triple braces
          // (`{{{message_html}}}` / `{{{email_html}}}`) so it renders as
          // HTML instead of being escaped as literal text.
          email_html: emailHtml,
          message_html: emailHtml,
          // Sent under both `reply_to` and `email` — different EmailJS
          // template presets wire the "Reply To" field to either name.
          from_email: senderEmail,
          reply_to: senderEmail,
          email: senderEmail,
          // The default EmailJS template preset uses {{name}} for "From
          // Name". We only collect an email address on the form, so reuse
          // it here rather than leaving that field blank.
          name: senderEmail,
          message,
          to_email: email,
          site_name: SITE_NAME,
          submitted_at: submittedAt,
        },
        { publicKey }
      );

      toast.success("Email sent successfully!");
      form.reset();
      resetTurnstile();
    } catch (error: unknown) {
      toast.error(getEmailJsErrorMessage(error));
      resetTurnstile();
    } finally {
      setIsSending(false);
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
            >
              {/* Honeypot: hidden from real users, invisible to screen
                  readers, and skipped by tab order and autofill — but a
                  bot that fills every field in the form's markup will
                  populate it, giving handleSubmit a way to detect it. */}
              <div
                className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
                aria-hidden="true"
              >
                <label htmlFor={HONEYPOT_FIELD_NAME}>Company website</label>
                <input
                  id={HONEYPOT_FIELD_NAME}
                  name={HONEYPOT_FIELD_NAME}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <label
                htmlFor="senderEmail"
                className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted"
              >
                Your email
              </label>
              <div className="contact-field mt-3">
                <input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  required
                  maxLength={500}
                  placeholder="name@company.com"
                  className="w-full appearance-none rounded-none border-0 bg-transparent pb-4 text-lg text-paper shadow-none outline-none placeholder:text-muted/50 focus:outline-none focus-visible:outline-none"
                />
              </div>

              <label
                htmlFor="message"
                className="mt-10 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted"
              >
                Your message
              </label>
              <div className="contact-field mt-3">
                <textarea
                  id="message"
                  name="message"
                  required
                  maxLength={5000}
                  rows={6}
                  placeholder="Tell me about it…"
                  className="w-full appearance-none resize-none rounded-none border-0 bg-transparent pb-4 text-lg text-paper shadow-none outline-none placeholder:text-muted/50 focus:outline-none focus-visible:outline-none"
                />
              </div>

              {turnstileSiteKey ? (
                <TurnstileWidget
                  siteKey={turnstileSiteKey}
                  onToken={setTurnstileToken}
                  resetSignal={turnstileResetSignal}
                />
              ) : null}

              <div className="mt-10">
                <SubmitBtn
                  pending={isSending}
                  disabled={captchaRequired && !turnstileToken}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
