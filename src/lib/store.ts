import type { Profile, SubjectId } from "../data/curriculum";

export type Tab = "home" | "library" | "videos" | "quiz";

const PROFILE_KEY = "studyhaven.profile.v1";
const STATS_KEY = "studyhaven.stats.v1";
const MISSION_KEY = "studyhaven.mission.v1";

// read-through fallback for older saved data so registered students never re-onboard
const LEGACY_KEYS: Record<string, string> = {
  [PROFILE_KEY]: "sarthi.profile.v1",
  [STATS_KEY]: "sarthi.stats.v1",
  [MISSION_KEY]: "sarthi.mission.v1",
};
function readStore(key: string): string | null {
  const fresh = localStorage.getItem(key);
  if (fresh) return fresh;
  const old = localStorage.getItem(LEGACY_KEYS[key] ?? "");
  if (old) localStorage.setItem(key, old); // migrate once
  return old;
}

export interface Stats {
  visits: number;
  streak: number;
  quizzesTaken: number;
  questionsSolved: number;
  best: Partial<Record<SubjectId, number>>; // best percent per subject
  lastQuiz?: { subject: SubjectId; chapter: string; score: number; total: number; at: number };
  lastVisit: string;
}

export const DEFAULT_STATS: Stats = {
  visits: 0,
  streak: 0,
  quizzesTaken: 0,
  questionsSolved: 0,
  best: {},
  lastVisit: "",
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayStr() {
  const d = new Date(Date.now() - 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadProfile(): Profile | null {
  try {
    const raw = readStore(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Profile;
    if (!p.name || !p.grade || !Array.isArray(p.subjects) || p.subjects.length === 0) return null;
    return p;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

export function loadStats(): Stats {
  try {
    const raw = readStore(STATS_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : { ...DEFAULT_STATS };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

function persistStats(s: Stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

/** call once on app open — updates streak + visit counter */
export function bumpVisit(): Stats {
  const s = loadStats();
  const today = todayStr();
  if (s.lastVisit === today) return s;
  s.visits += 1;
  s.streak = s.lastVisit === yesterdayStr() ? s.streak + 1 : 1;
  s.lastVisit = today;
  persistStats(s);
  return s;
}

export function recordQuiz(subject: SubjectId, chapter: string, score: number, total: number): Stats {
  const s = loadStats();
  const pct = Math.round((score / total) * 100);
  s.quizzesTaken += 1;
  s.questionsSolved += score;
  s.best[subject] = Math.max(s.best[subject] ?? 0, pct);
  s.lastQuiz = { subject, chapter, score, total, at: Date.now() };
  persistStats(s);
  return s;
}

/* daily mission checklist */
export function loadMission(): boolean[] {
  try {
    const raw = readStore(MISSION_KEY);
    if (!raw) return [false, false, false];
    const { day, done } = JSON.parse(raw) as { day: string; done: boolean[] };
    return day === todayStr() ? done : [false, false, false];
  } catch {
    return [false, false, false];
  }
}

export function saveMission(done: boolean[]) {
  localStorage.setItem(MISSION_KEY, JSON.stringify({ day: todayStr(), done }));
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Suprabhat";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Late-night grind";
}
