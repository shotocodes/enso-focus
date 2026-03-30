// Tab navigation
export type TabId = "focus" | "history" | "settings" | "menu";

// Timer
export type TimerMode = "focus" | "break";
export type TimerState = "idle" | "running" | "paused";

export interface TimerConfig {
  focusMinutes: number;
  breakMinutes: number;
  autoStartBreak: boolean;
}

export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  focusMinutes: 25,
  breakMinutes: 5,
  autoStartBreak: true,
};

// Focus tags (selected at completion)
export type FocusTag = "work" | "study" | "creative" | "exercise" | "reading";

export const FOCUS_TAGS: FocusTag[] = ["work", "study", "creative", "exercise", "reading"];

export const TAG_COLORS: Record<FocusTag, string> = {
  work: "#3b82f6",
  study: "#8b5cf6",
  creative: "#f59e0b",
  exercise: "#ef4444",
  reading: "#10b981",
};

export const TAG_I18N_KEYS: Record<FocusTag, string> = {
  work: "tag.work",
  study: "tag.study",
  creative: "tag.creative",
  exercise: "tag.exercise",
  reading: "tag.reading",
};

// Focus session record
export interface FocusSession {
  id: string;
  startedAt: string;
  endedAt: string;
  duration: number;
  tag?: FocusTag;
  memo?: string;
}

// Completion sound
export type CompletionSoundType = "celebration" | "chime" | "gentle" | "none";

export const COMPLETION_SOUND_I18N_KEYS: Record<CompletionSoundType, string> = {
  celebration: "sound.celebration",
  chime: "sound.chime",
  gentle: "sound.gentle",
  none: "sound.none",
};

// Ambient sound
export type AmbientSoundType = "thunder" | "fire" | "cafe" | "birds" | "waves";

export const AMBIENT_SOUND_I18N_KEYS: Record<AmbientSoundType, string> = {
  thunder: "ambient.thunder",
  fire: "ambient.fire",
  cafe: "ambient.cafe",
  birds: "ambient.birds",
  waves: "ambient.waves",
};

export interface AmbientSettings {
  enabled: boolean;
  type: AmbientSoundType;
  volume: number;
}

// Daily goal
export interface DailyGoal {
  minutes: number; // target minutes per day, 0 = disabled
}

// Theme
export type ThemeMode = "dark" | "light" | "system";
