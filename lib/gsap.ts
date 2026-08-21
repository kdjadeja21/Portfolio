"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const FINE_POINTER_MOTION_OK = `${MOTION_OK} and (pointer: fine)`;

export { gsap, useGSAP, ScrollTrigger, SplitText };
