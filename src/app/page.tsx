"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Target, Zap, ChevronRight, Activity, TerminalSquare, AlertTriangle } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { GlitchText } from "@/components/ui/glitch-text";
import { TypingText } from "@/components/ui/typing-text";
import { GlassCard } from "@/components/ui/glass-card";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden relative selection:bg-primary/30">
      
      {/* Animated Core Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Floating Background 'Data' Elements */}
      <motion.div 
        className="absolute top-20 left-[10%] text-primary/30 font-mono text-xs opacity-50 z-0 pointer-events-none"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <p>INIT_SEC_PROTOCOL...</p>
        <p>BYPASS_FIREWALL: SUCCESS</p>
        <p>UPLOADING_PAYLOAD_XX.BIN</p>
      </motion.div>

      <motion.div 
        className="absolute bottom-32 right-[15%] text-secondary/30 font-mono text-xs opacity-50 z-0 pointer-events-none text-right"
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <p>TARGET_ACQUIRED</p>
        <p>ESTABLISHING_LINK...</p>
        <p>PING: 12ms</p>
      </motion.div>

      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 md:p-24 relative z-10 max-w-7xl mx-auto">
        
        {/* Navigation / Header */}
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-0 w-full flex justify-between items-center py-6 px-8 md:px-12 border-b border-primary/20 bg-black/40 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 border border-primary/50 rounded bg-primary/10 neon-glow-cyan">
              <Shield className="w-6 h-6 text-primary" />
              {/* Spinning hacker border effect */}
              <motion.div 
                className="absolute inset-0 border border-primary rounded border-t-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="font-mono font-bold text-2xl tracking-tighter text-white">
              PHISH<GlitchText text="VERSE" className="text-primary text-neon-cyan" />
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/auth" className="hidden sm:block font-mono text-xs text-muted-foreground hover:text-white transition-colors duration-300">
              [ AUTH_NODE ]
            </Link>
            <Link href="/auth?signup=true">
              <CyberButton variant="ghost" className="text-xs px-4 py-2 border border-primary/30 hover:border-primary text-primary">
                INITIALIZE
              </CyberButton>
            </Link>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mt-32 md:mt-16 max-w-4xl relative z-10">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-8 neon-glow-cyan"
          >
            <motion.div 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_currentColor]"
            />
            <span>SYSTEM_ONLINE :: v3.0 // NEURO_LINK_ESTABLISHED</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase leading-[0.9]"
          >
            Enter the Mind <br className="hidden md:block"/>
            <span className="relative inline-block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                Of A Hacker
              </span>
            </span>
          </motion.h1>

          <div className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl font-mono min-h-[60px] flex items-center justify-center">
             <TypingText 
              text="> Experience next-generation AI phishing simulations. Expose vulnerabilities before they become catastrophic breaches."
              speed={30}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 w-full justify-center"
          >
            <Link href="/auth">
              <CyberButton className="text-lg px-10 py-5 w-full sm:w-auto neon-glow-cyan shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                <TerminalSquare className="w-5 h-5 mr-2" />
                START VIRTUAL SIMULATION
              </CyberButton>
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32 w-full max-w-6xl relative z-10"
        >
          <FeatureCard 
            icon={<Target className="w-8 h-8 text-primary" />}
            title="MULTI-VECTOR ATTACKS"
            description="Our AI dynamically synthesizes spear-phishing emails, internal chat messages, SMS (smishing), and deepfake voice calls."
            variant="neon"
            delay={0.1}
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-secondary" />}
            title="CAMPAIGN STORY MODE"
            description="Advance through a multi-level progression system. Higher levels unlock exotic social engineering threat models."
            delay={0.2}
          />
          <FeatureCard 
            icon={<AlertTriangle className="w-8 h-8 text-destructive" />}
            title="CONSEQUENCE ENGINE"
            description="Experience catastrophic UI glitches and ransomware takeovers when you fail. Feel the real-world impact of a breach."
            variant="alert"
            delay={0.3}
          />
          <FeatureCard 
            icon={<Activity className="w-8 h-8 text-accent" />}
            title="PSYCHOLOGICAL PROFILE"
            description="Our dashboard analyzes your delay and reaction choices to build a dynamic classification of your risk profile."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-purple-400" />}
            title="LIVE CYBER FEED"
            description="Monitor an animated world map of real-time fake attacks and compete globally on the operative leaderboard."
            delay={0.5}
          />
          <FeatureCard 
            icon={<TerminalSquare className="w-8 h-8 text-yellow-400" />}
            title="AI FEEDBACK COACH"
            description="Instantly breaks down attacks, highlighting spoofed domains and psychological manipulation tactics in a secure terminal."
            delay={0.6}
          />
        </motion.div>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, variant = "cyber", delay = 0 }: { icon: React.ReactNode, title: string, description: string, variant?: any, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 + delay }}
    >
      <GlassCard variant={variant} glow className="p-8 h-full flex flex-col gap-4 group cursor-default">
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-current opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity pointer-events-none" />
        
        <div className="p-3 bg-black/60 rounded border border-white/10 w-fit flex items-center justify-center relative overflow-hidden">
           {/* Scanline over icon box */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-30 pointer-events-none" />
          {icon}
        </div>
        
        <h3 className="text-xl font-bold font-mono text-white/90 group-hover:text-primary transition-colors mt-2 tracking-wide">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed text-sm font-sans">
          {description}
        </p>
        
        <div className="mt-auto pt-4 flex items-center text-xs font-mono text-primary/50 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
          <ChevronRight className="w-4 h-4 mr-1" /> ACTIVE_MODULE
        </div>
      </GlassCard>
    </motion.div>
  );
}

