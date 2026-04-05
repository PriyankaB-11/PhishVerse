"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, ArrowRight, Home, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalMockDB } from "@/lib/supabase";

function useTypingEffect(text: string, speed = 20) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayed;
}

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
    LocalMockDB.updateScore(points);

    // Save history
    const timeTakenStr = sessionStorage.getItem("phishverse_timetaken");
    const timeTakenMs = timeTakenStr ? parseInt(timeTakenStr, 10) : 10000;
    LocalMockDB.addHistoryEntry({
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
          aiFeedbackText = "Excellent work. You successfully identified the threat and reported it to the security team. Highlighting red flags below...";
      } else if (action === "click_link") {
          aiFeedbackText = "CRITICAL FAILURE. You interacted with a malicious payload. In a real-world scenario, your device would now be compromised. Analyzing your mistakes...";
      } else if (action === "ignore") {
          aiFeedbackText = "You avoided the threat by ignoring it, but failed to report it. Active threats should always be flagged. Let's review the indicators.";
      }
    } else {
      // It's a SAFE communication
      if (action === "report") {
          aiFeedbackText = "FALSE POSITIVE. You flagged a completely legitimate communication. Too many false positives waste security team resources. Let's see why this was safe.";
      } else if (action === "click_link" || action === "ignore") {
          aiFeedbackText = "Good judgment. This was a completely legitimate day-to-day communication. You accurately avoided false positives.";
      }
    }
  }

  const typedFeedback = useTypingEffect(aiFeedbackText, 30);

  if (!scenario) return null;

  const isSuccess = scoreChange > 0;

  return (
    <div className="min-h-screen p-4 md:p-12 max-w-5xl mx-auto flex flex-col items-center justify-center">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-3xl glass-panel p-8 rounded-2xl border-2 ${isSuccess ? 'border-primary/50' : 'border-destructive/50'} relative overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 w-full h-1 ${isSuccess ? 'bg-primary' : 'bg-destructive'} animate-pulse`}></div>

        <div className="flex flex-col items-center text-center space-y-6">
          {isSuccess ? (
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center neon-glow-cyan text-primary">
              <ShieldCheck className="w-10 h-10" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center text-destructive !shadow-[0_0_20px_rgba(239,68,68,0.6)]">
              <ShieldAlert className="w-10 h-10" />
            </div>
          )}

          <h1 className="text-3xl font-bold font-mono tracking-wider text-white">
            SIMULATION_TERMINATED
          </h1>

          <div className={`text-xl font-bold font-mono ${isSuccess ? 'text-primary' : 'text-destructive'} flex items-center gap-2`}>
            <Zap className="w-5 h-5"/>
            {scoreChange > 0 ? "+" : ""}{scoreChange} CYBER SCORE
          </div>
        </div>

        {/* Hacker Terminal feedback */}
        <div className="bg-black/60 p-6 rounded-lg mt-8 font-mono border border-white/5 relative">
          <div className="text-primary text-xs mb-2">AI_COACH_TERMINAL &gt;_</div>
          <p className="text-green-400 min-h-[4rem] text-sm md:text-base leading-relaxed">
            {typedFeedback}
            <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse"></span>
          </p>
        </div>

        {/* Indicators Section */}
        {scenario.indicators && scenario.indicators.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="mt-8 space-y-4"
          >
            <h3 className="font-mono text-muted-foreground text-sm uppercase tracking-widest border-b border-white/10 pb-2">
              Threat Indicators Identified
            </h3>
            <div className="space-y-3">
              {scenario.indicators.map((ind: any, idx: number) => (
                <div key={idx} className="bg-white/5 p-4 rounded-md border-l-4 border-destructive flex flex-col gap-1">
                  <div className="text-destructive font-mono font-bold text-sm">Target: "{ind.text}"</div>
                  <div className="text-white/80 text-sm">{ind.reason}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-10 flex gap-4 justify-center">
            <Button onClick={() => router.push("/dashboard")} className="bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black font-mono">
              <Home className="w-4 h-4 mr-2" /> RETURN TO BASE
            </Button>
            <Button onClick={() => router.push("/simulation")} className="bg-primary text-black hover:bg-white hover:text-black font-mono font-bold neon-glow-cyan">
              NEXT SIMULATION <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>

      </motion.div>
    </div>
  );
}
