"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, ArrowRight, Home, Zap, Terminal as TerminalIcon } from "lucide-react";
import { LocalMockDB } from "@/lib/supabase";
import { CyberButton } from "@/components/ui/cyber-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlitchText } from "@/components/ui/glitch-text";
import { TypingText } from "@/components/ui/typing-text";

export default function FeedbackPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState<any>(null);
  const [action, setAction] = useState<string>("");
  const [scoreChange, setScoreChange] = useState(0);

  useEffect(() => {
    const scen = sessionStorage.getItem("phishverse_scenario");
    const act = sessionStorage.getItem("phishverse_action");
    if (!scen || !act) {
      router.push("/dashboard");
      return;
    }
    const parsedScen = JSON.parse(scen);
    setScenario(parsedScen);
    setAction(act);

    // Score logic
    let points = 0;
    const isMalicious = parsedScen.verdict === "malicious";
    
    if (isMalicious && act === "report") points = 10;
    else if (isMalicious && act === "ignore") points = 2; // neutral
    else if (isMalicious && act === "click_link") points = -15; // failed!
    else if (!isMalicious && act === "report") points = -5; // false positive
    else points = 5; // safe action on safe email

    setScoreChange(points);
    void LocalMockDB.updateScore(points);

    // Save history
    const timeTakenStr = sessionStorage.getItem("phishverse_timetaken");
    const timeTakenMs = timeTakenStr ? parseInt(timeTakenStr, 10) : 10000;
    void LocalMockDB.addHistoryEntry({
      verdict: parsedScen.verdict,
      action: act,
      type: parsedScen.type || 'email',
      timeTakenMs
    });

    // Optional: Play a sound effect if wanted as per "Sound effects (optional but impactful)"
    try {
      const audio = new Audio(points > 0 ? "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg" : "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch(e) {}
  }, [router]);

  let aiFeedbackText = "";
  if (scenario) {
    const isMalicious = scenario.verdict === "malicious";
    if (isMalicious) {
      if (action === "report") {
          aiFeedbackText = "> Excellent work, operator.\n\n> You successfully identified the threat and reported it to the security team.\n\n> I am exposing their social engineering vectors below. Study them.";
      } else if (action === "click_link") {
          aiFeedbackText = "> CRITICAL FAILURE.\n\n> You interacted with a malicious payload.\n\n> In a real-world scenario, your device would now be compromised, triggering a network-wide breach.\n\n> Analyzing your mistakes...";
      } else if (action === "ignore") {
          aiFeedbackText = "> Threat evaded, but not neutralized.\n\n> You avoided the threat by ignoring it, but failed to report it. Active threats should always be flagged to protect other operatives.\n\n> Review the indicators.";
      }
    } else {
      if (action === "report") {
          aiFeedbackText = "> FALSE POSITIVE.\n\n> You flagged a completely legitimate communication.\n\n> Too many false positives waste security team resources and cause alert fatigue.\n\n> Let's see why this was safe.";
      } else if (action === "click_link" || action === "ignore") {
          aiFeedbackText = "> Good judgment.\n\n> This was a completely legitimate day-to-day communication.\n\n> You accurately avoided false positives while maintaining zero-trust principles.";
      }
    }
  }

  if (!scenario) return null;

  const isSuccess = scoreChange > 0;

  return (
    <div className="min-h-screen p-4 md:p-12 max-w-5xl mx-auto flex flex-col items-center justify-center mt-12 relative z-10">
      
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isSuccess ? 'bg-primary/5' : 'bg-destructive/5'} blur-[150px] rounded-full pointer-events-none -z-10`} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <GlassCard 
          variant={isSuccess ? "cyber" : "alert"} 
          className={`p-8 md:p-12 border-2 ${isSuccess ? 'border-primary/50' : 'border-destructive/50'} relative overflow-hidden shadow-2xl`}
        >
          {/* Animated top border line */}
          <div className={`absolute top-0 left-0 w-full h-1 ${isSuccess ? 'bg-primary' : 'bg-destructive'} overflow-hidden`}>
            <motion.div 
               className="w-1/3 h-full bg-white/80" 
               animate={{ x: ['-100%', '300%'] }} 
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
            />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {isSuccess ? (
              <div className="w-24 h-24 bg-primary/10 rounded border border-primary/50 flex shrink-0 justify-center items-center neon-glow-cyan text-primary relative overflow-hidden group">
                <ShieldCheck className="w-12 h-12 relative z-10" />
                <div className="absolute inset-0 bg-primary/20 rotate-45 scale-150 -translate-y-full group-hover:translate-y-full transition-transform duration-700" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-destructive/10 rounded border border-destructive/50 shrink-0 flex items-center justify-center text-destructive !shadow-[0_0_30px_rgba(239,68,68,0.4)] relative overflow-hidden">
                <ShieldAlert className="w-12 h-12 relative z-10 animate-pulse" />
                <div className="absolute inset-0 border-4 border-destructive/30 rounded animate-ping object-contain" />
              </div>
            )}

            <div className="flex flex-col items-center md:items-start text-center md:text-left w-full space-y-4">
               <div>
                  <h1 className={`text-4xl md:text-5xl font-black font-mono tracking-tighter ${isSuccess ? 'text-white' : 'text-destructive'} uppercase`}>
                    <GlitchText text="SIMULATION_TERMINATED" />
                  </h1>
                  <p className="text-muted-foreground font-mono mt-2 tracking-widest text-sm">
                    {isSuccess ? "VERDICT: SUCCESSFUL NEUTRALIZATION" : "VERDICT: MISSION FAILURE"}
                  </p>
               </div>

               <div className={`text-2xl font-bold font-mono ${isSuccess ? 'text-primary' : 'text-destructive'} flex items-center gap-2 mt-4 px-4 py-2 border ${isSuccess ? 'border-primary/30 bg-primary/10' : 'border-destructive/30 bg-destructive/10'} rounded-sm inline-flex`}>
                 <Zap className={`w-6 h-6 ${isSuccess ? 'text-primary' : 'text-destructive'}`}/>
                 {scoreChange > 0 ? "+" : ""}{scoreChange} <span className="text-white/70 ml-2">CYBER SCORE</span>
               </div>
            </div>
          </div>

          {/* AI Hacker Terminal */}
          <div className="bg-[#050505] p-6 lg:p-8 rounded-sm mt-12 font-mono border-l-4 border-primary/70 relative shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-primary/5 animate-pulse mix-blend-color-burn pointer-events-none"></div>
            
            <div className="flex items-center gap-2 text-primary/70 mb-4 border-b border-white/5 pb-3">
               <TerminalIcon className="w-4 h-4" /> 
               <span className="text-xs tracking-widest uppercase">AI_COACH // ROOT_ACCESS</span>
            </div>
            
            <div className="text-[#00F0FF] min-h-[6rem] text-sm md:text-base leading-loose tracking-wide font-medium whitespace-pre-wrap">
              <TypingText text={aiFeedbackText} speed={30} />
            </div>
          </div>

          {/* Indicators Section */}
          {scenario.indicators && scenario.indicators.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="mt-12 space-y-4"
            >
              <h3 className="font-mono text-white/50 text-xs flex items-center gap-2 uppercase tracking-widest border-b border-white/10 pb-3">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                Detected Anomalies & Threat Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {scenario.indicators.map((ind: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 + (idx * 0.2) }}
                    key={idx} className="bg-black/40 p-4 rounded-sm border-l-2 border-destructive flex flex-col gap-2 relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 text-[100px] font-black text-destructive/5 -mt-8 -mr-4 pointer-events-none">
                      {idx + 1}
                    </div>
                    <div className="text-destructive font-mono font-bold text-xs uppercase tracking-wider bg-destructive/10 px-2 py-1 w-fit rounded">Element Found</div>
                    <div className="text-white font-mono text-sm border-l border-white/20 pl-3">"{ind.text}"</div>
                    <div className="text-muted-foreground text-sm font-sans flex-1">{ind.reason}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-end border-t border-white/10 pt-8">
              <CyberButton onClick={() => router.push("/dashboard")} variant="ghost" className="border border-white/20 text-white hover:bg-white/5 py-4 px-6 w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" /> RETURN TO BASE
              </CyberButton>
              <CyberButton onClick={() => router.push("/simulation")} variant="primary" className="py-4 px-8 w-full sm:w-auto shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                NEXT SIMULATION <ArrowRight className="w-4 h-4 ml-2" />
              </CyberButton>
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
}
