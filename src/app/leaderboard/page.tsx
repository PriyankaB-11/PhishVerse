"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Hexagon, ShieldHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalMockDB } from "@/lib/supabase";

function generateFakeLeaderboard(userScore: number, userEmail: string) {
  const users = [
    { name: "phantom_strike", score: 950 },
    { name: "zero_day", score: 820 },
    { name: "packet_tracer", score: 710 },
    { name: "neon_shadow", score: 605 },
    { name: "null_pointer", score: 450 },
    { name: "cyber_ghost", score: 380 },
    { name: "firewall_sys", score: 290 },
    { name: "rogue_admin", score: 150 },
    { name: "anon_user_99", score: 45 },
  ];

  const board = [...users, { name: userEmail.split('@')[0], score: userScore }];
  board.sort((a, b) => b.score - a.score);
  return board;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [board, setBoard] = useState<{name: string, score: number}[]>([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = LocalMockDB.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }
    setUserEmail(user.email.split('@')[0]);
    setBoard(generateFakeLeaderboard(LocalMockDB.getScore(), user.email));
  }, [router]);

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-12">
        <Button variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> DASHBOARD
        </Button>
        <h1 className="text-3xl font-bold font-mono text-white tracking-widest text-center flex items-center gap-4">
          <Trophy className="w-8 h-8 text-yellow-500 neon-glow-cyan" />
          GLOBAL RANKINGS
        </h1>
        <div className="w-24"></div> 
      </div>

      <div className="w-full glass-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-black/40 text-muted-foreground font-mono text-sm uppercase tracking-widest">
              <th className="p-4 pl-8 w-16">Rank</th>
              <th className="p-4">Operator ID</th>
              <th className="p-4 text-right pr-8">Awareness Score</th>
            </tr>
          </thead>
          <tbody>
            {board.map((entry, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${entry.name === userEmail ? 'bg-primary/10' : ''}`}
              >
                <td className="p-4 pl-8">
                  <div className="flex items-center gap-2 font-mono font-bold">
                    {idx === 0 ? <Hexagon className="w-5 h-5 text-yellow-400 fill-yellow-400/20" /> :
                     idx === 1 ? <Hexagon className="w-5 h-5 text-gray-400 fill-gray-400/20" /> :
                     idx === 2 ? <Hexagon className="w-5 h-5 text-amber-600 fill-amber-600/20" /> :
                     <span className="text-muted-foreground ml-1">#{idx + 1}</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3 font-mono">
                    <ShieldHalf className={`w-4 h-4 ${entry.name === userEmail ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={entry.name === userEmail ? 'text-primary font-bold' : 'text-white'}>
                      {entry.name}{entry.name === userEmail ? ' (YOU)' : ''}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right pr-8 font-mono font-bold text-lg text-white">
                  {entry.score}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
