"use client";

import { t } from "@/lib/i18n";
import EnsoLogo from "../EnsoLogo";

export default function MenuTab() {
  return (
    <div className="animate-tab-enter space-y-5">
      <h2 className="text-lg font-bold mb-4">{t("menu.title")}</h2>

      <div className="bg-card rounded-2xl p-6 border border-card text-center">
        <EnsoLogo size={64} className="mx-auto mb-3 text-emerald-500" animate />
        <h3 className="text-lg font-bold">{t("app.name")}</h3>
        <p className="text-xs text-muted mt-1">{t("app.tagline")}</p>
        <p className="text-xs text-muted mt-3 leading-relaxed">{t("app.description")}</p>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-3">{t("menu.ensoApps")}</h3>
        <div className="space-y-1">
          {/* Dashboard */}
          <a href="https://ensolife.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-subtle transition-colors">
            <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
              <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
            </svg>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium block">{t("menu.ensoDashboard")}</span>
              <span className="text-xs text-muted block">{t("menu.ensoDashboardDesc")}</span>
            </div>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
          </a>

          {/* TIMER */}
          <a href="https://ensolife.app/timer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-subtle transition-colors">
            <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
              <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
              <circle cx="50" cy="18" r="5" fill="currentColor" />
            </svg>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium block">{t("menu.ensoTimer")}</span>
              <span className="text-xs text-muted block">{t("menu.ensoTimerDesc")}</span>
            </div>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
          </a>

          {/* JOURNAL */}
          <a href="https://ensolife.app/journal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-subtle transition-colors">
            <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
              <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
              <line x1="38" y1="42" x2="62" y2="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
              <line x1="38" y1="50" x2="62" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
              <line x1="38" y1="58" x2="62" y2="58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="1" />
            </svg>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium block">{t("menu.ensoJournal")}</span>
              <span className="text-xs text-muted block">{t("menu.ensoJournalDesc")}</span>
            </div>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
          </a>

          {/* TASK */}
          <a href="https://ensolife.app/task" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-subtle transition-colors">
            <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
              <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
              <polyline points="38,50 46,58 62,40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium block">{t("menu.ensoTask")}</span>
              <span className="text-xs text-muted block">{t("menu.ensoTaskDesc")}</span>
            </div>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
          </a>

          {/* COMMUNITY - Coming Soon */}
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
      </div>

      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-2">{t("menu.credits")}</h3>
        <p className="text-xs text-muted">{t("app.credit")}</p>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-2">{t("menu.version")}</h3>
        <p className="text-xs text-muted">v2.0.0</p>
      </div>
    </div>
  );
}
