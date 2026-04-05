"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Hexagon, ShieldHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalMockDB } from "@/lib/supabase";

const PAGE_SIZE = 50;

type LeaderboardEntry = {
  email: string;
  name: string;
  score: number;
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

  const loadBoard = async (nextPage: number, preserveCurrentBoard = false) => {
    if (!preserveCurrentBoard) setLoading(true);
    setError("");

    try {
      const snapshot = await LocalMockDB.getSessionSnapshot();

      if (!snapshot) {
        router.push("/auth");
        return;
      }

      setUserEmail(snapshot.user.email);

      const result = await LocalMockDB.getLeaderboardPage(nextPage, PAGE_SIZE);
      setBoard(result.entries);
      setTotalUsers(result.total);
      setPage(result.page);
    } catch {
      setError("Unable to load leaderboard");
      setBoard([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      if (!active) return;

      await loadBoard(1);
    })();

    return () => {
      active = false;
    };
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
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-white"
          onClick={() => loadBoard(page, true)}
          disabled={loading}
        >
          REFRESH
        </Button>
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
            {loading && (
              <tr className="border-b border-white/5">
                <td className="p-6 text-center text-muted-foreground font-mono" colSpan={3}>Loading leaderboard...</td>
              </tr>
            )}

            {!loading && error && (
              <tr className="border-b border-white/5">
                <td className="p-6 text-center text-destructive font-mono" colSpan={3}>Unable to load leaderboard</td>
              </tr>
            )}

            {!loading && !error && board.length === 0 && (
              <tr className="border-b border-white/5">
                <td className="p-6 text-center text-muted-foreground font-mono" colSpan={3}>No players yet</td>
              </tr>
            )}

            {!loading && !error && board.map((entry, idx) => {
              const globalRank = (page - 1) * PAGE_SIZE + idx + 1;
              const isCurrentUser = entry.email === userEmail;

              return (
                <motion.tr
                  key={`${entry.email}-${globalRank}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${isCurrentUser ? 'bg-primary/10' : ''}`}
                >
                  <td className="p-4 pl-8">
                    <div className="flex items-center gap-2 font-mono font-bold">
                      {globalRank === 1 ? <Hexagon className="w-5 h-5 text-yellow-400 fill-yellow-400/20" /> :
                       globalRank === 2 ? <Hexagon className="w-5 h-5 text-gray-400 fill-gray-400/20" /> :
                       globalRank === 3 ? <Hexagon className="w-5 h-5 text-amber-600 fill-amber-600/20" /> :
                       <span className="text-muted-foreground ml-1">#{globalRank}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 font-mono">
                      <ShieldHalf className={`w-4 h-4 ${isCurrentUser ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={isCurrentUser ? 'text-primary font-bold' : 'text-white'}>
                        {entry.name}{isCurrentUser ? ' (YOU)' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right pr-8 font-mono font-bold text-lg text-white">
                    {entry.score}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between p-4 border-t border-white/5 bg-black/20 font-mono text-xs text-muted-foreground">
          <span>
            Page {page} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-8 px-3 text-muted-foreground hover:text-white"
              disabled={loading || page <= 1}
              onClick={() => loadBoard(page - 1, true)}
            >
              PREV
            </Button>
            <Button
              variant="ghost"
              className="h-8 px-3 text-muted-foreground hover:text-white"
              disabled={loading || page >= totalPages}
              onClick={() => loadBoard(page + 1, true)}
            >
              NEXT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
