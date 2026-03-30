"use client";

import { t, tFormat } from "@/lib/i18n";
import { getEnsoTimerLifeConfig, getStats } from "@/lib/storage";
import EnsoLogo from "../EnsoLogo";

function getLifePercent(): string | null {
  const config = getEnsoTimerLifeConfig();
  if (!config) return null;
  const stats = getStats();
  if (stats.today === 0) return null;

  try {
    const birth = new Date(config.birthDate);
    const lifeEnd = new Date(birth);
    lifeEnd.setFullYear(lifeEnd.getFullYear() + config.lifeExpectancy);
    const remainingMs = lifeEnd.getTime() - Date.now();
    if (remainingMs <= 0) return null;
    const remainingSeconds = remainingMs / 1000;
    const percent = (stats.today / remainingSeconds) * 100;
    return percent.toFixed(6) + "%";
  } catch {
    return null;
  }
}

export default function MenuTab() {
  const lifePercent = getLifePercent();

  return (
    <div className="animate-tab-enter space-y-5">
      <h2 className="text-lg font-bold mb-4">{t("menu.title")}</h2>

      {/* App info */}
      <div className="bg-card rounded-2xl p-6 border border-card text-center">
        <EnsoLogo size={64} className="mx-auto mb-3 text-emerald-500" animate />
        <h3 className="text-lg font-bold">{t("app.name")}</h3>
        <p className="text-xs text-muted mt-1">{t("app.tagline")}</p>
        <p className="text-xs text-muted mt-3 leading-relaxed">{t("app.description")}</p>
      </div>

      {/* ENSO Apps */}
      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-3">{t("menu.ensoApps")}</h3>

        {/* ENSO TIMER */}
        <a
          href="https://enso-timer.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-subtle transition-colors"
        >
          <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
            <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
            <circle cx="50" cy="18" r="5" fill="currentColor" />
          </svg>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-medium block">{t("menu.ensoTimer")}</span>
            <span className="text-xs text-muted block">{t("menu.ensoTimerDesc")}</span>
            {lifePercent && (
              <span className="text-[10px] text-emerald-500/70 block mt-0.5">
                {tFormat("menu.focusLifePercent", undefined, lifePercent)}
              </span>
            )}
          </div>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>

        {/* ENSO MIND - Coming Soon */}
        <div className="flex items-center gap-3 p-3 -mx-1 rounded-xl opacity-40">
          <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
            <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
            <path d="M35 55 C35 40, 50 30, 50 40 C50 30, 65 40, 65 55 C65 65, 50 75, 50 75 C50 75, 35 65, 35 55Z" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
          <div className="min-w-0">
            <span className="text-sm font-medium block">{t("menu.ensoMind")}</span>
            <span className="text-xs text-muted block">{t("menu.ensoMindDesc")}</span>
            <span className="text-[10px] text-muted block mt-0.5">{t("menu.comingSoon")}</span>
          </div>
        </div>

        {/* ENSO COMMUNITY - Coming Soon */}
        <div className="flex items-center gap-3 p-3 -mx-1 rounded-xl opacity-40">
          <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
            <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
            <circle cx="38" cy="45" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle cx="62" cy="45" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M35 62 Q50 72 65 62" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <div className="min-w-0">
            <span className="text-sm font-medium block">{t("menu.ensoCommunity")}</span>
            <span className="text-xs text-muted block">{t("menu.ensoCommunityDesc")}</span>
            <span className="text-[10px] text-muted block mt-0.5">{t("menu.comingSoon")}</span>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-2">{t("menu.credits")}</h3>
        <p className="text-xs text-muted">{t("app.credit")}</p>
      </div>

      {/* Version */}
      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-2">{t("menu.version")}</h3>
        <p className="text-xs text-muted">v2.0.0</p>
      </div>
    </div>
  );
}
