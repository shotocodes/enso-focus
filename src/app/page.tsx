"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AmbientSettings, CompletionSoundType, CustomTag, DailyGoal, DEFAULT_TAGS, EnsoTask, TabId, ThemeMode, TimerConfig, TimerMode, DEFAULT_TIMER_CONFIG } from "@/types";
import { Locale, setLocale, t } from "@/lib/i18n";
import {
  getTimerConfig, saveTimerConfig, getAmbientSettings, saveAmbientSettings,
  getCompletionSound, saveCompletionSound, getDailyGoal, saveDailyGoal, getTags, saveTags,
  getActiveTab, saveActiveTab, getTheme, saveTheme, getStoredLocale,
  saveLocale as saveLocaleStorage, addSession, getStats,
  getEnsoTasks, recordFocusToJournal,
} from "@/lib/storage";
import { playCompletionSound, playAlert } from "@/lib/sound";
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
  const resolved = theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : theme;
  document.documentElement.setAttribute("data-theme", resolved);
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("focus");
  const [timerConfig, setTimerConfig] = useState<TimerConfig>(DEFAULT_TIMER_CONFIG);
  const [ambientSettings, setAmbientSettings] = useState<AmbientSettings>({ enabled: false, type: "thunder", volume: 0.3 });
  const [completionSound, setCompletionSound] = useState<CompletionSoundType>("celebration");
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ minutes: 0 });
  const [tags, setTags] = useState<CustomTag[]>(DEFAULT_TAGS);
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [locale, setLocaleState] = useState<Locale>("ja");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [todaySeconds, setTodaySeconds] = useState(0);

  // ENSO TASK連携
  const [ensoTasks, setEnsoTasks] = useState<EnsoTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [pendingSessionData, setPendingSessionData] = useState<{
    startedAt: string; endedAt: string; duration: number;
  } | null>(null);

  const sessionStartRef = useRef<string | null>(null);

  const handleTimerComplete = useCallback((mode: TimerMode) => {
    if (mode === "focus" && sessionStartRef.current) {
      const now = new Date().toISOString();
      const duration = Math.round((Date.now() - new Date(sessionStartRef.current).getTime()) / 1000);
      setPendingSessionData({ startedAt: sessionStartRef.current, endedAt: now, duration });
      sessionStartRef.current = null;
      setShowCompletionModal(true);
      playCompletionSound(completionSound);
    } else if (mode === "break") {
      playAlert();
    }
  }, [completionSound]);

  const timer = useTimer({ config: timerConfig, onComplete: handleTimerComplete });

  useAmbientSound({
    enabled: ambientSettings.enabled, type: ambientSettings.type,
    volume: ambientSettings.volume, isPlaying: timer.state === "running", mode: timer.mode,
  });

  useEffect(() => {
    if (timer.state === "running" && timer.mode === "focus" && !sessionStartRef.current)
      sessionStartRef.current = new Date().toISOString();
    if (timer.state === "idle" && timer.mode === "focus")
      sessionStartRef.current = null;
  }, [timer.state, timer.mode]);

  useEffect(() => {
    setTimerConfig(getTimerConfig());
    setAmbientSettings(getAmbientSettings());
    setCompletionSound(getCompletionSound());
    setDailyGoal(getDailyGoal());
    setTags(getTags());
    setActiveTab(getActiveTab());
    setTodaySeconds(getStats().today);
    const storedTheme = getTheme(); setThemeState(storedTheme); applyTheme(storedTheme);
    const storedLocale = getStoredLocale(); setLocaleState(storedLocale); setLocale(storedLocale);
    const loadedTasks = getEnsoTasks();
    setEnsoTasks(loadedTasks);
    // クエリパラメータからタスク自動選択 (?taskId=xxx)
    const params = new URLSearchParams(window.location.search);
    const taskIdParam = params.get("taskId");
    if (taskIdParam && loadedTasks.some((t) => t.id === taskIdParam)) {
      setSelectedTaskId(taskIdParam);
      setActiveTab("focus");
    }
    setMounted(true);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/focus/sw.js");

    // TASKデータをページ復帰時に再読み込み
    const handleVisibility = () => {
      if (document.visibilityState === "visible") setEnsoTasks(getEnsoTasks());
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Refresh today's seconds when sessionVersion changes
  useEffect(() => { setTodaySeconds(getStats().today); }, [sessionVersion]);

  const selectedTask = ensoTasks.find((t) => t.id === selectedTaskId);

  const handleMemoSave = useCallback((data: { memo: string; tag?: string }) => {
    if (pendingSessionData) {
      addSession({
        ...pendingSessionData,
        memo: data.memo || undefined,
        tag: data.tag,
        taskId: selectedTaskId ?? undefined,
        taskTitle: selectedTask?.title,
      });
      setSessionVersion((v) => v + 1);
      // JOURNAL連携
      const durationMin = Math.round(pendingSessionData.duration / 60);
      const label = selectedTask?.title ?? data.tag ?? "Focus";
      recordFocusToJournal(label, durationMin);
    }
    setPendingSessionData(null);
    setShowCompletionModal(false);
    setSelectedTaskId(null);
  }, [pendingSessionData, selectedTaskId, selectedTask]);

  const handleMemoSkip = useCallback(() => {
    if (pendingSessionData) {
      addSession({
        ...pendingSessionData,
        taskId: selectedTaskId ?? undefined,
        taskTitle: selectedTask?.title,
      });
      setSessionVersion((v) => v + 1);
      const durationMin = Math.round(pendingSessionData.duration / 60);
      const label = selectedTask?.title ?? "Focus";
      recordFocusToJournal(label, durationMin);
    }
    setPendingSessionData(null);
    setShowCompletionModal(false);
    setSelectedTaskId(null);
  }, [pendingSessionData, selectedTaskId, selectedTask]);

  const handleTabChange = useCallback((tab: TabId) => { setActiveTab(tab); saveActiveTab(tab); }, []);
  const handleTimerConfigChange = useCallback((c: TimerConfig) => { setTimerConfig(c); saveTimerConfig(c); }, []);
  const handleAmbientSettingsChange = useCallback((s: AmbientSettings) => { setAmbientSettings(s); saveAmbientSettings(s); }, []);
  const handleCompletionSoundChange = useCallback((s: CompletionSoundType) => { setCompletionSound(s); saveCompletionSound(s); }, []);
  const handleDailyGoalChange = useCallback((g: DailyGoal) => { setDailyGoal(g); saveDailyGoal(g); }, []);
  const handleTagsChange = useCallback((t: CustomTag[]) => { setTags(t); saveTags(t); }, []);
  const handleThemeChange = useCallback((t: ThemeMode) => { setThemeState(t); saveTheme(t); applyTheme(t); }, []);
  const handleLocaleChange = useCallback((l: Locale) => { setLocale(l); saveLocaleStorage(l); setLocaleState(l); }, []);
  const handleAmbientToggle = useCallback(() => {
    const u = { ...ambientSettings, enabled: !ambientSettings.enabled };
    setAmbientSettings(u); saveAmbientSettings(u);
  }, [ambientSettings]);
  const handleEnterFullscreen = useCallback(() => { setIsFullscreen(true); document.documentElement.requestFullscreen?.().catch(() => {}); }, []);
  const handleExitFullscreen = useCallback(() => { setIsFullscreen(false); document.exitFullscreen?.().catch(() => {}); }, []);

  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><div className="text-muted text-lg">Loading...</div></div>;

  if (isFullscreen) return (
    <FullscreenFocus secondsLeft={timer.secondsLeft} totalSeconds={timer.totalSeconds} mode={timer.mode} state={timer.state}
      onPause={timer.pause} onResume={timer.resume} onReset={timer.reset} onSkip={timer.skip} onExit={handleExitFullscreen} />
  );

  return (
    <>
      <main className="min-h-screen max-w-lg mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-24">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t("app.name", locale)}</h1>
          <p className="text-xs text-muted mt-0.5">{t("app.tagline", locale)}</p>
        </div>

        {activeTab === "focus" && (
          <FocusTab key={locale} timer={timer} onEnterFullscreen={handleEnterFullscreen}
            ambientEnabled={ambientSettings.enabled} onAmbientToggle={handleAmbientToggle}
            dailyGoal={dailyGoal} todaySeconds={todaySeconds}
            ensoTasks={ensoTasks} selectedTaskId={selectedTaskId} onSelectTask={setSelectedTaskId} />
        )}
        {activeTab === "history" && <HistoryTab key={`${locale}-${sessionVersion}`} />}
        {activeTab === "settings" && (
          <SettingsTab key={locale} timerConfig={timerConfig} onTimerConfigChange={handleTimerConfigChange}
            ambientSettings={ambientSettings} onAmbientSettingsChange={handleAmbientSettingsChange}
            completionSound={completionSound} onCompletionSoundChange={handleCompletionSoundChange}
            dailyGoal={dailyGoal} onDailyGoalChange={handleDailyGoalChange}
            tags={tags} onTagsChange={handleTagsChange}
            theme={theme} onThemeChange={handleThemeChange} locale={locale} onLocaleChange={handleLocaleChange} />
        )}
        {activeTab === "menu" && <MenuTab key={locale} />}
      </main>

      <BottomTabBar key={locale} activeTab={activeTab} onTabChange={handleTabChange} />

      {showCompletionModal && pendingSessionData && (
        <CompletionModal duration={pendingSessionData.duration} tags={tags} defaultMemo={selectedTask?.title} onSave={handleMemoSave} onSkip={handleMemoSkip} />
      )}
    </>
  );
}
