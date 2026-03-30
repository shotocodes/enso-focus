"use client";

import { t } from "@/lib/i18n";
import { TimerMode, TimerState, FocusTag, FOCUS_TAGS, TAG_COLORS, TAG_I18N_KEYS } from "@/types";
import { PlayIcon, PauseIcon, SkipIcon, ExpandIcon } from "../Icons";

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
  selectedTag: FocusTag | null;
  onTagChange: (tag: FocusTag | null) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function FocusTab({ timer, onEnterFullscreen, selectedTag, onTagChange }: Props) {
  const { secondsLeft, totalSeconds, mode, state, start, pause, resume, reset, skip } = timer;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const isFocus = mode === "focus";

  const size = 280;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="animate-tab-enter flex flex-col items-center">
      {/* Mode label */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
        isFocus
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-amber-500/10 text-amber-500"
      }`}>
        <span className={`w-2 h-2 rounded-full ${isFocus ? "bg-emerald-500" : "bg-amber-500"} ${
          state === "running" ? "animate-timer-pulse" : ""
        }`} />
        {t(isFocus ? "focus.mode.focus" : "focus.mode.break")}
      </div>

      {/* Tag selector - show when idle and focus mode */}
      {state === "idle" && isFocus && (
        <div className="flex gap-2 mb-5 flex-wrap justify-center">
          {FOCUS_TAGS.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onTagChange(active ? null : tag)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={active ? {
                  backgroundColor: TAG_COLORS[tag],
                  color: "#fff",
                } : undefined}
              >
                {!active && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: TAG_COLORS[tag] }}
                  />
                )}
                <span className={active ? "" : "text-muted"}>{t(TAG_I18N_KEYS[tag])}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Timer ring */}
      <div className="relative mb-8">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-subtle opacity-30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={`transition-all duration-1000 ease-linear ${
              isFocus ? "text-emerald-500" : "text-amber-500"
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-mono font-light tracking-wider">
            {formatTime(secondsLeft)}
          </span>
          {state === "idle" && (
            <span className="text-xs text-muted mt-2">{t("focus.ready")}</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {state === "idle" ? (
          <button
            onClick={start}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isFocus
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            <PlayIcon size={28} />
          </button>
        ) : (
          <>
            <button
              onClick={reset}
              className="w-12 h-12 rounded-full bg-card border border-card flex items-center justify-center text-muted hover:text-red-400 transition-colors"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 119 9 9.75 9.75 0 01-6.74-2.74L3 21" />
                <path d="M3 10V3h7" />
              </svg>
            </button>

            <button
              onClick={state === "running" ? pause : resume}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isFocus
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {state === "running" ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
            </button>

            <button
              onClick={skip}
              className="w-12 h-12 rounded-full bg-card border border-card flex items-center justify-center text-muted hover:text-white transition-colors"
            >
              <SkipIcon size={20} />
            </button>
          </>
        )}
      </div>

      {/* Fullscreen button */}
      {state !== "idle" && (
        <button
          onClick={onEnterFullscreen}
          className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-card text-sm text-muted hover:text-white transition-colors"
        >
          <ExpandIcon size={16} />
          {t("focus.fullscreen")}
        </button>
      )}
    </div>
  );
}
