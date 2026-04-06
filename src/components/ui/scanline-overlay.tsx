"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ScanlineOverlay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="scanline-overlay" />
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9998] opacity-5 bg-gradient-to-b from-transparent via-[#00f0ff] to-transparent"
        animate={{
          y: ["-100%", "100%"]
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "linear"
        }}
      />
    </>
  );
}
