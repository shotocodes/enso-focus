"use client";

import { t } from "@/lib/i18n";
import { Locale } from "@/lib/i18n";
import { previewSound, setVolume } from "@/lib/sound";
import { SoundSettings, ThemeMode, TimerConfig, TickSoundType, TICK_SOUND_I18N_KEYS } from "@/types";
import { SpeakerOnIcon, SpeakerOffIcon } from "../Icons";

interface Props {
  timerConfig: TimerConfig;
  onTimerConfigChange: (config: TimerConfig) => void;
  soundSettings: SoundSettings;
  onSoundSettingsChange: (settings: SoundSettings) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const FOCUS_OPTIONS = [15, 25, 30, 45, 60];
const BREAK_OPTIONS = [5, 10, 15, 20];

export default function SettingsTab({
  timerConfig,
  onTimerConfigChange,
  soundSettings,
  onSoundSettingsChange,
  theme,
  onThemeChange,
  locale,
  onLocaleChange,
}: Props) {
  return (
    <div className="animate-tab-enter space-y-6">
      {/* Timer settings */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-4">
        <h3 className="text-sm font-medium">{t("settings.timer")}</h3>

        {/* Focus duration */}
        <div>
          <label className="text-xs text-muted block mb-2">{t("settings.focusDuration")}</label>
          <div className="flex gap-2 flex-wrap">
            {FOCUS_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => onTimerConfigChange({ ...timerConfig, focusMinutes: m })}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  timerConfig.focusMinutes === m
                    ? "bg-emerald-500 text-white"
                    : "bg-subtle text-muted hover:text-white"
                }`}
              >
                {m}{t("settings.minutesSuffix")}
              </button>
            ))}
          </div>
        </div>

        {/* Break duration */}
        <div>
          <label className="text-xs text-muted block mb-2">{t("settings.breakDuration")}</label>
          <div className="flex gap-2 flex-wrap">
            {BREAK_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => onTimerConfigChange({ ...timerConfig, breakMinutes: m })}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  timerConfig.breakMinutes === m
                    ? "bg-amber-500 text-white"
                    : "bg-subtle text-muted hover:text-white"
                }`}
              >
                {m}{t("settings.minutesSuffix")}
              </button>
            ))}
          </div>
        </div>

        {/* Auto-start break */}
        <div className="flex items-center justify-between">
          <span className="text-sm">{t("settings.autoStartBreak")}</span>
          <button
            onClick={() => onTimerConfigChange({ ...timerConfig, autoStartBreak: !timerConfig.autoStartBreak })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              timerConfig.autoStartBreak ? "bg-emerald-500" : "bg-subtle"
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              timerConfig.autoStartBreak ? "translate-x-5.5" : "translate-x-0.5"
            }`} />
          </button>
        </div>
      </section>

      {/* Sound settings */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{t("settings.sound")}</h3>
          <button
            onClick={() => onSoundSettingsChange({ ...soundSettings, enabled: !soundSettings.enabled })}
            className={`transition-colors ${soundSettings.enabled ? "text-emerald-500" : "text-muted"}`}
          >
            {soundSettings.enabled ? <SpeakerOnIcon size={20} /> : <SpeakerOffIcon size={20} />}
          </button>
        </div>

        {soundSettings.enabled && (
          <>
            <div>
              <label className="text-xs text-muted block mb-2">{t("settings.soundType")}</label>
              <div className="flex gap-2">
                {(["classic", "soft", "digital"] as TickSoundType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      onSoundSettingsChange({ ...soundSettings, tickSound: type });
                      setVolume(soundSettings.volume);
                      previewSound(type);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      soundSettings.tickSound === type
                        ? "bg-emerald-500 text-white"
                        : "bg-subtle text-muted hover:text-white"
                    }`}
                  >
                    {t(TICK_SOUND_I18N_KEYS[type])}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted block mb-2">{t("settings.volume")}</label>
              <input
                type="range"
                min={0}
                max={100}
                value={soundSettings.volume * 100}
                onChange={(e) => onSoundSettingsChange({ ...soundSettings, volume: Number(e.target.value) / 100 })}
                className="w-full accent-emerald-500"
              />
            </div>
          </>
        )}
      </section>

      {/* Theme */}
      <section className="bg-card rounded-2xl p-4 border border-card space-y-3">
        <h3 className="text-sm font-medium">{t("settings.theme")}</h3>
        <div className="flex gap-2">
          {(["dark", "light", "system"] as ThemeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onThemeChange(m)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                theme === m
                  ? "bg-emerald-500 text-white"
                  : "bg-subtle text-muted hover:text-white"
              }`}
            >
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
            <button
              key={l}
              onClick={() => onLocaleChange(l)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                locale === l
                  ? "bg-emerald-500 text-white"
                  : "bg-subtle text-muted hover:text-white"
              }`}
            >
              {t(`lang.${l}`)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
