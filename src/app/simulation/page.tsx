"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MailOpen, Link as LinkIcon, ShieldCheck, Loader2, FastForward, PhoneIncoming, MessageSquare, Lock, Fingerprint, Terminal, Activity } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlitchText } from "@/components/ui/glitch-text";
import { TypingText } from "@/components/ui/typing-text";

interface Scenario {
  type: "email" | "chat" | "sms" | "voice" | "video";
  subject: string;
  sender: string;
  content: string;
  indicators: Array<{ text: string; reason: string }>;
  verdict: string;
}

export default function SimulationPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(0);
  const [actionProcessing, setActionProcessing] = useState<string | null>(null);

  useEffect(() => {
    const forcedType = sessionStorage.getItem("phishverse_forced_type");
    sessionStorage.removeItem("phishverse_forced_type"); // consume
    
    // Check if custom scenario
    const customScenarioStr = sessionStorage.getItem("phishverse_custom_payload");
    if (customScenarioStr) {
      sessionStorage.removeItem("phishverse_custom_payload");
      const customScenario = JSON.parse(customScenarioStr);
      
      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          format: customScenario.format,
          customContent: customScenario.content,
          subject: customScenario.title,
          sender: customScenario.sender 
        })
      })
      .then(res => res.json())
      .then(data => {
        setScenario(data);
        setLoading(false);
        setStartTime(Date.now());
      }).catch(() => setLoading(false));
      return;
    }

    const payloadFormat = forcedType || ["email", "chat", "sms", "voice", "video"][Math.floor(Math.random() * 5)];

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetContext: "corporate employee", format: payloadFormat })
    })
    .then(res => res.json())
    .then(data => {
      setScenario(data);
      setLoading(false);
      setStartTime(Date.now());
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleAction = (actionType: "click_link" | "ignore" | "report") => {
    if (!scenario || actionProcessing) return;
    
    setActionProcessing(actionType);
    const timeTaken = Date.now() - startTime;
     const resolutionId = crypto.randomUUID();
    sessionStorage.setItem("phishverse_scenario", JSON.stringify(scenario));
    sessionStorage.setItem("phishverse_action", actionType);
    sessionStorage.setItem("phishverse_timetaken", timeTaken.toString());
     sessionStorage.setItem("phishverse_resolution_id", resolutionId);
    
    // Add a slight delay for dramatic effect before navigation
    setTimeout(() => {
      if (scenario.verdict === "malicious" && actionType === "click_link") {
         router.push("/simulation/ransomware");
      } else {
         router.push("/simulation/feedback");
      }
    }, 1500);
  };

  if (loading || !scenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <GlassCard variant="cyber" glow className="p-12 flex flex-col items-center justify-center max-w-md w-full">
           <Terminal className="w-16 h-16 text-primary animate-pulse mb-6" />
           <GlitchText text="SYNTHESIZING THREAT VECTOR" className="text-xl text-primary mb-4" />
           <div className="flex items-center text-muted-foreground font-mono text-sm gap-2">
             <FastForward className="w-4 h-4 animate-spin" />
             <TypingText text="Bypassing firewalls & generating payload..." speed={40} />
           </div>
           
           <div className="w-full mt-8 bg-black/50 h-2 rounded overflow-hidden border border-white/10">
             <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
             />
           </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center relative mt-16">
      
      {/* Glitch Overlay when processing action */}
      <AnimatePresence>
        {actionProcessing === "click_link" && scenario.verdict === "malicious" && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-destructive/20 backdrop-blur-sm flex items-center justify-center pointer-events-none mix-blend-difference"
           >
             <GlitchText text="SYSTEM BREACH DETECTED" className="text-destructive font-black text-6xl md:text-8xl w-full text-center" />
           </motion.div>
        )}
        {actionProcessing && actionProcessing !== "click_link" && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-green-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none mix-blend-screen"
           >
             <div className="w-full h-full border-8 border-green-500/50 absolute inset-0 animate-pulse" />
             <GlitchText text="ACTION REGISTERED" className="text-green-500 font-black text-4xl md:text-6xl w-full text-center" animate={false} />
           </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl space-y-8 relative z-10">
        
        {/* Header Warning */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        >
          <GlassCard variant="alert" className="p-4 flex items-center justify-between shadow-[0_0_30px_rgba(255,0,0,0.2)] animate-pulse">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-destructive animate-ping absolute" />
              <AlertTriangle className="w-8 h-8 text-destructive relative z-10" />
              <div>
                <span className="font-bold tracking-widest text-base md:text-lg text-white font-mono flex gap-2 items-center">
                  <GlitchText text="⚠ ACTIVE THREAT DETECTED" />
                </span>
                <p className="text-xs text-destructive font-mono opacity-80 uppercase tracking-widest">
                  VECTOR_PROTOCOL: {scenario.type}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-destructive/70 px-4 py-1 border border-destructive/30 rounded bg-destructive/10">
               <Fingerprint className="w-4 h-4" /> SANDBOX_ISOLATED
            </div>
          </GlassCard>
        </motion.div>

        {/* Dynamic UI Shells */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} key={scenario.type} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          {scenario.type === 'email' && <EmailUI scenario={scenario} />}
          {(scenario.type === 'chat' || scenario.type === 'sms') && <ChatUI scenario={scenario} />}
          {scenario.type === 'voice' && <VoiceUI scenario={scenario} />}
          {scenario.type === 'video' && <VideoUI scenario={scenario} />}
        </motion.div>

        {/* Interaction Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <CyberButton 
            onClick={() => handleAction("report")} 
            variant="ghost"
            disabled={!!actionProcessing}
            className="h-24 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:border-green-500 font-mono flex flex-col gap-3 group !shadow-[0_0_15px_rgba(74,222,128,0.1)] hover:!shadow-[0_0_30px_rgba(74,222,128,0.4)] transition-all"
          >
            <ShieldCheck className="w-8 h-8 group-hover:scale-110 transition-transform" /> 
            <span>REPORT THREAT</span>
          </CyberButton>

          <CyberButton 
            onClick={() => handleAction("ignore")} 
            variant="ghost" 
            disabled={!!actionProcessing}
            className="h-24 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white font-mono flex flex-col gap-3 group transition-all"
          >
            <MailOpen className="w-8 h-8 group-hover:scale-110 transition-transform" /> 
            <span>IGNORE / CLOSE</span>
          </CyberButton>

          <CyberButton 
            onClick={() => handleAction("click_link")} 
            variant="destructive"
            disabled={!!actionProcessing} 
            className="h-24 flex flex-col gap-3 group !shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:!shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all"
          >
            <LinkIcon className="w-8 h-8 group-hover:scale-110 transition-transform" /> 
            <span>ENGAGE / COMPLY</span>
          </CyberButton>
        </motion.div>
      </div>
    </div>
  );
}

function EmailUI({ scenario }: { scenario: Scenario }) {
  return (
    <GlassCard variant="default" className="overflow-hidden border-white/10 shadow-2xl backdrop-blur-3xl bg-[#0a0a0f]/90">
      <div className="bg-[#151520] p-4 border-b border-white/5 flex items-center justify-between">
         <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 cursor-pointer transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500 cursor-pointer transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/50 hover:bg-green-500 cursor-pointer transition-colors" />
         </div>
         <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest shrink-0 ml-4">SecureMail Client v9.2</span>
      </div>
      <div className="p-8 border-b border-white/5 space-y-4">
        <h2 className="text-2xl font-black font-sans text-white/90">{scenario.subject}</h2>
        <div className="flex justify-between items-center text-sm font-mono bg-white/5 p-3 rounded border border-white/5">
          <span className="text-primary"><span className="text-muted-foreground mr-3 uppercase">From:</span>{scenario.sender}</span>
          <span className="text-muted-foreground hidden sm:inline">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="p-10 min-h-[400px] text-white/80 whitespace-pre-wrap font-sans text-lg leading-relaxed bg-[#050508]">
        {scenario.content}
      </div>
    </GlassCard>
  );
}

function ChatUI({ scenario }: { scenario: Scenario }) {
  return (
    <div className="max-w-md mx-auto bg-black border border-white/20 rounded-[3rem] overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.15)] relative aspect-[9/19]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-black rounded-b-3xl border-b border-white/10 z-20"></div>
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>

      <div className="bg-[#111] p-6 pt-14 flex items-center gap-4 border-b border-white/10 relative z-10">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/50 font-bold text-xl neon-glow-cyan">
          {scenario.sender.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-white text-base tracking-wide">{scenario.sender}</h3>
          <p className="text-xs text-primary animate-pulse font-mono flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-primary inline-block"/> ACTIVE_LINK
          </p>
        </div>
      </div>
      <div className="p-6 bg-[#080808] flex flex-col h-full gap-4 pt-8 relative z-10">
        <motion.div 
           initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
           className="bg-[#1a1a1a] text-white p-4 rounded-2xl rounded-tl-none self-start max-w-[90%] text-base whitespace-pre-wrap shadow-lg border border-white/10 font-sans"
        >
          {scenario.content}
        </motion.div>
      </div>
    </div>
  );
}

function VoiceUI({ scenario }: { scenario: Scenario }) {
  const [transcript, setTranscript] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTranscript(scenario.content.substring(0, i));
      i++;
      if(i > scenario.content.length) clearInterval(timer);
    }, 40);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const cleanContent = scenario.content.replace(/\[.*?\]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanContent);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      clearInterval(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [scenario.content]);

  return (
    <div className="max-w-md mx-auto bg-[#050505] border border-white/20 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.15)] relative aspect-[9/19] flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-blue-900/10 animate-pulse"></div>
      
      <div className="z-10 flex flex-col items-center">
        <div className="w-32 h-32 bg-red-500/10 border-2 border-red-500/40 rounded-full flex items-center justify-center relative mb-8 shadow-[0_0_30px_rgba(255,0,0,0.3)]">
          <PhoneIncoming className="w-12 h-12 text-red-500 animate-ping absolute" />
          <PhoneIncoming className="w-12 h-12 text-red-500 relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 tracking-wider">{scenario.sender}</h2>
        <p className="text-red-500 font-mono text-xs uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded border border-red-500/20">{scenario.subject}</p>
        <p className="text-muted-foreground font-mono mt-6 border border-white/10 px-4 py-1 rounded-full"><span className="text-primary animate-pulse mr-2">●</span>00:00:14</p>
      </div>

      <div className="absolute bottom-8 left-6 right-6 bg-black/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl z-10 text-sm font-mono text-white min-h-[140px] overflow-auto shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <div className="text-[10px] text-primary mb-3 flex items-center gap-2">
           <Activity className="w-3 h-3" /> AUDIO_INTERCEPT_TRANSCRIPT
        </div>
        {transcript}<span className="animate-pulse bg-white w-2 h-4 inline-block align-middle ml-1" />
      </div>
    </div>
  );
}

function VideoUI({ scenario }: { scenario: Scenario }) {
  const [transcript, setTranscript] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTranscript(scenario.content.substring(0, i));
      i++;
      if(i > scenario.content.length) clearInterval(timer);
    }, 40);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanContent = scenario.content.replace(/\[.*?\]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanContent);
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      clearInterval(timer);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [scenario.content]);

  return (
    <GlassCard variant="cyber" className="w-full max-w-4xl mx-auto overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.2)] relative aspect-video flex flex-col p-1">
       <div className="w-full p-3 bg-black flex items-center justify-between border-b border-white/10 relative z-20">
         <div className="flex items-center gap-3 text-xs font-mono text-primary/70">
           <Lock className="w-4 h-4 text-primary" /> SECURE_VIDEO_LINK_ESTABLISHED
         </div>
         <div className="flex gap-2">
            <div className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/50 text-[10px] uppercase font-black rounded animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" /> REC
            </div>
         </div>
       </div>

       <div className="flex-1 relative flex items-center justify-center bg-[#050505] overflow-hidden">
          {/* Simulated Webcam static/glitch */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay z-0"></div>
          <div className="absolute inset-0 bg-primary/5 animate-pulse mix-blend-color-burn z-10 pointer-events-none border-[20px] border-black/40"></div>
          
          {/* Simulated Avatar Placeholder for Deepfake */}
          <div className="relative z-20 w-48 h-48 rounded-full border-4 border-white/10 bg-black flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent animate-pulse delay-75"></div>
            <MessageSquare className="w-16 h-16 text-white/20" />
            
            {/* Audio wave visualizer mock */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 h-8 items-end">
               <motion.div animate={{ height: [10, 30, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 bg-primary/70 rounded-t" />
               <motion.div animate={{ height: [15, 20, 15] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 bg-primary/70 rounded-t" />
               <motion.div animate={{ height: [8, 35, 8] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1.5 bg-primary/70 rounded-t" />
               <motion.div animate={{ height: [20, 10, 20] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1.5 bg-primary/70 rounded-t" />
               <motion.div animate={{ height: [12, 28, 12] }} transition={{ repeat: Infinity, duration: 0.55 }} className="w-1.5 bg-primary/70 rounded-t" />
            </div>
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-6 left-6 bg-black/90 px-4 py-2 rounded border border-white/10 font-mono text-sm text-white flex items-center gap-3 backdrop-blur z-20">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_5px_currentColor]"></div> {scenario.sender}
          </div>
       </div>

       <div className="h-32 bg-black border-t border-white/10 p-5 font-mono text-sm text-white overflow-auto relative z-20">
         <div className="text-secondary mb-2 text-xs opacity-80 flex items-center gap-2">
            <ScanlineIcon /> AUTO_TRANSLATION
         </div>
         <p className="opacity-95 leading-relaxed text-base">{transcript}<span className="animate-pulse bg-white w-2 h-4 inline-block align-middle ml-1" /></p>
       </div>
    </GlassCard>
  );
}

// Simple icon for captions
function ScanlineIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
