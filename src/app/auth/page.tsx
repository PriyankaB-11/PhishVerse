"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocalMockDB } from "@/lib/supabase";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const isSignup = searchParams.get("signup") === "true";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (LocalMockDB.getUser()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await LocalMockDB.login(email);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md mx-4 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <div className="flex flex-col items-center mb-8">
          <Shield className="w-12 h-12 text-primary neon-glow-cyan rounded-full p-2 mb-4 bg-black/50" />
          <h2 className="text-2xl font-bold font-mono tracking-wider">
            {isSignup ? "INITIALIZE_USER" : "AUTH_REQUIRED"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-mono">
            Please authenticate to access the system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-primary uppercase tracking-widest">Operator Email</label>
            <Input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary font-mono text-primary placeholder:text-primary/30"
              placeholder="agent@phishverse.io"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-primary uppercase tracking-widest">Access Code</label>
            <Input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary font-mono text-primary placeholder:text-primary/30 tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-black font-mono font-bold tracking-widest transition-all mt-4 relative overflow-hidden group h-12"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="relative z-10">{isSignup ? "CREATE PROFILE" : "AUTHORIZE"}</span>
            )}
            <div className="absolute inset-0 h-full w-full bg-primary/20 -translate-x-full skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </Button>
        </form>

        <div className="mt-8 text-center text-xs font-mono text-muted-foreground">
          {isSignup ? "Have security clearance? " : "New recruit? "}
          <button 
            type="button"
            onClick={() => router.push(isSignup ? "/auth" : "/auth?signup=true")}
            className="text-primary hover:text-white transition-colors underline underline-offset-4"
          >
            {isSignup ? "Login here" : "Sign up here"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
