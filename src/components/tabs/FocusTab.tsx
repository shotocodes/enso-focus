"use client";

import { t } from "@/lib/i18n";
import { TimerMode, TimerState, DailyGoal } from "@/types";
import { PlayIcon, PauseIcon, SkipIcon, ExpandIcon, SpeakerOnIcon, SpeakerOffIcon } from "../Icons";

interface TimerHandle {
  secondsLeft: number;
  totalSeconds: number;
  mode: TimerMode;
  state: TimerState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
}

interface Props {
  timer: TimerHandle;
  onEnterFullscreen: () => void;
  ambientEnabled: boolean;
  onAmbientToggle: () => void;
  dailyGoal: DailyGoal;
  todaySeconds: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function FocusTab({ timer, onEnterFullscreen, ambientEnabled, onAmbientToggle, dailyGoal, todaySeconds }: Props) {
  const { secondsLeft, totalSeconds, mode, state, start, pause, resume, reset, skip } = timer;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const isFocus = mode === "focus";

  const size = 280;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Daily goal progress
  const goalTarget = dailyGoal.minutes * 60;
  const goalProgress = goalTarget > 0 ? Math.min(todaySeconds / goalTarget, 1) : 0;
  const goalAchieved = goalTarget > 0 && todaySeconds >= goalTarget;

  return (
    <div className="animate-tab-enter flex flex-col items-center">
      {/* Mode label */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
        isFocus ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
      }`}>
        <span className={`w-2 h-2 rounded-full ${isFocus ? "bg-emerald-500" : "bg-amber-500"} ${
          state === "running" ? "animate-timer-pulse" : ""
        }`} />
        {t(isFocus ? "focus.mode.focus" : "focus.mode.break")}
      </div>

      {/* Timer ring */}
      <div className="relative mb-8">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-subtle opacity-30" />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            className={`transition-all duration-1000 ease-linear ${isFocus ? "text-emerald-500" : "text-amber-500"}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-mono font-light tracking-wider">{formatTime(secondsLeft)}</span>
          {state === "idle" && <span className="text-xs text-muted mt-2">{t("focus.ready")}</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {state === "idle" ? (
          <button onClick={start}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors text-white ${
              isFocus ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
            }`}>
            <PlayIcon size={28} />
          </button>
        ) : (
          <>
            <button onClick={reset} className="w-12 h-12 rounded-full bg-card border border-card flex items-center justify-center text-muted hover:text-red-400 transition-colors">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 119 9 9.75 9.75 0 01-6.74-2.74L3 21" /><path d="M3 10V3h7" />
              </svg>
            </button>
            <button onClick={state === "running" ? pause : resume}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors text-white ${
                isFocus ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
              }`}>
              {state === "running" ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
            </button>
            <button onClick={skip} className="w-12 h-12 rounded-full bg-card border border-card flex items-center justify-center text-muted hover:text-white transition-colors">
              <SkipIcon size={20} />
            </button>
          </>
        )}
      </div>

      {/* Bottom controls */}
      {state !== "idle" && (
        <div className="mt-6 flex items-center gap-3">
          <button onClick={onAmbientToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-card text-sm transition-colors ${
              ambientEnabled ? "text-emerald-500" : "text-muted hover:text-white"
            }`}>
            {ambientEnabled ? <SpeakerOnIcon size={16} /> : <SpeakerOffIcon size={16} />}
            {t("settings.ambient")}
          </button>
          <button onClick={onEnterFullscreen}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-card text-sm text-muted hover:text-white transition-colors">
            <ExpandIcon size={16} />{t("focus.fullscreen")}
          </button>
        </div>
      )}

      {/* Daily goal progress */}
      {goalTarget > 0 && (
        <div className="mt-6 w-full max-w-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted">{t("goal.progress")}</span>
            <span className={goalAchieved ? "text-emerald-500 font-medium" : "text-muted"}>
              {goalAchieved ? t("goal.achieved") : `${Math.round(todaySeconds / 60)}/${dailyGoal.minutes}${t("settings.minutesSuffix")}`}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-subtle overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${goalAchieved ? "bg-emerald-500" : "bg-emerald-500/60"}`}
              style={{ width: `${goalProgress * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
