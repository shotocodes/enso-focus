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

// Focus tags
export type FocusTag = "work" | "study" | "creative" | "exercise" | "reading";

export const FOCUS_TAGS: FocusTag[] = ["work", "study", "creative", "exercise", "reading"];

export const TAG_COLORS: Record<FocusTag, string> = {
  work: "#3b82f6",      // blue
  study: "#8b5cf6",     // violet
  creative: "#f59e0b",  // amber
  exercise: "#ef4444",  // red
  reading: "#10b981",   // emerald
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
  startedAt: string; // ISO
  endedAt: string;   // ISO
  duration: number;  // seconds
  tag?: FocusTag;
  memo?: string;
}

// Sound
export type TickSoundType = "classic" | "soft" | "digital";

export const TICK_SOUND_I18N_KEYS: Record<TickSoundType, string> = {
  classic: "sound.classic",
  soft: "sound.soft",
  digital: "sound.digital",
};

export interface SoundSettings {
  enabled: boolean;
  tickSound: TickSoundType;
  volume: number; // 0-1
}

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
  volume: number; // 0-1
}

// Theme
export type ThemeMode = "dark" | "light" | "system";
