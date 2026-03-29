"use client";

import { t } from "@/lib/i18n";
import EnsoLogo from "../EnsoLogo";

export default function MenuTab() {
  return (
    <div className="animate-tab-enter flex flex-col items-center text-center pt-8 space-y-6">
      <EnsoLogo size={64} animate className="text-emerald-500" />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("app.name")}</h2>
        <p className="text-sm text-muted mt-1">{t("app.tagline")}</p>
      </div>

      <p className="text-sm text-muted leading-relaxed max-w-xs">
        {t("app.description")}
      </p>

      <div className="pt-4 space-y-2">
        <p className="text-xs text-muted">{t("menu.credits")}</p>
        <p className="text-sm font-medium">{t("app.credit")}</p>
      </div>

      <p className="text-xs text-muted pt-4">{t("menu.version")} 1.0.0</p>
    </div>
  );
}
