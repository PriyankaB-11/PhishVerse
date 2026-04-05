import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({} as any);

type LocalUser = {
  id: string;
  email: string;
};

type HistoryEntry = {
  verdict: string;
  action: string;
  type: string;
  timeTakenMs?: number;
  timestamp?: number;
};

type LeakEntry = {
  asset: string;
  date: number;
};

type SessionSnapshot = {
  user: LocalUser;
  score: number;
  level: number;
  lostRevenue: number;
  history: HistoryEntry[];
  leaks: LeakEntry[];
  personality: string;
};

type RemoteProfileRow = {
  id: string;
  email: string;
  score: number;
  level: number;
  lost_revenue: number;
};

type RemoteHistoryRow = {
  verdict: string;
  action: string;
  type: string;
  time_taken_ms: number;
  created_at: string;
};

type RemoteLeakRow = {
  asset: string;
  created_at: string;
};

type LeaderboardRow = {
  email: string;
  score: number;
};

const STORAGE_KEYS = {
  user: 'phishverse_user',
  score: 'phishverse_score',
  level: 'phishverse_level',
  history: 'phishverse_history',
  lostRevenue: 'phishverse_lost_revenue',
  leaks: 'phishverse_leaks',
};

function canUseStorage() {
  return typeof window !== 'undefined';
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readNumber(key: string, fallback: number) {
  if (!canUseStorage()) return fallback;
  const value = Number.parseInt(localStorage.getItem(key) || '', 10);
  return Number.isFinite(value) ? value : fallback;
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function writeNumber(key: string, value: number) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, value.toString());
}

function readLocalUser() {
  return readJson<LocalUser | null>(STORAGE_KEYS.user, null);
}

function writeLocalUser(user: LocalUser | null) {
  if (!canUseStorage()) return;

  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.user);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function calculateLevel(score: number) {
  return Math.max(1, Math.floor(score / 50) + 1);
}

function calculatePersonality(history: HistoryEntry[]) {
  if (history.length < 3) return 'CALIBRATING...';

  const maliciousClicks = history.filter((entry) => entry.verdict === 'malicious' && entry.action === 'click_link').length;
  const fastReports = history.filter((entry) => entry.verdict === 'malicious' && entry.action === 'report' && (entry.timeTakenMs || 10000) < 5000).length;

  if (maliciousClicks > history.length * 0.3) return 'IMPULSIVE / HIGH RISK';
  if (fastReports > history.length * 0.5) return 'HYPER-VIGILANT';
  return 'CAUTIOUS OPERATIVE';
}

function readCachedSnapshot(): SessionSnapshot | null {
  const user = readLocalUser();
  if (!user) return null;

  const score = readNumber(STORAGE_KEYS.score, 0);
  const level = readNumber(STORAGE_KEYS.level, 1);
  const lostRevenue = readNumber(STORAGE_KEYS.lostRevenue, 0);
  const history = readJson<HistoryEntry[]>(STORAGE_KEYS.history, []);
  const leaks = readJson<LeakEntry[]>(STORAGE_KEYS.leaks, []);

  return {
    user,
    score,
    level,
    lostRevenue,
    history,
    leaks,
    personality: calculatePersonality(history),
  };
}

function cacheSnapshot(snapshot: SessionSnapshot) {
  writeLocalUser(snapshot.user);
  writeNumber(STORAGE_KEYS.score, snapshot.score);
  writeNumber(STORAGE_KEYS.level, snapshot.level);
  writeNumber(STORAGE_KEYS.lostRevenue, snapshot.lostRevenue);
  writeJson(STORAGE_KEYS.history, snapshot.history);
  writeJson(STORAGE_KEYS.leaks, snapshot.leaks);
}

function snapshotFromRemote(profile: RemoteProfileRow, historyRows: RemoteHistoryRow[], leakRows: RemoteLeakRow[]): SessionSnapshot {
  const history = historyRows.map((row) => ({
    verdict: row.verdict,
    action: row.action,
    type: row.type,
    timeTakenMs: row.time_taken_ms,
    timestamp: new Date(row.created_at).getTime(),
  }));

  const leaks = leakRows.map((row) => ({
    asset: row.asset,
    date: new Date(row.created_at).getTime(),
  }));

  return {
    user: { id: profile.id, email: profile.email },
    score: Number(profile.score || 0),
    level: Number(profile.level || 1),
    lostRevenue: Number(profile.lost_revenue || 0),
    history,
    leaks,
    personality: calculatePersonality(history),
  };
}

async function ensureRemoteProfile(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const { data: existing, error: existingError } = await supabase
    .from('profiles')
    .select('id,email,score,level,lost_revenue')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing as RemoteProfileRow;

  const { data, error } = await supabase
    .from('profiles')
    .insert({ email: normalizedEmail })
    .select('id,email,score,level,lost_revenue')
    .single();

  if (error) throw error;
  return data as RemoteProfileRow;
}

async function loadRemoteSnapshot(user: LocalUser) {
  const profile = await ensureRemoteProfile(user.email);
  const [historyResult, leaksResult] = await Promise.all([
    supabase
      .from('simulation_history')
      .select('verdict,action,type,time_taken_ms,created_at')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('security_leaks')
      .select('asset,created_at')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: true }),
  ]);

  if (historyResult.error) throw historyResult.error;
  if (leaksResult.error) throw leaksResult.error;

  return snapshotFromRemote(
    profile,
    (historyResult.data || []) as RemoteHistoryRow[],
    (leaksResult.data || []) as RemoteLeakRow[],
  );
}

export class LocalMockDB {
  static getUser() {
    return readLocalUser();
  }

  static async login(email: string) {
    if (!canUseStorage()) return null;

    const normalizedEmail = email.trim().toLowerCase();
    const userId = `user_${Date.now()}`;

    if (hasSupabase) {
      const profile = await ensureRemoteProfile(normalizedEmail);
      writeLocalUser({ id: profile.id, email: profile.email });
      const snapshot = await loadRemoteSnapshot({ id: profile.id, email: profile.email });
      cacheSnapshot(snapshot);
      return snapshot.user;
    }

    const snapshot: SessionSnapshot = {
      user: { id: userId, email: normalizedEmail },
      score: 0,
      level: 1,
      lostRevenue: 0,
      history: [],
      leaks: [],
      personality: 'CALIBRATING...',
    };

    cacheSnapshot(snapshot);
    return snapshot.user;
  }

  static logout() {
    if (!canUseStorage()) return;

    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.score);
    localStorage.removeItem(STORAGE_KEYS.level);
    localStorage.removeItem(STORAGE_KEYS.history);
    localStorage.removeItem(STORAGE_KEYS.lostRevenue);
    localStorage.removeItem(STORAGE_KEYS.leaks);
  }

  static async getSessionSnapshot() {
    const user = readLocalUser();
    if (!user) return null;

    if (hasSupabase) {
      try {
        const remoteSnapshot = await loadRemoteSnapshot(user);
        cacheSnapshot(remoteSnapshot);
        return remoteSnapshot;
      } catch {
        return readCachedSnapshot();
      }
    }

    return readCachedSnapshot();
  }

  static async getScore() {
    return (await this.getSessionSnapshot())?.score ?? 0;
  }

  static async getLostRevenue() {
    return (await this.getSessionSnapshot())?.lostRevenue ?? 0;
  }

  static async getLeaks() {
    return (await this.getSessionSnapshot())?.leaks ?? [];
  }

  static async getLevel() {
    return (await this.getSessionSnapshot())?.level ?? 1;
  }

  static async getHistory() {
    return (await this.getSessionSnapshot())?.history ?? [];
  }

  static async getPersonality() {
    return (await this.getSessionSnapshot())?.personality ?? 'CALIBRATING...';
  }

  static async updateScore(points: number) {
    const snapshot = readCachedSnapshot();
    if (!snapshot) return;

    const score = Math.max(0, snapshot.score + points);
    const level = calculateLevel(score);
    const nextSnapshot = {
      ...snapshot,
      score,
      level,
    };

    cacheSnapshot(nextSnapshot);

    if (hasSupabase) {
      const profile = await ensureRemoteProfile(snapshot.user.email);
      await supabase
        .from('profiles')
        .update({
          score,
          level,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
    }
  }

  static async recordFailure(cost: number, leakData: string) {
    const snapshot = readCachedSnapshot();
    if (!snapshot) return;

    const lostRevenue = snapshot.lostRevenue + cost;
    const leaks = [...snapshot.leaks, { asset: leakData, date: Date.now() }];
    const nextSnapshot = {
      ...snapshot,
      lostRevenue,
      leaks,
    };

    cacheSnapshot(nextSnapshot);

    if (hasSupabase) {
      const profile = await ensureRemoteProfile(snapshot.user.email);
      await Promise.all([
        supabase
          .from('profiles')
          .update({
            lost_revenue: lostRevenue,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id),
        supabase.from('security_leaks').insert({
          profile_id: profile.id,
          asset: leakData,
        }),
      ]);
    }
  }

  static async addHistoryEntry(entry: { verdict: string; action: string; type: string; timeTakenMs?: number }) {
    const snapshot = readCachedSnapshot();
    if (!snapshot) return;

    const nextHistory: HistoryEntry[] = [
      ...snapshot.history,
      { ...entry, timestamp: Date.now() },
    ];

    const nextSnapshot = {
      ...snapshot,
      history: nextHistory,
      personality: calculatePersonality(nextHistory),
    };

    cacheSnapshot(nextSnapshot);

    if (hasSupabase) {
      const profile = await ensureRemoteProfile(snapshot.user.email);
      await supabase.from('simulation_history').insert({
        profile_id: profile.id,
        verdict: entry.verdict,
        action: entry.action,
        type: entry.type,
        time_taken_ms: entry.timeTakenMs || 0,
      });
    }
  }

  static async getLeaderboardPage(page = 1, pageSize = 50) {
    if (!hasSupabase) {
      throw new Error('Supabase is not configured');
    }

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;

    const { data, error, count } = await supabase
      .from('profiles')
      .select('email,score', { count: 'exact' })
      .order('score', { ascending: false })
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const entries = (data || []).map((entry: LeaderboardRow) => ({
      email: entry.email,
      name: entry.email.split('@')[0],
      score: Number(entry.score || 0),
    }));

    return {
      entries,
      total: count || 0,
      page: safePage,
      pageSize: safePageSize,
    };
  }
}
