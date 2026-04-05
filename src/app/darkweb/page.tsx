"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TerminalSquare, Search, Fingerprint, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalMockDB } from "@/lib/supabase";

export default function DarkWebPage() {
  const router = useRouter();
  const [leaks, setLeaks] = useState<any[]>([]);

  useEffect(() => {
    let active = true;

    (async () => {
      const snapshot = await LocalMockDB.getSessionSnapshot();
      if (!active) return;

      if (!snapshot) {
        router.push("/auth");
        return;
      }

      setLeaks(snapshot.leaks);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] p-6 font-mono text-green-500 relative overflow-hidden">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex justify-between items-center border-b border-green-900/50 pb-6 mb-8">
           <Button variant="ghost" className="text-green-600 hover:text-green-400 hover:bg-green-950" onClick={() => router.push("/dashboard")}>
             <ArrowLeft className="w-4 h-4 mr-2" /> EXIT ONION ROUTER
           </Button>
           <div className="flex items-center gap-3 text-red-500 font-bold">
             <ShieldAlert className="w-6 h-6 animate-pulse" />
             <span className="tracking-widest uppercase">DarkMarket Intelligence</span>
           </div>
        </header>

        {leaks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 border border-green-900/30 bg-green-950/10">
             <TerminalSquare className="w-16 h-16 text-green-800 mb-4" />
             <p className="text-green-600 text-lg">No breached company assets found on marketplace.</p>
             <p className="text-sm opacity-50 mt-2">Maintain current security posture.</p>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="bg-red-950/20 border border-red-900 p-4 rounded text-red-500 flex items-start gap-4 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
               <Fingerprint className="w-8 h-8 mt-1" />
               <div>
                 <h2 className="font-bold text-lg">CRITICAL INTELLIGENCE ALERT</h2>
                 <p className="text-sm opacity-80 mt-1">Our automated scrapers have detected your simulated organization's assets currently listed for sale on illicit marketplaces. These leaks are the direct consequence of your failed simulations.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leaks.map((leak, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="border border-green-900 bg-black p-5 rounded relative overflow-hidden group hover:border-green-500 transition-colors"
                  >
                     <div className="absolute top-0 right-0 p-2 bg-green-950 border-b border-l border-green-900 text-xs font-bold text-green-700 group-hover:bg-green-900 group-hover:text-green-400">
                        LISTING #{10293 + idx}
                     </div>
                     <h3 className="text-white font-bold text-lg mb-2">{leak.asset}</h3>
                     <div className="text-xs text-green-700 mb-4 space-y-1">
                        <p>Seller: Anonymous_0x{Math.floor(Math.random() * 9000) + 1000}</p>
                        <p>Date: {new Date(leak.date).toLocaleDateString()}</p>
                        <p>Price: {Math.floor(Math.random() * 50) + 5} BTC</p>
                     </div>
                     <div className="flex gap-2">
                       <Button disabled className="bg-green-950 text-green-700 border border-green-900 w-full hover:bg-green-900 hover:text-green-500 font-mono text-xs">
                         <Lock className="w-3 h-3 mr-2" /> PURCHASE EXPLOIT
                       </Button>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
