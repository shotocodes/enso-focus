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

// Custom tags
export interface CustomTag {
  id: string;
  name: string;
  color: string;
}

export const PALETTE = ["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981", "#ec4899", "#06b6d4", "#f97316"];

export const DEFAULT_TAGS: CustomTag[] = [
  { id: "work", name: "仕事", color: "#3b82f6" },
  { id: "study", name: "勉強", color: "#8b5cf6" },
  { id: "creative", name: "創作", color: "#f59e0b" },
  { id: "exercise", name: "運動", color: "#ef4444" },
];

// Focus session record
export interface FocusSession {
  id: string;
  startedAt: string;
  endedAt: string;
  duration: number;
  tag?: string;   // tag id
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
  minutes: number;
}

// Theme
export type ThemeMode = "dark" | "light" | "system";
