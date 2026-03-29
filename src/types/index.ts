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

// Focus session record
export interface FocusSession {
  id: string;
  startedAt: string; // ISO
  endedAt: string;   // ISO
  duration: number;  // seconds
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

// Theme
export type ThemeMode = "dark" | "light" | "system";
