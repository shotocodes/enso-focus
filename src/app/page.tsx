"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AmbientSettings, FocusTag, TabId, ThemeMode, TimerConfig, TimerMode, DEFAULT_TIMER_CONFIG } from "@/types";
import { Locale, setLocale, t } from "@/lib/i18n";
import {
  getTimerConfig,
  saveTimerConfig,
  getAmbientSettings,
  saveAmbientSettings,
  getActiveTab,
  saveActiveTab,
  getTheme,
  saveTheme,
  getStoredLocale,
  saveLocale as saveLocaleStorage,
  addSession,
} from "@/lib/storage";
import { playAlert, playCelebration } from "@/lib/sound";
import BottomTabBar from "@/components/BottomTabBar";
import FocusTab from "@/components/tabs/FocusTab";
import HistoryTab from "@/components/tabs/HistoryTab";
import SettingsTab from "@/components/tabs/SettingsTab";
import MenuTab from "@/components/tabs/MenuTab";
import FullscreenFocus from "@/components/FullscreenFocus";
import CompletionModal from "@/components/CompletionModal";
import { useTimer } from "@/hooks/useTimer";
import { useAmbientSound } from "@/hooks/useAmbientSound";

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  document.documentElement.setAttribute("data-theme", resolved);
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("focus");
  const [timerConfig, setTimerConfig] = useState<TimerConfig>(DEFAULT_TIMER_CONFIG);
  const [ambientSettings, setAmbientSettings] = useState<AmbientSettings>({
    enabled: false, type: "rain", volume: 0.3,
  });
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [locale, setLocaleState] = useState<Locale>("ja");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [selectedTag, setSelectedTag] = useState<FocusTag | null>(null);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [pendingSessionData, setPendingSessionData] = useState<{
    startedAt: string; endedAt: string; duration: number; tag?: FocusTag;
  } | null>(null);

  const sessionStartRef = useRef<string | null>(null);

  const handleTimerComplete = useCallback((mode: TimerMode) => {
    if (mode === "focus" && sessionStartRef.current) {
      const now = new Date().toISOString();
      const startTime = new Date(sessionStartRef.current).getTime();
      const duration = Math.round((Date.now() - startTime) / 1000);
      // Store pending data - wait for memo modal
      setPendingSessionData({
        startedAt: sessionStartRef.current,
        endedAt: now,
        duration,
        tag: selectedTag ?? undefined,
      });
      sessionStartRef.current = null;
      setShowCompletionModal(true);
      playCelebration();
    } else if (mode === "break") {
      playAlert();
    }
  }, [selectedTag]);

  const timer = useTimer({ config: timerConfig, onComplete: handleTimerComplete });

  // Ambient sound hook
  useAmbientSound({
    enabled: ambientSettings.enabled,
    type: ambientSettings.type,
    volume: ambientSettings.volume,
    isPlaying: timer.state === "running",
    mode: timer.mode,
  });

  // Track session start
  useEffect(() => {
    if (timer.state === "running" && timer.mode === "focus" && !sessionStartRef.current) {
      sessionStartRef.current = new Date().toISOString();
    }
    if (timer.state === "idle" && timer.mode === "focus") {
      sessionStartRef.current = null;
    }
  }, [timer.state, timer.mode]);

  useEffect(() => {
    setTimerConfig(getTimerConfig());
    setAmbientSettings(getAmbientSettings());
    setActiveTab(getActiveTab());

    const storedTheme = getTheme();
    setThemeState(storedTheme);
    applyTheme(storedTheme);

    const storedLocale = getStoredLocale();
    setLocaleState(storedLocale);
    setLocale(storedLocale);

    setMounted(true);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Completion modal handlers
  const handleMemoSave = useCallback((memo: string) => {
    if (pendingSessionData) {
      addSession({ ...pendingSessionData, memo: memo || undefined });
      setSessionVersion((v) => v + 1);
    }
    setPendingSessionData(null);
    setShowCompletionModal(false);
  }, [pendingSessionData]);

  const handleMemoSkip = useCallback(() => {
    if (pendingSessionData) {
      addSession(pendingSessionData);
      setSessionVersion((v) => v + 1);
    }
    setPendingSessionData(null);
    setShowCompletionModal(false);
  }, [pendingSessionData]);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    saveActiveTab(tab);
  }, []);

  const handleTimerConfigChange = useCallback((config: TimerConfig) => {
    setTimerConfig(config);
    saveTimerConfig(config);
  }, []);

  const handleAmbientSettingsChange = useCallback((settings: AmbientSettings) => {
    setAmbientSettings(settings);
    saveAmbientSettings(settings);
  }, []);

  const handleThemeChange = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    saveLocaleStorage(newLocale);
    setLocaleState(newLocale);
  }, []);

  const handleAmbientToggle = useCallback(() => {
    const updated = { ...ambientSettings, enabled: !ambientSettings.enabled };
    setAmbientSettings(updated);
    saveAmbientSettings(updated);
  }, [ambientSettings]);

  const handleTagChange = useCallback((tag: FocusTag | null) => {
    setSelectedTag(tag);
  }, []);

  const handleEnterFullscreen = useCallback(() => {
    setIsFullscreen(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const handleExitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted text-lg">Loading...</div>
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <FullscreenFocus
        secondsLeft={timer.secondsLeft}
        totalSeconds={timer.totalSeconds}
        mode={timer.mode}
        state={timer.state}
        onPause={timer.pause}
        onResume={timer.resume}
        onReset={timer.reset}
        onSkip={timer.skip}
        onExit={handleExitFullscreen}
      />
    );
  }

  return (
    <>
      <main className="min-h-screen max-w-lg mx-auto px-4 pt-6 pb-24">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t("app.name", locale)}</h1>
          <p className="text-xs text-muted mt-0.5">{t("app.tagline", locale)}</p>
        </div>

        {activeTab === "focus" && (
          <FocusTab
            key={locale}
            timer={timer}
            onEnterFullscreen={handleEnterFullscreen}
            selectedTag={selectedTag}
            onTagChange={handleTagChange}
            ambientEnabled={ambientSettings.enabled}
            onAmbientToggle={handleAmbientToggle}
          />
        )}
        {activeTab === "history" && (
          <HistoryTab key={`${locale}-${sessionVersion}`} />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            key={locale}
            timerConfig={timerConfig}
            onTimerConfigChange={handleTimerConfigChange}
            ambientSettings={ambientSettings}
            onAmbientSettingsChange={handleAmbientSettingsChange}
            theme={theme}
            onThemeChange={handleThemeChange}
            locale={locale}
            onLocaleChange={handleLocaleChange}
          />
        )}
        {activeTab === "menu" && <MenuTab key={locale} />}
      </main>

      <BottomTabBar key={locale} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Completion modal */}
      {showCompletionModal && pendingSessionData && (
        <CompletionModal
          duration={pendingSessionData.duration}
          tag={pendingSessionData.tag}
          onSave={handleMemoSave}
          onSkip={handleMemoSkip}
        />
      )}
    </>
  );
}
