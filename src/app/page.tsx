"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Target, Zap, ChevronRight, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
      
      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 md:p-24 relative z-10 max-w-6xl mx-auto">
        
        {/* Navigation / Header */}
        <nav className="absolute top-0 w-full flex justify-between items-center py-6">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            <span className="font-mono font-bold text-2xl tracking-tighter text-white">
              PHISH<span className="text-primary text-neon-cyan">VERSE</span>
            </span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/auth" 
              className="px-6 py-2 rounded-md font-mono text-sm font-semibold transition-all text-white/70 hover:text-white"
            >
              LOGIN
            </Link>
            <Link 
              href="/auth?signup=true"
              className="px-6 py-2 rounded-md font-mono text-sm font-semibold transition-all border border-primary/50 text-white neon-glow-cyan hover:bg-primary/10"
            >
              INITIALIZE
            </Link>
          </div>
        </nav>

        <div className="flex flex-col items-center text-center mt-20 md:mt-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono mb-8"
          >
            <Activity className="w-3 h-3" />
            <span>SYSTEM_ONLINE :: v2.5.4</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            TRAIN YOUR MIND. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              DEFEAT THE THREAT.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-light"
          >
            Step into the next-generation AI phishing simulator. Experience real-world cyber attacks in a fully contained environment and elevate your security awareness.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link 
              href="/auth"
              className="group relative px-8 py-4 bg-primary text-black font-mono font-bold text-lg rounded-lg neon-glow-cyan overflow-hidden transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                START SIMULATION <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32 w-full"
        >
           <FeatureCard 
            icon={<Target className="w-8 h-8 text-primary" />}
            title="MULTI-VECTOR ATTACKS"
            description="Our AI dynamically synthesizes spear-phishing emails, internal chat messages, SMS (smishing), and deepfake voice calls."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-secondary" />}
            title="CAMPAIGN STORY MODE"
            description="Advance through a multi-level progression system. Higher levels unlock exotic social engineering threat models."
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-purple-400" />}
            title="PSYCHOLOGICAL PROFILING"
            description="Our dashboard analyzes your delay and reaction choices to build a dynamic classification of your risk profile."
          />
          <FeatureCard 
            icon={<Activity className="w-8 h-8 text-green-400" />}
            title="LIVE CYBER FEED & LEADERBOARD"
            description="Monitor an animated world map of real-time fake attacks and compete globally on the operative leaderboard."
          />
          <FeatureCard 
            icon={<ChevronRight className="w-8 h-8 text-yellow-400" />}
            title="CUSTOM PAYLOAD BUILDER"
            description="Design your own phishing message by setting target contexts and generate an instant simulation link."
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-red-500" />}
            title="AI FEEDBACK COACH"
            description="Instantly breaks down attacks, highlighting spoofed domains and psychological manipulation tactics."
          />
        </motion.div>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel p-8 rounded-xl flex flex-col gap-4 border border-white/5 hover:border-primary/50 transition-colors group cursor-default relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
      <div className="p-3 bg-black/50 rounded-lg w-fit border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-mono text-white/90 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
