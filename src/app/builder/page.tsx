"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Cpu, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AttackBuilderPage() {
  const router = useRouter();
  const [format, setFormat] = useState("email");
  const [title, setTitle] = useState("");
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { format, title, sender, content };
    sessionStorage.setItem("phishverse_custom_payload", JSON.stringify(payload));
    router.push("/simulation");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-12">
        <Button variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> DASHBOARD
        </Button>
        <h1 className="text-3xl font-bold font-mono text-white tracking-widest text-center flex items-center gap-4">
          <Cpu className="w-8 h-8 text-primary neon-glow-cyan" />
          PAYLOAD BUILDER
        </h1>
        <div className="w-24"></div> 
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full glass-panel border border-white/10 rounded-xl p-8 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] w-64 h-64 rounded-full pointer-events-none"></div>

        <form onSubmit={handleLaunch} className="space-y-6 relative z-10 flex flex-col">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {['email', 'chat', 'sms', 'voice'].map((f) => (
              <div 
                key={f} 
                onClick={() => setFormat(f)}
                className={`p-4 rounded-lg font-mono text-center cursor-pointer uppercase font-bold tracking-wider transition-all border ${format === f ? 'bg-primary border-primary text-black neon-glow-cyan shadow-lg' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
              >
                {f}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase tracking-widest">
              {format === 'voice' ? 'Caller ID' : 'Subject / Title'}
            </label>
            <Input required value={title} onChange={e => setTitle(e.target.value)} className="bg-black/50 border-white/10 text-white font-mono" placeholder="Enter objective title..." />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase tracking-widest">
              Sender Identifier
            </label>
            <Input required value={sender} onChange={e => setSender(e.target.value)} className="bg-black/50 border-white/10 text-white font-mono" placeholder="Corporate IT Support" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase tracking-widest flex items-center gap-2">
               <Code className="w-4 h-4"/> Payload Content
            </label>
            <textarea 
              required 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full h-40 bg-black/50 border border-white/10 rounded-md p-4 text-white font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" 
              placeholder="Inject malicious dialogue or message body here..." 
            />
          </div>

          <Button type="submit" className="w-full h-14 bg-primary text-black font-bold font-mono text-lg neon-glow-cyan flex items-center justify-center gap-3 hover:bg-white transition-all mt-4">
             <Rocket className="w-6 h-6" /> COMPILE & DISPATCH
          </Button>

        </form>
      </motion.div>
    </div>
  );
}
