"use client";

import { t } from "@/lib/i18n";
import EnsoLogo from "../EnsoLogo";

export default function MenuTab() {
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
        <a
          href="https://enso-timer.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-subtle transition-colors"
        >
          {/* TIMER logo - orbiting dot */}
          <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
            <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
            <circle cx="50" cy="18" r="5" fill="currentColor" />
          </svg>
          <div className="min-w-0">
            <span className="text-sm font-medium block">{t("menu.ensoTimer")}</span>
            <span className="text-xs text-muted block">{t("menu.ensoTimerDesc")}</span>
          </div>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0 ml-auto">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </div>

      {/* Credits */}
      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-2">{t("menu.credits")}</h3>
        <p className="text-xs text-muted">{t("app.credit")}</p>
      </div>

      {/* Version */}
      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-2">{t("menu.version")}</h3>
        <p className="text-xs text-muted">v1.0.0</p>
      </div>
    </div>
  );
}
