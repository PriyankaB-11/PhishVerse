"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Unlock, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalMockDB } from "@/lib/supabase";

const LEVELS = [
  { id: 1, name: "BASIC RECON", type: "email", desc: "Identify generic corporate phishing attempts." },
  { id: 2, name: "URGENT DISPATCH", type: "sms", desc: "Navigate high-pressure smishing alerts." },
  { id: 3, name: "INTERNAL BREACH", type: "chat", desc: "Detect compromised internal team communication." },
  { id: 4, name: "VOICE SYNTHESIS", type: "voice", desc: "Analyze deepfake audio bank fraud attempts." },
  { id: 5, name: "CEO FRAUD", type: "email", desc: "Highly targeted whaling attacks and wire transfers." },
];

export default function StoryModePage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    setCurrentLevel(LocalMockDB.getLevel());
  }, []);

  const handleStartLevel = (type: string) => {
    // We set a specific type to force the simulation engine
    sessionStorage.setItem("phishverse_forced_type", type);
    router.push("/simulation");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-12">
        <Button variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> DASHBOARD
        </Button>
        <h1 className="text-3xl font-bold font-mono text-white tracking-widest text-center shadow-primary">CAMPAIGN LOGS</h1>
        <div className="w-24"></div> {/* spacer */}
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 rounded-full"></div>

        <div className="space-y-12 relative z-10 w-full pl-16 md:pl-0">
          {LEVELS.map((level, index) => {
            const isUnlocked = currentLevel >= level.id;
            const isCurrent = currentLevel === level.id;
            
            return (
              <motion.div 
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center md:justify-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Node Line Connector Desktop */}
                <div className={`hidden md:block w-1/2 p-6 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <div className={`glass-panel p-6 rounded-xl border ${isCurrent ? 'border-primary shadow-[0_0_15px_rgba(0,240,255,0.3)]' : isUnlocked ? 'border-primary/30' : 'border-white/5 opacity-50'} transition-all`}>
                     <h3 className={`font-mono font-bold text-xl ${isUnlocked ? 'text-white' : 'text-muted-foreground'}`}>{level.name}</h3>
                     <p className="text-muted-foreground text-sm mt-2">{level.desc}</p>
                     
                     {isUnlocked ? (
                       <Button 
                         onClick={() => handleStartLevel(level.type)}
                         className={`mt-4 w-full font-mono ${isCurrent ? 'bg-primary text-black neon-glow-cyan' : 'bg-white/10 text-white hover:bg-primary/20'}`}
                       >
                         {isCurrent ? 'INITIATE' : 'REPLAY'}
                       </Button>
                     ) : (
                       <Button disabled className="mt-4 w-full bg-black/50 border border-white/5 text-muted-foreground font-mono">
                         LOCKED
                       </Button>
                     )}
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center bg-background border-4 z-20"
                     style={{ borderColor: isCurrent ? '#00F0FF' : isUnlocked ? '#ffffff50' : '#ffffff10' }}>
                   {isUnlocked ? <Unlock className={`w-6 h-6 ${isCurrent ? 'text-primary' : 'text-white/50'}`} /> : <Lock className="w-6 h-6 text-white/10" />}
                </div>

                {/* Mobile View Card */}
                <div className="md:hidden w-full transition-all">
                  <div className={`glass-panel p-6 rounded-xl border ${isCurrent ? 'border-primary shadow-[0_0_15px_rgba(0,240,255,0.3)]' : isUnlocked ? 'border-primary/30' : 'border-white/5 opacity-50'}`}>
                     <h3 className="font-mono font-bold text-xl text-white">{level.name}</h3>
                     <p className="text-muted-foreground text-sm mt-2">{level.desc}</p>
                     {isUnlocked ? (
                       <Button 
                         onClick={() => handleStartLevel(level.type)}
                         className={`mt-4 w-full font-mono ${isCurrent ? 'bg-primary text-black neon-glow-cyan' : 'bg-white/10 text-white hover:bg-primary/20'}`}
                       >
                         {isCurrent ? 'INITIATE' : 'REPLAY'}
                       </Button>
                     ) : (
                       <Button disabled className="mt-4 w-full bg-black/50 border border-white/5 text-muted-foreground font-mono">
                         LOCKED
                       </Button>
                     )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
