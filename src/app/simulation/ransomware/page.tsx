"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skull, AlertTriangle, Lock, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalMockDB } from "@/lib/supabase";

export default function RansomwarePage() {
  const router = useRouter();
  const [scenType, setScenType] = useState("unknown");
  const [damage, setDamage] = useState(0);

  useEffect(() => {
    const scenJson = sessionStorage.getItem("phishverse_scenario");
    const scenario = scenJson ? JSON.parse(scenJson) : { type: "unknown" };
    setScenType(scenario.type);
    
    let cost = 0;
    let dataLeak = "";
    if (scenario.type === "email") { cost = 1500000; dataLeak = "Corporate Email Archives"; }
    else if (scenario.type === "voice") { cost = 4200000; dataLeak = "Bank Account Routing Details"; }
    else if (scenario.type === "video") { cost = 8500000; dataLeak = "Executive Wire Transfer Signatures"; }
    else { cost = 250000; dataLeak = "Internal Communications"; }

    setDamage(cost);
    LocalMockDB.recordFailure(cost, dataLeak);
  }, []);

  const handleProceed = () => {
    router.push("/simulation/feedback");
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950 flex flex-col items-center justify-center overflow-auto p-4 md:p-8 font-mono text-red-500 w-full h-full">
      <audio autoPlay loop src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg" className="hidden" />
      
      {/* Intense Glitch Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 animate-[ping_2s_infinite] bg-red-600/10 mix-blend-color-burn pointer-events-none"></div>
      
      <div className="relative z-10 p-6 md:p-8 w-full max-w-4xl border-2 border-red-600 bg-black/90 shadow-[0_0_50px_rgba(220,38,38,0.8)] mt-20 md:mt-0">
         
         <div className="flex flex-col items-center mb-8 text-center">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Skull className="w-24 h-24 md:w-32 md:h-32 text-red-600 mb-4" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(220,38,38,1)] text-center w-full break-words leading-tight">
               SYSTEM COMPROMISED
            </h1>
            <p className="text-sm md:text-lg mt-4 text-red-400 font-bold bg-red-950 px-4 py-1 border border-red-800 break-words text-center">ALL FILES HAVE BEEN ENCRYPTED.</p>
         </div>

         <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 border border-red-600/30 bg-red-950/30">
               <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1 text-yellow-500" />
               <div>
                  <h3 className="font-bold text-white text-lg">WHAT HAPPENED?</h3>
                  <p className="text-sm mt-1 leading-relaxed">
                    You interacted with a malicious <span className="uppercase text-white font-bold">{scenType}</span> payload. Adversaries bypassed firewalls using your stolen session token.
                  </p>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-4 border border-red-600/30 bg-red-950/30">
                 <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-2"><DownloadCloud className="w-5 h-5"/> DATA EXFILTRATED</h3>
                 <div className="text-xs space-y-1">
                   <p className="animate-pulse">Uploading proprietary source code... [100%]</p>
                   <p className="animate-pulse">Uploading employee PII... [100%]</p>
                   <p className="animate-pulse">Publishing to Dark Web Marketplaces...</p>
                 </div>
              </div>
              <div className="flex-1 p-4 border border-red-600/30 bg-red-950/30">
                 <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-2"><Lock className="w-5 h-5"/> ESTIMATED DAMAGES</h3>
                 <p className="text-sm text-red-400">Total Corporate Financial Impact:</p>
                 <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl text-white font-bold tracking-tighter mt-2"
                 >
                   ${damage.toLocaleString()}
                 </motion.p>
              </div>
            </div>

            <div className="pt-8 border-t border-red-800/50 flex justify-center">
              <Button 
                onClick={handleProceed}
                className="bg-red-600 hover:bg-white hover:text-red-600 text-white font-bold text-xl px-12 py-8 rounded-none border border-red-400 uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
              >
                PROCEED TO DEBRIEF
              </Button>
            </div>
         </div>
      </div>
      
      {/* Glitch Overlay Lines */}
      <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between opacity-10 mix-blend-overlay">
        {Array.from({length: 20}).map((_, i) => (
          <div key={i} className="w-full h-1 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
