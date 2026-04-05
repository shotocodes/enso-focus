"use client";

import { useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { Locale } from "@/lib/i18n";
import { exportData, importData } from "@/lib/storage";
import { playCompletionSound } from "@/lib/sound";
import { AmbientSettings, AmbientSoundType, AMBIENT_SOUND_I18N_KEYS, CompletionSoundType, COMPLETION_SOUND_I18N_KEYS, CustomTag, DailyGoal, PALETTE, ThemeMode, TimerConfig } from "@/types";
import { SpeakerOnIcon, SpeakerOffIcon } from "../Icons";

interface Props {
  timerConfig: TimerConfig;
  onTimerConfigChange: (config: TimerConfig) => void;
  ambientSettings: AmbientSettings;
  onAmbientSettingsChange: (settings: AmbientSettings) => void;
  completionSound: CompletionSoundType;
  onCompletionSoundChange: (s: CompletionSoundType) => void;
  dailyGoal: DailyGoal;
  onDailyGoalChange: (g: DailyGoal) => void;
  tags: CustomTag[];
  onTagsChange: (tags: CustomTag[]) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const FOCUS_OPTIONS = [15, 25, 30, 45, 60];
const BREAK_OPTIONS = [5, 10, 15, 20];
const GOAL_OPTIONS = [0, 30, 60, 90, 120, 180];

export default function SettingsTab({
  timerConfig, onTimerConfigChange,
  ambientSettings, onAmbientSettingsChange,
  completionSound, onCompletionSoundChange,
  dailyGoal, onDailyGoalChange,
  tags, onTagsChange,
  theme, onThemeChange, locale, onLocaleChange,
}: Props) {
  return (
    <div className="animate-tab-enter space-y-6">
      {/* Timer */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-4">
        <h3 className="text-sm font-medium">{t("settings.timer")}</h3>
        <div>
          <label className="text-xs text-muted block mb-2">{t("settings.focusDuration")}</label>
          <div className="flex gap-2 flex-wrap">
            {FOCUS_OPTIONS.map((m) => (
              <button key={m} onClick={() => onTimerConfigChange({ ...timerConfig, focusMinutes: m })}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${timerConfig.focusMinutes === m ? "bg-emerald-500 text-white" : "bg-subtle text-muted hover:text-white"}`}>
                {m}{t("settings.minutesSuffix")}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted block mb-2">{t("settings.breakDuration")}</label>
          <div className="flex gap-2 flex-wrap">
            {BREAK_OPTIONS.map((m) => (
              <button key={m} onClick={() => onTimerConfigChange({ ...timerConfig, breakMinutes: m })}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${timerConfig.breakMinutes === m ? "bg-amber-500 text-white" : "bg-subtle text-muted hover:text-white"}`}>
                {m}{t("settings.minutesSuffix")}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">{t("settings.autoStartBreak")}</span>
          <button onClick={() => onTimerConfigChange({ ...timerConfig, autoStartBreak: !timerConfig.autoStartBreak })}
            className={`w-11 h-6 rounded-full transition-colors relative ${timerConfig.autoStartBreak ? "bg-emerald-500" : "bg-subtle"}`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${timerConfig.autoStartBreak ? "translate-x-5.5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </section>

      {/* Daily Goal */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-3">
        <h3 className="text-sm font-medium">{t("settings.dailyGoal")}</h3>
        <div className="flex gap-2 flex-wrap">
          {GOAL_OPTIONS.map((m) => (
            <button key={m} onClick={() => onDailyGoalChange({ minutes: m })}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${dailyGoal.minutes === m ? "bg-emerald-500 text-white" : "bg-subtle text-muted hover:text-white"}`}>
              {m === 0 ? t("settings.goalOff") : `${m}${t("settings.minutesSuffix")}`}
            </button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{t("settings.categories")}</h3>
          <span className="text-[10px] text-muted">{t("tag.max")}</span>
        </div>
        <div className="space-y-2">
          {tags.map((tag, idx) => (
            <div key={tag.id} className="flex items-center gap-2">
              {/* Color picker */}
              <div className="relative">
                <button className="w-7 h-7 rounded-full border-2 border-card shrink-0" style={{ backgroundColor: tag.color }} />
                <select
                  value={tag.color}
                  onChange={(e) => {
                    const updated = [...tags];
                    updated[idx] = { ...tag, color: e.target.value };
                    onTagsChange(updated);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  {PALETTE.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Name */}
              <input
                type="text"
                value={tag.name}
                onChange={(e) => {
                  const updated = [...tags];
                  updated[idx] = { ...tag, name: e.target.value };
                  onTagsChange(updated);
                }}
                className="flex-1 bg-input border border-input rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                maxLength={12}
              />
              {/* Delete */}
              <button
                onClick={() => onTagsChange(tags.filter((_, i) => i !== idx))}
                className="text-muted hover:text-red-400 transition-colors text-lg px-1"
              >×</button>
            </div>
          ))}
        </div>
        {tags.length < 4 && (
          <button
            onClick={() => {
              const usedColors = new Set(tags.map((t) => t.color));
              const nextColor = PALETTE.find((c) => !usedColors.has(c)) || PALETTE[0];
              onTagsChange([...tags, { id: crypto.randomUUID(), name: "", color: nextColor }]);
            }}
            className="w-full py-2 rounded-xl border border-dashed border-card text-sm text-muted hover:text-white transition-colors"
          >
            + {t("tag.add")}
          </button>
        )}
      </section>

      {/* Completion Sound */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-3">
        <h3 className="text-sm font-medium">{t("settings.completionSound")}</h3>
        <div className="flex gap-2 flex-wrap">
          {(["celebration", "chime", "gentle", "none"] as CompletionSoundType[]).map((s) => (
            <button key={s} onClick={() => { onCompletionSoundChange(s); playCompletionSound(s); }}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${completionSound === s ? "bg-emerald-500 text-white" : "bg-subtle text-muted hover:text-white"}`}>
              {t(COMPLETION_SOUND_I18N_KEYS[s])}
            </button>
          ))}
        </div>
      </section>

      {/* Ambient */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{t("settings.ambient")}</h3>
          <button onClick={() => onAmbientSettingsChange({ ...ambientSettings, enabled: !ambientSettings.enabled })}
            className={`transition-colors ${ambientSettings.enabled ? "text-emerald-500" : "text-muted"}`}>
            {ambientSettings.enabled ? <SpeakerOnIcon size={20} /> : <SpeakerOffIcon size={20} />}
          </button>
        </div>
        {ambientSettings.enabled && (
          <>
            <div>
              <label className="text-xs text-muted block mb-2">{t("settings.ambientType")}</label>
              <div className="flex gap-2 flex-wrap">
                {(["thunder", "fire", "cafe", "birds", "waves"] as AmbientSoundType[]).map((type) => (
                  <button key={type} onClick={() => onAmbientSettingsChange({ ...ambientSettings, type })}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${ambientSettings.type === type ? "bg-emerald-500 text-white" : "bg-subtle text-muted hover:text-white"}`}>
                    {t(AMBIENT_SOUND_I18N_KEYS[type])}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted block mb-2">{t("settings.ambientVolume")}</label>
              <input type="range" min={0} max={100} value={ambientSettings.volume * 100}
                onChange={(e) => onAmbientSettingsChange({ ...ambientSettings, volume: Number(e.target.value) / 100 })}
                className="w-full accent-emerald-500" />
            </div>
          </>
        )}
      </section>

      {/* Theme */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-3">
        <h3 className="text-sm font-medium">{t("settings.theme")}</h3>
        <div className="flex gap-2">
          {(["dark", "light", "system"] as ThemeMode[]).map((m) => (
            <button key={m} onClick={() => onThemeChange(m)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${theme === m ? "bg-emerald-500 text-white" : "bg-subtle text-muted hover:text-white"}`}>
              {t(`theme.${m}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-3">
        <h3 className="text-sm font-medium">{t("settings.language")}</h3>
        <div className="flex gap-2 flex-wrap">
          {(["ja", "en", "zh", "ko"] as Locale[]).map((l) => (
            <button key={l} onClick={() => onLocaleChange(l)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${locale === l ? "bg-emerald-500 text-white" : "bg-subtle text-muted hover:text-white"}`}>
              {t(`lang.${l}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Data */}
      <DataSection locale={locale} />
    </div>
  );
}

function DataSection({ locale }: { locale: Locale }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const d = new Date();
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    a.download = `enso-focus-${ds}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const ok = importData(text);
      setImportMsg({ ok, text: ok ? t("settings.importSuccess", locale) : t("settings.importFail", locale) });
      if (ok) setTimeout(() => window.location.reload(), 1000);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <section className="bg-card rounded-2xl p-4 border border-card space-y-3">
      <h3 className="text-sm font-medium">{t("settings.data", locale)}</h3>
      <div className="flex gap-2">
        <button onClick={handleExport} className="flex-1 py-2 rounded-full text-sm bg-subtle text-muted hover:text-white transition-colors">
          {t("settings.export", locale)}
        </button>
        <button onClick={() => fileRef.current?.click()} className="flex-1 py-2 rounded-full text-sm bg-subtle text-muted hover:text-white transition-colors">
          {t("settings.import", locale)}
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>
      {importMsg && (
        <p className={`text-xs text-center ${importMsg.ok ? "text-emerald-500" : "text-red-400"}`}>{importMsg.text}</p>
      )}
    </section>
  );
}
