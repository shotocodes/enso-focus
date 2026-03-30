export type Locale = "ja" | "en" | "zh" | "ko";

const translations: Record<string, Record<Locale, string>> = {
  // App
  "app.name": { ja: "ENSO FOCUS", en: "ENSO FOCUS", zh: "ENSO FOCUS", ko: "ENSO FOCUS" },
  "app.tagline": { ja: "円相：集中する時間を作る", en: "Create time to focus", zh: "圆相：创造专注的时间", ko: "원상: 집중하는 시간을 만들다" },
  "app.credit": { ja: "by CreativeStudio SHOTO.", en: "by CreativeStudio SHOTO.", zh: "by CreativeStudio SHOTO.", ko: "by CreativeStudio SHOTO." },
  "app.description": {
    ja: "集中は最高の生産性。ポモドーロテクニックで、深い集中を習慣にする。",
    en: "Focus is the ultimate productivity. Build deep concentration habits with the Pomodoro Technique.",
    zh: "专注是最高的生产力。用番茄工作法，让深度专注成为习惯。",
    ko: "집중은 최고의 생산성. 포모도로 테크닉으로 깊은 집중을 습관으로 만들다.",
  },

  // Tabs
  "tabs.focus": { ja: "集中", en: "Focus", zh: "专注", ko: "집중" },
  "tabs.history": { ja: "記録", en: "History", zh: "记录", ko: "기록" },
  "tabs.settings": { ja: "設定", en: "Settings", zh: "设置", ko: "설정" },
  "tabs.menu": { ja: "メニュー", en: "Menu", zh: "菜单", ko: "메뉴" },

  // Focus tab
  "focus.mode.focus": { ja: "集中", en: "Focus", zh: "专注", ko: "집중" },
  "focus.mode.break": { ja: "休憩", en: "Break", zh: "休息", ko: "휴식" },
  "focus.start": { ja: "開始", en: "Start", zh: "开始", ko: "시작" },
  "focus.pause": { ja: "一時停止", en: "Pause", zh: "暂停", ko: "일시정지" },
  "focus.resume": { ja: "再開", en: "Resume", zh: "继续", ko: "재개" },
  "focus.reset": { ja: "リセット", en: "Reset", zh: "重置", ko: "리셋" },
  "focus.skip": { ja: "スキップ", en: "Skip", zh: "跳过", ko: "건너뛰기" },
  "focus.fullscreen": { ja: "集中モード", en: "Focus Mode", zh: "专注模式", ko: "집중 모드" },
  "focus.exitFullscreen": { ja: "終了", en: "Exit", zh: "退出", ko: "종료" },
  "focus.sessionComplete": { ja: "集中セッション完了！", en: "Focus session complete!", zh: "专注结束！", ko: "집중 세션 완료!" },
  "focus.breakComplete": { ja: "休憩終了！", en: "Break is over!", zh: "休息结束！", ko: "휴식 종료!" },
  "focus.ready": { ja: "集中する準備はできましたか？", en: "Ready to focus?", zh: "准备好专注了吗？", ko: "집중할 준비가 되었나요?" },
  "focus.min": { ja: "分", en: "min", zh: "分钟", ko: "분" },

  // History tab
  "history.title": { ja: "集中記録", en: "Focus History", zh: "专注记录", ko: "집중 기록" },
  "history.today": { ja: "今日", en: "Today", zh: "今天", ko: "오늘" },
  "history.thisWeek": { ja: "今週", en: "This Week", zh: "本周", ko: "이번 주" },
  "history.thisMonth": { ja: "今月", en: "This Month", zh: "本月", ko: "이번 달" },
  "history.total": { ja: "合計", en: "Total", zh: "总计", ko: "합계" },
  "history.sessions": { ja: "セッション", en: "sessions", zh: "次", ko: "세션" },
  "history.noSessions": { ja: "まだ記録がありません", en: "No sessions yet", zh: "暂无记录", ko: "아직 기록이 없습니다" },
  "history.last7days": { ja: "過去7日間", en: "Last 7 Days", zh: "过去7天", ko: "최근 7일" },
  "history.clearAll": { ja: "すべて削除", en: "Clear All", zh: "清除全部", ko: "전체 삭제" },
  "history.clearConfirm": { ja: "すべての記録を削除しますか？", en: "Clear all records?", zh: "删除所有记录？", ko: "모든 기록을 삭제하시겠습니까?" },

  // Time units
  "time.hours": { ja: "時間", en: "h", zh: "小时", ko: "시간" },
  "time.minutes": { ja: "分", en: "m", zh: "分", ko: "분" },
  "time.seconds": { ja: "秒", en: "s", zh: "秒", ko: "초" },
  "time.hoursLabel": { ja: "時間", en: "Hours", zh: "小时", ko: "시간" },
  "time.minutesLabel": { ja: "分", en: "Min", zh: "分", ko: "분" },

  // Settings
  "settings.title": { ja: "設定", en: "Settings", zh: "设置", ko: "설정" },
  "settings.timer": { ja: "タイマー", en: "Timer", zh: "计时器", ko: "타이머" },
  "settings.focusDuration": { ja: "集中時間", en: "Focus Duration", zh: "专注时长", ko: "집중 시간" },
  "settings.breakDuration": { ja: "休憩時間", en: "Break Duration", zh: "休息时长", ko: "휴식 시간" },
  "settings.autoStartBreak": { ja: "休憩を自動開始", en: "Auto-start Break", zh: "自动开始休息", ko: "자동 휴식 시작" },
  "settings.minutesSuffix": { ja: "分", en: "min", zh: "分钟", ko: "분" },
  "settings.sound": { ja: "サウンド", en: "Sound", zh: "声音", ko: "사운드" },
  "settings.soundType": { ja: "音の種類", en: "Sound Type", zh: "声音类型", ko: "소리 종류" },
  "settings.volume": { ja: "音量", en: "Volume", zh: "音量", ko: "음량" },
  "settings.theme": { ja: "テーマ", en: "Theme", zh: "主题", ko: "테마" },
  "settings.language": { ja: "言語", en: "Language", zh: "语言", ko: "언어" },
  "theme.dark": { ja: "ダーク", en: "Dark", zh: "深色", ko: "다크" },
  "theme.light": { ja: "ライト", en: "Light", zh: "浅色", ko: "라이트" },
  "theme.system": { ja: "システム", en: "System", zh: "系统", ko: "시스템" },

  // Sound types
  "sound.classic": { ja: "クラシック", en: "Classic", zh: "经典", ko: "클래식" },
  "sound.soft": { ja: "ソフト", en: "Soft", zh: "柔和", ko: "소프트" },
  "sound.digital": { ja: "デジタル", en: "Digital", zh: "数字", ko: "디지털" },

  // Menu
  "menu.title": { ja: "メニュー", en: "Menu", zh: "菜单", ko: "메뉴" },
  "menu.credits": { ja: "クレジット", en: "Credits", zh: "制作信息", ko: "크레딧" },
  "menu.version": { ja: "バージョン", en: "Version", zh: "版本", ko: "버전" },

  // Menu - ENSO apps
  "menu.ensoApps": { ja: "ENSO アプリ", en: "ENSO Apps", zh: "ENSO 应用", ko: "ENSO 앱" },
  "menu.ensoTimer": { ja: "ENSO TIMER", en: "ENSO TIMER", zh: "ENSO TIMER", ko: "ENSO TIMER" },
  "menu.ensoTimerDesc": { ja: "人生という時間を可視化する", en: "Visualize the time called life", zh: "将人生的时间可视化", ko: "인생이라는 시간을 시각화하다" },

  // Language names
  "lang.ja": { ja: "日本語", en: "日本語", zh: "日本語", ko: "日本語" },
  "lang.en": { ja: "English", en: "English", zh: "English", ko: "English" },
  "lang.zh": { ja: "中文", en: "中文", zh: "中文", ko: "中文" },
  "lang.ko": { ja: "한국어", en: "한국어", zh: "한국어", ko: "한국어" },
};

let _locale: Locale = "ja";

export function t(key: string, locale?: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  const l = locale ?? _locale;
  return entry[l] || entry["en"] || key;
}

export function setLocale(locale: Locale): void {
  _locale = locale;
}
