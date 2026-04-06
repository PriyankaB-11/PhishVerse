"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CyberButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  glowColor?: string;
}

export function CyberButton({
  children,
  className,
  variant = "primary",
  glowColor,
  ...props
}: CyberButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary/20 text-neon-cyan border-primary/50 hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]";
      case "secondary":
        return "bg-secondary/20 text-neon-pink border-secondary/50 hover:bg-secondary/30 hover:shadow-[0_0_20px_rgba(255,0,255,0.6)]";
      case "destructive":
        return "bg-destructive/20 text-destructive-foreground border-destructive/50 hover:bg-destructive/40 hover:shadow-[0_0_20px_rgba(255,50,50,0.6)] text-red-400";
      case "ghost":
        return "bg-transparent border-transparent hover:bg-white/5 text-muted-foreground hover:text-white";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative group overflow-hidden px-6 py-3 font-mono font-bold tracking-widest uppercase transition-all duration-300 border backdrop-blur-sm rounded-sm",
        getVariantStyles(),
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Glitch Overlay Effect on Hover */}
      <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:animate-[shimmer_0.75s_infinite] skew-x-12 z-0" />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-[1px] bg-white mix-blend-overlay" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-white mix-blend-overlay" />
      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-white mix-blend-overlay" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-white mix-blend-overlay" />
    </motion.button>
  );
}
