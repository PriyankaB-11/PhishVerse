"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Crosshair, Shield, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RedTeamPage() {
  const router = useRouter();
  const [vector, setVector] = useState("email");
  const [payload, setPayload] = useState("");
  const [battleLog, setBattleLog] = useState<{attacker: string, result: string, blocked: boolean}[]>([]);

  const launchAttack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payload) return;

    // Simulate AI Blue Team defense evaluation rules
    const lowerPayload = payload.toLowerCase();
    let isBlocked = false;
    let resultMsg = "Attack bypassed filters and reached target.";

    if (lowerPayload.includes("password") || lowerPayload.includes("login") || lowerPayload.includes("verify")) {
       isBlocked = true;
       resultMsg = "Blocked by AI Email Gateway: Detected credential harvesting keywords.";
    } else if (lowerPayload.includes("http") && vector === "sms") {
       isBlocked = true; 
       resultMsg = "Blocked by Mobile Carrier Filter: Suspicious URL in SMS.";
    } else if (lowerPayload.length < 20) {
       isBlocked = true;
       resultMsg = "Blocked by Heuristic Filter: Low entropy / lack of context.";
    }

    setBattleLog([{ attacker: payload, result: resultMsg, blocked: isBlocked }, ...battleLog]);
    setPayload("");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto flex flex-col font-mono text-red-500">
      <div className="w-full flex justify-between items-center mb-8 border-b border-red-900 pb-4">
        <Button variant="ghost" className="text-red-800 hover:text-red-500 hover:bg-transparent" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> DASHBOARD
        </Button>
        <h1 className="text-2xl font-bold tracking-widest text-center flex items-center gap-3">
          <Crosshair className="w-6 h-6 animate-pulse" />
          ADVANCED PERSISTENT THREAT (RED TEAM MODE)
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
         {/* Red Team Attacker Panel */}
         <div className="border border-red-900 bg-black/60 p-6 rounded flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Terminal className="w-5 h-5"/> ASSEMBLE PAYLOAD</h2>
            
            <form onSubmit={launchAttack} className="flex-1 flex flex-col gap-4">
               <div className="grid grid-cols-3 gap-2">
                 {['email', 'sms', 'chat'].map(v => (
                   <div 
                     key={v}
                     onClick={() => setVector(v)}
                     className={`p-2 text-center border cursor-pointer uppercase text-xs font-bold transition-all ${vector === v ? 'border-red-500 bg-red-950 text-white' : 'border-red-900/50 text-red-900 hover:bg-red-900/10'}`}
                   >
                     {v}
                   </div>
                 ))}
               </div>

               <textarea 
                  className="w-full flex-1 bg-[#1a0505] border border-red-900 p-4 text-red-400 focus:outline-none focus:border-red-500 resize-none font-mono text-sm leading-relaxed"
                  placeholder="> Enter social engineering text payload to attempt filtering bypass...\n> (Hint: obvious keywords like 'password' or 'login' will be blocked by the AI Blue Team)"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
               ></textarea>

               <Button type="submit" className="w-full bg-red-900 hover:bg-red-600 text-white rounded-none uppercase tracking-widest font-bold border border-red-500">
                 EXECUTE INJECTION
               </Button>
            </form>
         </div>

         {/* Blue Team Defender Matrix */}
         <div className="border border-blue-900 bg-[#000510] p-6 rounded flex flex-col shadow-[0_0_20px_rgba(30,58,138,0.2)]">
            <h2 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2"><Shield className="w-5 h-5"/> AI BLUE TEAM: FIREWALL MATRIX</h2>
            
            <div className="flex-1 bg-black border border-blue-900/50 p-4 overflow-y-auto space-y-4">
               {battleLog.length === 0 ? (
                 <p className="text-blue-900 text-sm animate-pulse">Monitoring inbound traffic...</p>
               ) : (
                 battleLog.map((log, i) => (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     key={i} 
                     className={`p-3 border text-xs leading-relaxed ${log.blocked ? 'bg-blue-950/30 border-blue-800 text-blue-300' : 'bg-red-950/30 border-red-800 text-red-400'}`}
                   >
                     <div className="font-bold flex justify-between">
                       <span>{log.blocked ? '[BLOCKED]' : '[CRITICAL: BYPASS SUCCESS]'}</span>
                     </div>
                     <p className="mt-2 opacity-80 border-l border-current pl-2">Payload: "{log.attacker}"</p>
                     <p className="mt-2 font-bold">{log.result}</p>
                   </motion.div>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
