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
  "history.period.7days": { ja: "7日間", en: "7 Days", zh: "7天", ko: "7일" },
  "history.period.1month": { ja: "1ヶ月", en: "1 Month", zh: "1个月", ko: "1개월" },
  "history.period.all": { ja: "すべて", en: "All", zh: "全部", ko: "전체" },

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

  // Completion sound types
  "settings.completionSound": { ja: "完了音", en: "Completion Sound", zh: "完成音", ko: "완료 소리" },
  "sound.celebration": { ja: "セレブレーション", en: "Celebration", zh: "庆祝", ko: "축하" },
  "sound.chime": { ja: "チャイム", en: "Chime", zh: "铃声", ko: "차임" },
  "sound.gentle": { ja: "やさしい", en: "Gentle", zh: "轻柔", ko: "부드러운" },
  "sound.none": { ja: "なし", en: "None", zh: "无", ko: "없음" },

  // Daily goal
  "settings.dailyGoal": { ja: "1日の目標", en: "Daily Goal", zh: "每日目标", ko: "일일 목표" },
  "settings.goalOff": { ja: "なし", en: "Off", zh: "关闭", ko: "없음" },
  "goal.progress": { ja: "今日の目標", en: "Today's Goal", zh: "今日目标", ko: "오늘의 목표" },
  "goal.achieved": { ja: "達成！", en: "Achieved!", zh: "达成！", ko: "달성!" },

  // History enriched
  "history.streak": { ja: "連続日数", en: "Streak", zh: "连续天数", ko: "연속 일수" },
  "history.streakDays": { ja: "日連続", en: "days", zh: "天连续", ko: "일 연속" },
  "history.weeklyAvg": { ja: "週間平均", en: "Weekly Avg", zh: "周均", ko: "주간 평균" },
  "history.perDay": { ja: "/日", en: "/day", zh: "/天", ko: "/일" },

  // Menu
  "menu.title": { ja: "メニュー", en: "Menu", zh: "菜单", ko: "메뉴" },
  "menu.credits": { ja: "クレジット", en: "Credits", zh: "制作信息", ko: "크레딧" },
  "menu.version": { ja: "バージョン", en: "Version", zh: "版本", ko: "버전" },

  // Tags
  "tag.select": { ja: "カテゴリ", en: "Category", zh: "分类", ko: "카테고리" },
  "tag.work": { ja: "仕事", en: "Work", zh: "工作", ko: "업무" },
  "tag.study": { ja: "勉強", en: "Study", zh: "学习", ko: "공부" },
  "tag.creative": { ja: "創作", en: "Creative", zh: "创作", ko: "창작" },
  "tag.exercise": { ja: "運動", en: "Exercise", zh: "运动", ko: "운동" },
  "tag.reading": { ja: "読書", en: "Reading", zh: "阅读", ko: "독서" },
  "tag.edit": { ja: "カテゴリを編集", en: "Edit Categories", zh: "编辑分类", ko: "카테고리 편집" },
  "tag.add": { ja: "追加", en: "Add", zh: "添加", ko: "추가" },
  "tag.namePlaceholder": { ja: "カテゴリ名", en: "Category name", zh: "分类名", ko: "카테고리명" },
  "tag.max": { ja: "最大4つまで", en: "Max 4 tags", zh: "最多4个", ko: "최대 4개" },
  "settings.categories": { ja: "カテゴリ", en: "Categories", zh: "分类", ko: "카테고리" },
  "history.categories": { ja: "カテゴリ別", en: "By Category", zh: "按分类", ko: "카테고리별" },
  "history.noTag": { ja: "未分類", en: "Uncategorized", zh: "未分类", ko: "미분류" },

  // Completion memo
  "memo.title": { ja: "セッション完了！", en: "Session Complete!", zh: "专注完成！", ko: "세션 완료!" },
  "memo.placeholder": { ja: "何に集中した？", en: "What did you focus on?", zh: "你专注了什么？", ko: "무엇에 집중했나요?" },
  "memo.save": { ja: "保存", en: "Save", zh: "保存", ko: "저장" },
  "memo.skip": { ja: "スキップ", en: "Skip", zh: "跳过", ko: "건너뛰기" },

  // Ambient sounds
  "settings.ambient": { ja: "環境音", en: "Ambient Sound", zh: "环境音", ko: "환경음" },
  "settings.ambientType": { ja: "環境音の種類", en: "Sound Type", zh: "环境音类型", ko: "환경음 종류" },
  "settings.ambientVolume": { ja: "環境音の音量", en: "Ambient Volume", zh: "环境音音量", ko: "환경음 음량" },
  "ambient.thunder": { ja: "雷雨", en: "Thunder", zh: "雷雨", ko: "천둥" },
  "ambient.fire": { ja: "焚き火", en: "Fireplace", zh: "壁炉", ko: "모닥불" },
  "ambient.cafe": { ja: "カフェ", en: "Cafe", zh: "咖啡厅", ko: "카페" },
  "ambient.birds": { ja: "小鳥", en: "Birds", zh: "鸟鸣", ko: "새소리" },
  "ambient.waves": { ja: "波", en: "Waves", zh: "海浪", ko: "파도" },

  // Cross-data
  "menu.focusLifePercent": { ja: "今日の集中 = 人生の {0}", en: "Today's focus = {0} of life", zh: "今日专注 = 人生的 {0}", ko: "오늘의 집중 = 인생의 {0}" },

  // Menu - ENSO apps
  "menu.ensoApps": { ja: "ENSO アプリ", en: "ENSO Apps", zh: "ENSO 应用", ko: "ENSO 앱" },
  "menu.ensoTimer": { ja: "ENSO TIMER", en: "ENSO TIMER", zh: "ENSO TIMER", ko: "ENSO TIMER" },
  "menu.ensoTimerDesc": { ja: "人生という時間を可視化する", en: "Visualize the time called life", zh: "将人生的时间可视化", ko: "인생이라는 시간을 시각화하다" },
  "menu.ensoMind": { ja: "ENSO MIND", en: "ENSO MIND", zh: "ENSO MIND", ko: "ENSO MIND" },
  "menu.ensoMindDesc": { ja: "内省と振り返り", en: "Reflection & mindfulness", zh: "内省与回顾", ko: "내성과 되돌아보기" },
  "menu.ensoCommunity": { ja: "ENSO COMMUNITY", en: "ENSO COMMUNITY", zh: "ENSO COMMUNITY", ko: "ENSO COMMUNITY" },
  "menu.ensoCommunityDesc": { ja: "集中する仲間とつながる", en: "Connect with focused peers", zh: "与专注的伙伴连接", ko: "집중하는 동료와 연결하다" },
  "menu.comingSoon": { ja: "Coming Soon", en: "Coming Soon", zh: "即将推出", ko: "출시 예정" },

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

export function tFormat(key: string, locale?: Locale, ...args: string[]): string {
  let result = t(key, locale);
  args.forEach((arg, i) => {
    result = result.replace(`{${i}}`, arg);
  });
  return result;
}
