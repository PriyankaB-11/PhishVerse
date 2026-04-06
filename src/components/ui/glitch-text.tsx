"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  animate?: boolean;
}

export function GlitchText({ text, className, animate = true }: GlitchTextProps) {
  return (
    <div
      className={cn(
        "relative inline-block font-mono font-bold uppercase",
        className
      )}
    >
      <span className="relative z-10">{text}</span>
      
      {animate && (
        <>
          <span
            className="absolute top-0 left-0 -translate-x-[2px] opacity-70 text-[#0ff] mix-blend-screen animate-[glitch-anim-1_2s_infinite_linear_alternate-reverse]"
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 translate-x-[2px] opacity-70 text-[#f0f] mix-blend-screen animate-[glitch-anim-1_3s_infinite_linear_alternate-reverse]"
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
}
