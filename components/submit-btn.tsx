"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { HiArrowUpRight } from "react-icons/hi2";
import Magnetic from "./magnetic";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Magnetic>
      <button
        type="submit"
        disabled={pending}
        className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-ink transition-all hover:scale-[1.03] active:scale-95 disabled:scale-100 disabled:opacity-60"
      >
        {pending ? (
          <>
            Sending
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink"
              aria-hidden
            />
          </>
        ) : (
          <>
            Send message
            <HiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </Magnetic>
  );
}
