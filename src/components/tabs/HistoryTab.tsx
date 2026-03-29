"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import { getStats, getDailyStats, getSessions, clearSessions } from "@/lib/storage";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}${t("time.seconds")}`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}${t("time.hours")} ${m}${t("time.minutes")}`;
  return `${m}${t("time.minutes")}`;
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function HistoryTab() {
  const [version, setVersion] = useState(0);
  const stats = getStats();
  const daily = getDailyStats(7);
  const sessions = getSessions().slice().reverse().slice(0, 20);
  const maxDaily = Math.max(...daily.map((d) => d.duration), 1);

  const handleClear = () => {
    if (confirm(t("history.clearConfirm"))) {
      clearSessions();
      setVersion((v) => v + 1);
    }
  };

  // Day label
  const dayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[d.getDay()];
  };

  return (
    <div className="animate-tab-enter space-y-6" key={version}>
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: t("history.today"), value: stats.today },
          { label: t("history.thisWeek"), value: stats.week },
          { label: t("history.thisMonth"), value: stats.month },
          { label: t("history.total"), value: stats.total },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card rounded-2xl p-4 border border-card">
            <div className="text-xs text-muted mb-1">{label}</div>
            <div className="text-xl font-semibold">{formatDuration(value)}</div>
          </div>
        ))}
      </div>

      {/* Total sessions count */}
      <div className="text-center text-sm text-muted">
        {stats.totalSessions} {t("history.sessions")}
      </div>

      {/* 7-day chart */}
      <div className="bg-card rounded-2xl p-4 border border-card">
        <h3 className="text-sm font-medium mb-4">{t("history.last7days")}</h3>
        <div className="flex items-end gap-2 h-24">
          {daily.map(({ date, duration }) => (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
                <div
                  className="w-full max-w-[32px] rounded-t bg-emerald-500/70 transition-all"
                  style={{ height: `${Math.max((duration / maxDaily) * 80, duration > 0 ? 4 : 0)}px` }}
                />
              </div>
              <span className="text-[10px] text-muted">{dayLabel(date)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 ? (
        <div className="space-y-2">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2 px-3 bg-card rounded-xl border border-card">
              <span className="text-sm text-muted">{formatShortDate(s.startedAt)}</span>
              <span className="text-sm font-medium">{formatDuration(s.duration)}</span>
            </div>
          ))}

          <button
            onClick={handleClear}
            className="w-full text-center text-xs text-red-400/60 hover:text-red-400 py-2 transition-colors"
          >
            {t("history.clearAll")}
          </button>
        </div>
      ) : (
        <div className="text-center text-muted text-sm py-8">
          {t("history.noSessions")}
        </div>
      )}
    </div>
  );
}
