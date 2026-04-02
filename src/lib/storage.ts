import { AmbientSettings, CompletionSoundType, CustomTag, DailyGoal, DEFAULT_TAGS, FocusSession, TabId, ThemeMode, TimerConfig, DEFAULT_TIMER_CONFIG } from "@/types";
import { Locale } from "./i18n";

const PREFIX = "enso-focus-";

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function set(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

// Timer config
export function getTimerConfig(): TimerConfig { return get("timer-config", DEFAULT_TIMER_CONFIG); }
export function saveTimerConfig(config: TimerConfig): void { set("timer-config", config); }

// Sessions
export function getSessions(): FocusSession[] { return get<FocusSession[]>("sessions", []); }
export function addSession(session: Omit<FocusSession, "id">): FocusSession {
  const sessions = getSessions();
  const newSession: FocusSession = { ...session, id: crypto.randomUUID() };
  sessions.push(newSession);
  set("sessions", sessions);
  return newSession;
}
export function clearSessions(): void { set("sessions", []); }

// Stats helpers
function startOfDay(date: Date): Date { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; }
function startOfWeek(date: Date): Date {
  const d = startOfDay(date); const day = d.getDay(); const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff); return d;
}
function startOfMonth(date: Date): Date { const d = startOfDay(date); d.setDate(1); return d; }

export function getStats() {
  const sessions = getSessions();
  const now = new Date();
  const todayStart = startOfDay(now).getTime();
  const weekStart = startOfWeek(now).getTime();
  const monthStart = startOfMonth(now).getTime();
  let today = 0, week = 0, month = 0, total = 0, totalSessions = 0;
  for (const s of sessions) {
    const t = new Date(s.endedAt).getTime();
    total += s.duration; totalSessions++;
    if (t >= monthStart) month += s.duration;
    if (t >= weekStart) week += s.duration;
    if (t >= todayStart) today += s.duration;
  }
  return { today, week, month, total, totalSessions };
}

export function getDailyStats(days: number = 7): { date: string; duration: number }[] {
  const sessions = getSessions();
  const result: { date: string; duration: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const dayStart = startOfDay(d).getTime(); const dayEnd = dayStart + 86400000;
    const dateStr = d.toISOString().slice(0, 10);
    let duration = 0;
    for (const s of sessions) { const t = new Date(s.endedAt).getTime(); if (t >= dayStart && t < dayEnd) duration += s.duration; }
    result.push({ date: dateStr, duration });
  }
  return result;
}

// Streak: consecutive days with at least 1 session
export function getStreak(): number {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;
  const daysWithSessions = new Set<string>();
  for (const s of sessions) daysWithSessions.add(new Date(s.endedAt).toISOString().slice(0, 10));
  let streak = 0;
  const d = new Date();
  // Check if today has sessions, if not start from yesterday
  const todayStr = d.toISOString().slice(0, 10);
  if (!daysWithSessions.has(todayStr)) d.setDate(d.getDate() - 1);
  while (true) {
    const ds = d.toISOString().slice(0, 10);
    if (daysWithSessions.has(ds)) { streak++; d.setDate(d.getDate() - 1); } else break;
  }
  return streak;
}

// Tag stats
export function getTagStats(): Record<string, number> {
  const sessions = getSessions();
  const result: Record<string, number> = {};
  for (const s of sessions) { const key = s.tag || "none"; result[key] = (result[key] || 0) + s.duration; }
  return result;
}

// Custom tags
export function getTags(): CustomTag[] { return get("tags", DEFAULT_TAGS); }
export function saveTags(tags: CustomTag[]): void { set("tags", tags); }

// Completion sound
export function getCompletionSound(): CompletionSoundType { return get("completion-sound", "celebration" as CompletionSoundType); }
export function saveCompletionSound(s: CompletionSoundType): void { set("completion-sound", s); }

// Ambient settings
export function getAmbientSettings(): AmbientSettings { return get("ambient", { enabled: false, type: "thunder" as const, volume: 0.3 }); }
export function saveAmbientSettings(s: AmbientSettings): void { set("ambient", s); }

// Daily goal
export function getDailyGoal(): DailyGoal { return get("daily-goal", { minutes: 0 }); }
export function saveDailyGoal(g: DailyGoal): void { set("daily-goal", g); }

// Tab
export function getActiveTab(): TabId { return get("active-tab", "focus" as TabId); }
export function saveActiveTab(tab: TabId): void { set("active-tab", tab); }

// Theme
export function getTheme(): ThemeMode { return get("theme", "dark" as ThemeMode); }
export function saveTheme(theme: ThemeMode): void { set("theme", theme); }

// Cross-app: read ENSO TIMER life config
export function getEnsoTimerLifeConfig(): { birthDate: string; lifeExpectancy: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("enso-timer-life-config") || localStorage.getItem("enso-life-config") || localStorage.getItem("lifft-life-config");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.birthDate && typeof parsed?.lifeExpectancy === "number") return parsed;
    return null;
  } catch { return null; }
}

// Locale
export function getStoredLocale(): Locale { return get("locale", "ja" as Locale); }
export function saveLocale(locale: Locale): void { set("locale", locale); }

// ===== ENSO TASK連携（読み取り） =====
import type { EnsoTask } from "@/types";

export function getEnsoTasks(): EnsoTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("enso-task-tasks");
    if (!raw) return [];
    const tasks = JSON.parse(raw) as Array<EnsoTask & { order?: number; goalId?: string; active?: boolean }>;
    return tasks
      .filter((t) => !t.completed && (!t.goalId || t.active === true))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch { return []; }
}

// ===== ENSO JOURNAL連携（書き込み） =====

export function recordFocusToJournal(taskTitle: string, durationMin: number): void {
  if (typeof window === "undefined") return;
  try {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const JOURNAL_KEY = "enso-journal-entries";
    const raw = localStorage.getItem(JOURNAL_KEY);
    const entries = raw ? JSON.parse(raw) : [];

    let todayEntry = entries.find((e: { date: string }) => e.date === todayStr);
    const newActivity = {
      id: Date.now().toString(),
      time: timeStr,
      text: `${taskTitle} (${durationMin}min)`,
      icon: "focus",
    };

    if (todayEntry) {
      todayEntry.manualEntries = todayEntry.manualEntries || [];
      todayEntry.manualEntries.push(newActivity);
      todayEntry.updatedAt = now.toISOString();
    } else {
      todayEntry = {
        date: todayStr,
        notes: [],
        manualEntries: [newActivity],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      entries.unshift(todayEntry);
    }

    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("[enso-focus] Failed to record to journal:", e);
  }
}
