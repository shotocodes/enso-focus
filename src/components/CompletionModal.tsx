"use client";

import { useState, useEffect, useRef } from "react";
import { t } from "@/lib/i18n";
import { FocusTag, TAG_COLORS, TAG_I18N_KEYS } from "@/types";
import { CheckCircleIcon } from "./Icons";

interface Props {
  duration: number;
  tag?: FocusTag;
  onSave: (memo: string) => void;
  onSkip: () => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}${t("time.hours")} ${m}${t("time.minutes")}`;
  return `${m}${t("time.minutes")}`;
}

export default function CompletionModal({ duration, tag, onSave, onSkip }: Props) {
  const [memo, setMemo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSkip]);

  const handleSave = () => {
    onSave(memo.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onSkip}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-modal rounded-2xl p-6 border border-card max-w-sm w-full animate-celebrate"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <CheckCircleIcon size={48} className="text-emerald-500" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-1">{t("memo.title")}</h2>

        {/* Duration + tag */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-sm text-muted">{formatDuration(duration)}</span>
          {tag && (
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: TAG_COLORS[tag] }}
            >
              {t(TAG_I18N_KEYS[tag])}
            </span>
          )}
        </div>

        {/* Memo input */}
        <input
          ref={inputRef}
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
          placeholder={t("memo.placeholder")}
          className="w-full bg-input border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors mb-4"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 rounded-xl bg-subtle text-muted text-sm font-medium hover:text-white transition-colors"
          >
            {t("memo.skip")}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            {t("memo.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
