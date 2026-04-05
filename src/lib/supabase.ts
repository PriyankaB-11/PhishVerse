import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

// We export a real client if keys exist, otherwise a fake object that will just warn
export const supabase = hasSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({} as any); // Fallback is handled via a unified API layer if needed, but for the demo we'll use a local mock store

// Mock Database for hackathon demo out-of-the-box experience
export class LocalMockDB {
  static getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('phishverse_user');
    return user ? JSON.parse(user) : null;
  }

  static login(email: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('phishverse_user', JSON.stringify({ id: 'user_' + Date.now(), email }));
    if (!localStorage.getItem('phishverse_level')) {
      localStorage.setItem('phishverse_level', '1');
      localStorage.setItem('phishverse_history', JSON.stringify([]));
      localStorage.setItem('phishverse_lost_revenue', '0');
      localStorage.setItem('phishverse_leaks', JSON.stringify([]));
    }
  }

  static logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('phishverse_user');
  }

  static getScore() {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('phishverse_score') || '0', 10);
  }

  static getLostRevenue() {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('phishverse_lost_revenue') || '0', 10);
  }

  static getLeaks() {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('phishverse_leaks') || '[]'); } catch { return []; }
  }

  static recordFailure(cost: number, leakData: string) {
     if (typeof window === 'undefined') return;
     const current = this.getLostRevenue();
     localStorage.setItem('phishverse_lost_revenue', (current + cost).toString());
     
     const leaks = this.getLeaks();
     leaks.push({ asset: leakData, date: Date.now() });
     localStorage.setItem('phishverse_leaks', JSON.stringify(leaks));
  }

  static updateScore(points: number) {
    if (typeof window === 'undefined') return;
    const current = this.getScore();
    const newScore = Math.max(0, current + points);
    localStorage.setItem('phishverse_score', newScore.toString());
    
    // auto level up
    const currentLevel = this.getLevel();
    if (newScore >= currentLevel * 50) {
       localStorage.setItem('phishverse_level', (currentLevel + 1).toString());
    }
  }

  static getLevel() {
    if (typeof window === 'undefined') return 1;
    return parseInt(localStorage.getItem('phishverse_level') || '1', 10);
  }

  static getHistory() {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('phishverse_history') || '[]');
    } catch {
      return [];
    }
  }

  static addHistoryEntry(entry: { verdict: string, action: string, type: string, timeTakenMs?: number }) {
    if (typeof window === 'undefined') return;
    const history = this.getHistory();
    history.push({ ...entry, timestamp: Date.now() });
    localStorage.setItem('phishverse_history', JSON.stringify(history));
  }

  static getPersonality() {
    const history = this.getHistory();
    if (history.length < 3) return "CALIBRATING...";
    
    // Evaluate personality based on clicks on malicious vs fast reporting
    const maliciousClicks = history.filter((h: any) => h.verdict === 'malicious' && h.action === 'click_link').length;
    const fastReports = history.filter((h: any) => h.verdict === 'malicious' && h.action === 'report' && (h.timeTakenMs || 10000) < 5000).length;
    
    if (maliciousClicks > history.length * 0.3) return "IMPULSIVE / HIGH RISK";
    if (fastReports > history.length * 0.5) return "HYPER-VIGILANT";
    return "CAUTIOUS OPERATIVE";
  }
}
