"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { LogOut, Activity, BarChart, ShieldAlert, Crosshair, Trophy, Globe, BrainCircuit } from "lucide-react";
import { LocalMockDB } from "@/lib/supabase";
import { CyberButton } from "@/components/ui/cyber-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlitchText } from "@/components/ui/glitch-text";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [history, setHistory] = useState<any[]>([]);
  const [personality, setPersonality] = useState("CALIBRATING...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const snapshot = await LocalMockDB.getSessionSnapshot();

      if (!active) return;

      if (!snapshot) {
        router.push("/auth");
        return;
      }

      setUser(snapshot.user);
      setScore(snapshot.score);
      setLevel(snapshot.level);
      setHistory(snapshot.history);
      setPersonality(snapshot.personality);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = () => {
    LocalMockDB.logout();
    router.push("/");
  };

  // Counting animation for score
  const AnimatedScore = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(v) {
          setDisplayValue(Math.round(v));
        }
      });
      return controls.stop;
    }, [value]);

    return <span>{displayValue}</span>;
  };

  if (loading || !user) return null;

  const rank = score < 20 ? "NOVICE" : score < 60 ? "OPERATIVE" : "EXPERT";
  const progressPercent = Math.min((score % 50) * 2, 100);

  const chartData = history.length > 0 
    ? history.map((h, i) => ({ name: `M${i+1}`, score: Math.max(0, 10 + (h.verdict === 'malicious' && h.action === 'report' ? 10 : -5)) }))
    : [{ name: 'INIT', score: 0 }];

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-8 mt-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/20 pb-6">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/story')}>
          <div className="w-16 h-16 bg-primary/10 border border-primary text-primary flex items-center justify-center rounded-sm font-mono font-bold text-2xl neon-glow-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)] overflow-hidden relative">
            <span className="relative z-10"><span className="text-xs">Lv</span>{level}</span>
            <div className="absolute inset-0 bg-primary/20 -translate-y-full group-hover:translate-y-full transition-transform duration-500 ease-in-out" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono text-white tracking-widest uppercase">
              <GlitchText text="OPERATOR_DASHBOARD" animate={false} className="group-hover:animate-pulse" />
            </h1>
            <p className="text-primary font-mono text-xs flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> ID: {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <CyberButton onClick={() => router.push("/story")} variant="secondary" className="text-xs py-2 px-4 shadow-[0_0_15px_rgba(255,0,255,0.3)]">
            STORY_CAMPAIGN
          </CyberButton>
          <CyberButton onClick={() => router.push("/leaderboard")} variant="ghost" className="text-xs border border-white/20 py-2 px-4">
            <Trophy className="w-3 h-3 mr-2" /> LEADERBOARD
          </CyberButton>
          <CyberButton variant="ghost" className="text-xs border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-red-400 py-2 px-4" onClick={handleLogout}>
            <LogOut className="w-3 h-3 justify-center" />
          </CyberButton>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score Card */}
        <GlassCard 
          variant="neon" glow className="p-6 md:col-span-2 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-primary/10 blur-[100px] w-64 h-64 rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-primary font-mono tracking-widest text-sm flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" /> TOTAL CYBER SCORE
              </h2>
              <div className="text-8xl font-black text-white mt-2 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                <AnimatedScore value={score} /><span className="text-2xl text-muted-foreground font-light ml-2">PTS</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-mono mb-1">AUTH_RANK</div>
               <div className="px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/50 rounded-sm font-mono text-sm font-bold shadow-[0_0_10px_rgba(255,0,255,0.3)]">
                 <GlitchText text={rank} />
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-8 z-10 relative">
            <div className="flex justify-between text-xs font-mono text-primary/70">
              <span>PROGRESS TO [ LEVEL {level + 1} ]</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5 bg-white/5 [&>div]:bg-primary box-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
          </div>
        </GlassCard>

        {/* Action Panel */}
        <GlassCard 
          variant="cyber" className="p-8 flex flex-col justify-center items-center text-center space-y-6 group"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/50 relative">
            <Crosshair className="w-12 h-12 text-primary" />
            <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-30" />
            {/* Spinning radar sweep */}
            <div className="absolute inset-0 rounded-full [background:conic-gradient(from_0deg,transparent_70%,rgba(0,240,255,0.4)_100%)] animate-spin opacity-50" />
          </div>
          
          <div>
            <h3 className="font-mono font-bold text-lg text-white tracking-widest"><GlitchText text="THREAT GENERATOR" /></h3>
            <p className="text-xs text-muted-foreground mt-2 font-mono uppercase">Initialize runtime simulation parameters.</p>
          </div>

          <div className="flex w-full gap-3">
             <CyberButton onClick={() => router.push("/simulation")} className="flex-1 px-0 py-3 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              EXECUTE
            </CyberButton>
            <CyberButton variant="ghost" onClick={() => router.push("/builder")} className="border border-primary/50 text-primary py-3 px-6">
              BUILD
            </CyberButton>
          </div>

          <div className="flex w-full gap-2 pt-2 border-t border-white/5 w-full mt-2">
            <CyberButton onClick={() => router.push("/redteam")} variant="ghost" className="flex-1 text-red-500 border border-red-500/30 hover:border-red-500 hover:text-red-400 hover:bg-red-950/20 font-mono text-xs py-2 px-1">
              <Crosshair className="w-3 h-3 mr-1 inline-block" /> RED_TEAM
            </CyberButton>
            <CyberButton onClick={() => router.push("/darkweb")} variant="ghost" className="flex-1 text-green-500 border border-green-500/30 hover:border-green-500 hover:text-green-400 hover:bg-green-950/20 font-mono text-xs py-2 px-1">
              <ShieldAlert className="w-3 h-3 mr-1 inline-block" /> DARK_WEB
            </CyberButton>
          </div>
        </GlassCard>

        {/* Personality Profiling */}
        <GlassCard variant="default" className="p-6 border-secondary/30 bg-secondary/5 flex flex-col justify-center">
            <h3 className="font-mono text-xs text-secondary/70 flex items-center gap-2 mb-3 tracking-widest">
              <BrainCircuit className="w-4 h-4"/> PSYCH_PROFILE
            </h3>
            <div className="text-2xl font-mono font-black text-secondary uppercase tracking-wider">
               <GlitchText text={personality} />
            </div>
        </GlassCard>

        {/* Live Attack Feed */}
        <GlassCard 
          variant="default" className="p-6 md:col-span-2 overflow-hidden h-48"
        >
          <h3 className="font-mono text-xs text-muted-foreground mb-4 tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4"/> LIVE_GLOBAL_INCIDENTS
          </h3>
          <div className="h-full bg-black/60 border border-white/5 rounded-sm p-4 font-mono text-xs overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
            <div className="space-y-3 animate-[slideUp_20s_linear_infinite]">
               {Array.from({length: 20}).map((_, i) => (
                 <div key={i} className="flex gap-4 opacity-70 items-center">
                   <span className="text-destructive">[{new Date(Date.now() - i*60000).toISOString().split('T')[1].split('.')[0]}]</span>
                   <span className="text-primary truncate font-bold">BREACH_DETECTED // {['Spear Phishing', 'Smishing', 'Deepfake Audio', 'Ransomware', 'Credential Harvesting'][i%5]}</span>
                   <span className="text-muted-foreground ml-auto hidden sm:block">IP: {Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.x.x</span>
                 </div>
               ))}
            </div>
          </div>
        </GlassCard>

        {/* Performance Chart */}
        <GlassCard 
          variant="default" className="p-6 md:col-span-3 h-80"
        >
          <h3 className="font-mono text-xs text-primary/70 mb-6 tracking-widest flex items-center gap-2">
            <BarChart className="w-4 h-4 text-primary"/> MISSION_SUCCESS_METRICS
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff50', fontFamily: 'monospace', fontSize: 10 }} />
                <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff50', fontFamily: 'monospace', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', borderColor: 'rgba(0,240,255,0.2)', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} 
                  itemStyle={{ color: '#00F0FF' }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="score" 
                  stroke="#00F0FF" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#050505', stroke: '#00F0FF', strokeWidth: 2 }} 
                  activeDot={{ r: 8, fill: '#00F0FF' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>
      
      <style jsx global>{`
        @keyframes slideUp {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}
