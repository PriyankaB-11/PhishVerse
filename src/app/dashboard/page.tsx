"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Activity, BarChart, ShieldAlert, Crosshair, Trophy, Globe, BrainCircuit } from "lucide-react";
import { LocalMockDB } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [history, setHistory] = useState<any[]>([]);
  const [personality, setPersonality] = useState("CALIBRATING...");

  useEffect(() => {
    const currentUser = LocalMockDB.getUser();
    if (!currentUser) {
      router.push("/auth");
    } else {
      setUser(currentUser);
      setScore(LocalMockDB.getScore());
      setLevel(LocalMockDB.getLevel());
      setHistory(LocalMockDB.getHistory());
      setPersonality(LocalMockDB.getPersonality());
    }
  }, [router]);

  const handleLogout = () => {
    LocalMockDB.logout();
    router.push("/");
  };

  if (!user) return null;

  const rank = score < 20 ? "NOVICE" : score < 60 ? "OPERATIVE" : "EXPERT";
  const progressPercent = Math.min((score % 50) * 2, 100);

  // Fake chart data based on history length to mock progression
  const chartData = history.length > 0 
    ? history.map((h, i) => ({ name: `M${i+1}`, score: Math.max(0, 10 + (h.verdict === 'malicious' && h.action === 'report' ? 10 : -5)) }))
    : [{ name: 'Start', score: 0 }];

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer" onClick={() => router.push('/story')}>
          <div className="w-14 h-14 bg-primary/20 border border-primary text-primary flex items-center justify-center rounded-lg font-mono font-bold text-2xl neon-glow-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            Lv{level}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono text-white">OPERATOR_DASHBOARD</h1>
            <p className="text-muted-foreground font-mono text-sm">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/story")} className="bg-secondary/20 text-neon-pink border border-secondary hover:bg-secondary hover:text-black font-mono">
            STORY CAMPAIGN
          </Button>
          <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 font-mono" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> DISCONNECT
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-xl flex flex-col justify-between relative overflow-hidden md:col-span-2"
        >
          <div className="absolute top-0 right-0 p-30 bg-primary/10 blur-[100px] w-64 h-64 rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-primary font-mono tracking-widest text-sm flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" /> TOTAL CYBER SCORE
              </h2>
              <div className="text-7xl font-bold text-white mt-2 font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {score}<span className="text-2xl text-muted-foreground">PTS</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-mono mb-1">CURRENT RANK</div>
              <div className="px-3 py-1 bg-secondary/20 text-neon-pink border border-secondary/50 rounded-md font-mono text-sm font-bold inline-block animate-pulse">
                {rank}
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 z-10 relative">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>PROGRESS TO Lvl {level + 1}</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-white/5 [&>div]:bg-primary box-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
          </div>
        </motion.div>

        {/* Action Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-xl border-primary/50 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary/5 -translate-y-full group-hover:translate-y-full transition-transform duration-1000"></div>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/50 relative">
            <Crosshair className="w-10 h-10 text-primary" />
            <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-50"></div>
          </div>
          
          <div>
            <h3 className="font-mono font-bold text-lg text-white">THREAT GENERATOR</h3>
            <p className="text-sm text-muted-foreground mt-2">Initialize a randomized simulation payload.</p>
          </div>

          <div className="flex w-full gap-2">
            <Button onClick={() => router.push("/simulation")} className="flex-1 bg-primary text-black hover:bg-white hover:text-black font-bold font-mono neon-glow-cyan">
              START
            </Button>
            <Button onClick={() => router.push("/builder")} variant="outline" className="bg-transparent border-primary/50 text-primary hover:bg-primary/10 font-mono">
              BUILD
            </Button>
          </div>

          <div className="flex w-full gap-2 mt-2 pt-4 border-t border-white/5">
            <Button onClick={() => router.push("/redteam")} variant="ghost" className="flex-1 text-red-500 hover:text-red-400 hover:bg-red-950/20 font-mono text-xs">
              <Crosshair className="w-3 h-3 mr-1" /> RED TEAM
            </Button>
            <Button onClick={() => router.push("/darkweb")} variant="ghost" className="flex-1 text-green-500 hover:text-green-400 hover:bg-green-950/20 font-mono text-xs">
              <ShieldAlert className="w-3 h-3 mr-1" /> DARK WEB
            </Button>
          </div>
        </motion.div>

        {/* Personality Profiling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-xl border-secondary/30 flex items-center justify-between"
        >
           <div className="flex flex-col">
             <h3 className="font-mono text-sm text-muted-foreground flex items-center gap-2 mb-2">
               <BrainCircuit className="w-4 h-4 text-secondary"/> PSYCHOLOGICAL PROFILE
             </h3>
             <div className="text-lg font-mono font-bold text-secondary text-neon-pink">
               {personality}
             </div>
           </div>
        </motion.div>

        {/* Live Attack Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-panel p-6 rounded-xl border-white/5 md:col-span-2 relative overflow-hidden"
        >
          <h3 className="font-mono text-sm text-muted-foreground mb-4 tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4"/> LIVE GLOBAL INCIDENTS
          </h3>
          <div className="h-40 bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-xs overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/0 to-black/80 z-10"></div>
            <div className="space-y-2 animate-[slideUp_20s_linear_infinite]">
               {Array.from({length: 15}).map((_, i) => (
                 <div key={i} className="flex gap-4 opacity-70">
                   <span className="text-red-500">[{new Date(Date.now() - i*60000).toISOString().split('T')[1].split('.')[0]}]</span>
                   <span className="text-primary truncate">BREACH_DETECTED // VECTOR: {['Spear Phishing', 'Smishing', 'Deepfake Audio', 'Ransomware'][i%4]}</span>
                   <span className="text-muted-foreground ml-auto hidden sm:block">IP: {Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.x.x</span>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-panel p-6 rounded-xl md:col-span-3 border-white/5"
        >
          <h3 className="font-mono text-sm text-muted-foreground mb-6 tracking-widest flex items-center gap-2">
            <BarChart className="w-4 h-4"/> MISSION SUCCESS RATE
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff50" />
                <YAxis stroke="#ffffff50" />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', color: '#fff' }} />
                <Line type="monotone" dataKey="score" stroke="#00F0FF" strokeWidth={3} dot={{ r: 4, fill: '#00F0FF' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
      
      <style jsx global>{`
        @keyframes slideUp {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
}
