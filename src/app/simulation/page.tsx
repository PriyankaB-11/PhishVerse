"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, MailOpen, Link as LinkIcon, ShieldCheck, Loader2, FastForward, PhoneIncoming, MessageSquare, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    if (!scenario) return;
    
    const timeTaken = Date.now() - startTime;
    sessionStorage.setItem("phishverse_scenario", JSON.stringify(scenario));
    sessionStorage.setItem("phishverse_action", actionType);
    sessionStorage.setItem("phishverse_timetaken", timeTaken.toString());
    
    if (scenario.verdict === "malicious" && actionType === "click_link") {
       router.push("/simulation/ransomware");
    } else {
       router.push("/simulation/feedback");
    }
  };

  if (loading || !scenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center glitch-bg">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-mono text-primary animate-pulse">SYNTHESIZING_THREAT_VECTOR...</h2>
        <p className="text-muted-foreground font-mono mt-2 flex items-center gap-2 justify-center">
          <FastForward className="w-4 h-4"/> Bypassing firewalls & generating deepfakes...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header Warning */}
        <div className="w-full p-4 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 rounded-lg flex items-center justify-between font-mono animate-in slide-in-from-top shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-bold tracking-widest text-sm md:text-base">ACTIVE SIMULATION: {scenario.type.toUpperCase()} VECTOR</span>
          </div>
          <span className="hidden md:inline text-xs opacity-70">SANDBOX VER: 5.0.0</span>
        </div>

        {/* Dynamic UI Shells */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} key={scenario.type} animate={{ opacity: 1, scale: 1 }}>
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
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
        >
          <Button onClick={() => handleAction("report")} className="h-20 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-black font-mono flex flex-col gap-2 transition-all w-full !shadow-[0_0_15px_rgba(74,222,128,0.3)] hover:!shadow-[0_0_25px_rgba(74,222,128,0.8)]">
            <ShieldCheck className="w-6 h-6" /> REPORT / FLAG
          </Button>

          <Button onClick={() => handleAction("ignore")} variant="outline" className="h-20 bg-secondary/10 border-white/10 text-white hover:bg-white hover:text-black font-mono flex flex-col gap-2 transition-all w-full">
            <MailOpen className="w-6 h-6" /> IGNORE HANG UP
          </Button>

          <Button onClick={() => handleAction("click_link")} className="h-20 bg-destructive/20 text-destructive border border-destructive/50 hover:bg-destructive hover:text-white font-mono flex flex-col gap-2 transition-all w-full !shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:!shadow-[0_0_25px_rgba(239,68,68,0.8)]">
            <LinkIcon className="w-6 h-6" /> COMPLY / CLICK
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function EmailUI({ scenario }: { scenario: Scenario }) {
  return (
    <div className="bg-[#0f0f15] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-[#1a1a24] p-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <span className="ml-4 text-xs font-mono text-muted-foreground">SecureMail Inbox</span>
      </div>
      <div className="p-6 border-b border-white/5 space-y-3">
        <h2 className="text-xl font-bold font-sans text-white">{scenario.subject}</h2>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white"><span className="text-muted-foreground mr-2 font-mono">From:</span>{scenario.sender}</span>
        </div>
      </div>
      <div className="p-8 min-h-[300px] text-white/90 whitespace-pre-wrap font-sans text-base leading-relaxed bg-black/20">
        {scenario.content}
      </div>
    </div>
  );
}

function ChatUI({ scenario }: { scenario: Scenario }) {
  return (
    <div className="max-w-sm mx-auto bg-black border border-white/20 rounded-[3rem] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] relative aspect-[9/19]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl"></div>
      <div className="bg-[#1e1e1e] p-6 pt-12 flex items-center gap-4 border-b border-white/5">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
          {scenario.sender.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">{scenario.sender}</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>
      <div className="p-4 bg-[#121212] flex flex-col h-full gap-4 pt-8">
        <div className="bg-[#2a2a2a] text-white p-3 rounded-2xl rounded-tl-none self-start max-w-[85%] text-sm whitespace-pre-wrap shadow-md border border-white/5">
          {scenario.content}
        </div>
      </div>
    </div>
  );
}

function VoiceUI({ scenario }: { scenario: Scenario }) {
  // Simulating an active call transcript
  const [transcript, setTranscript] = useState("");
  useEffect(() => {
    // Start text animation
    let i = 0;
    const timer = setInterval(() => {
      setTranscript(scenario.content.substring(0, i));
      i++;
      if(i > scenario.content.length) clearInterval(timer);
    }, 40);

    // Audio Speech Synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // clear previous
      const cleanContent = scenario.content.replace(/\[.*?\]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanContent);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      // Some browsers require user interaction, but since they clicked "START SIMULATION" 
      // recently it might permit it. If not, the text transcript will suffice.
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
    <div className="max-w-sm mx-auto bg-[#0a0a0a] border border-white/20 rounded-[3rem] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] relative aspect-[9/19] flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-blue-900/10 animate-pulse"></div>
      <div className="z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center relative mb-6">
          <PhoneIncoming className="w-10 h-10 text-red-500 animate-ping absolute" />
          <PhoneIncoming className="w-10 h-10 text-red-500 relative z-10" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{scenario.sender}</h2>
        <p className="text-red-400 font-mono text-sm uppercase tracking-widest">{scenario.subject}</p>
        <p className="text-muted-foreground font-mono mt-4">00:00:14</p>
      </div>

      <div className="absolute bottom-10 left-6 right-6 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl z-10 text-sm font-mono text-white min-h-[100px] overflow-auto">
        <div className="text-xs text-primary mb-2">LIVE TRANSCRIPT:</div>
        {transcript}<span className="animate-pulse">_</span>
      </div>
    </div>
  );
}

function VideoUI({ scenario }: { scenario: Scenario }) {
  // Simulating an active deepfake video transcript
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
    <div className="w-full max-w-3xl mx-auto bg-black border border-white/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] relative aspect-video flex flex-col">
       <div className="w-full p-2 bg-[#121212] flex items-center justify-between border-b border-white/10">
         <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
           <Lock className="w-3 h-3 text-green-500" /> End-to-End Encrypted Secure Video
         </div>
         <div className="flex gap-2">
            <div className="px-2 py-1 bg-red-500/20 text-red-500 text-[10px] uppercase font-bold rounded animate-pulse">REC</div>
         </div>
       </div>

       <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
          {/* Simulated Webcam static/glitch */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-primary/5 animate-pulse mix-blend-color-burn"></div>
          
          {/* Simulated Avatar Placeholder for Deepfake */}
          <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white/10 bg-black/50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent animate-pulse"></div>
            <MessageSquare className="w-12 h-12 text-primary opacity-50" />
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded font-mono text-sm text-white flex items-center gap-2 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> {scenario.sender}
          </div>
       </div>

       <div className="h-24 bg-[#0a0a0a] border-t border-white/10 p-3 font-mono text-xs text-white overflow-auto relative">
         <div className="text-secondary mb-1">LIVE CAPTIONS:</div>
         <p className="opacity-90 leading-relaxed text-sm">{transcript}<span className="animate-pulse">_</span></p>
       </div>
    </div>
  );
}
