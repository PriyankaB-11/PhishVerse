"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "cyber" | "neon" | "alert";
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = "default",
  glow = false,
  ...props
}: GlassCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return "bg-black/40 border-white/10";
      case "cyber":
        return "bg-[#050505]/70 border-primary/20 backdrop-blur-xl shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]";
      case "neon":
        return "glass-neon border-primary/40";
      case "alert":
        return "bg-destructive/10 border-destructive/50 shadow-[inset_0_0_20px_rgba(255,0,0,0.1)]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={glow ? { boxShadow: "0 0 20px rgba(0, 240, 255, 0.2)" } : {}}
      className={cn(
        "relative rounded-lg overflow-hidden backdrop-blur-md border transition-all duration-300",
        getVariantStyles(),
        className
      )}
      {...props}
    >
      {/* Decorative top-left corner */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 pointer-events-none" />
      {/* Decorative bottom-right corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 pointer-events-none" />
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}
