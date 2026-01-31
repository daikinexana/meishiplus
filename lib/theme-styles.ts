/**
 * テーマIDに基づくスタイル定義
 * youken.mdの8.3に基づく10種類のテーマ
 */

export interface ThemeStyles {
  background: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  cardBg: string;
  shadow: string;
  heroBg?: string;
}

export const themeStyles: Record<string, ThemeStyles> = {
  T01: {
    // クリーン・誠実
    background: "bg-white",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    accent: "text-blue-600",
    border: "border-gray-200",
    cardBg: "bg-white",
    shadow: "shadow-sm",
    heroBg: "bg-blue-50",
  },
  T02: {
    // ロジカル・整然
    background: "bg-indigo-50",
    textPrimary: "text-indigo-900",
    textSecondary: "text-indigo-700",
    accent: "text-indigo-600",
    border: "border-indigo-300",
    cardBg: "bg-white",
    shadow: "shadow-md",
    heroBg: "bg-indigo-100",
  },
  T03: {
    // やわらか・親近
    background: "bg-orange-50",
    textPrimary: "text-orange-900",
    textSecondary: "text-orange-700",
    accent: "text-orange-600",
    border: "border-orange-200",
    cardBg: "bg-white",
    shadow: "shadow-sm",
    heroBg: "bg-orange-100",
  },
  T04: {
    // ミニマル・信頼
    background: "bg-white",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-500",
    accent: "text-gray-900",
    border: "border-gray-100",
    cardBg: "bg-white",
    shadow: "shadow-none",
    heroBg: "bg-white",
  },
  T05: {
    // モダン・知的
    background: "bg-slate-100",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-700",
    accent: "text-slate-800",
    border: "border-slate-400",
    cardBg: "bg-white",
    shadow: "shadow-lg",
    heroBg: "bg-slate-200",
  },
  T06: {
    // クリエイティブ
    background: "bg-purple-100",
    textPrimary: "text-purple-900",
    textSecondary: "text-purple-700",
    accent: "text-purple-600",
    border: "border-purple-300",
    cardBg: "bg-white",
    shadow: "shadow-md",
    heroBg: "bg-purple-200",
  },
  T07: {
    // 落ち着き・安心
    background: "bg-emerald-50",
    textPrimary: "text-emerald-900",
    textSecondary: "text-emerald-700",
    accent: "text-emerald-700",
    border: "border-emerald-200",
    cardBg: "bg-white",
    shadow: "shadow-sm",
    heroBg: "bg-emerald-100",
  },
  T08: {
    // シャープ・決断
    background: "bg-gray-900",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    accent: "text-white",
    border: "border-gray-700",
    cardBg: "bg-gray-800",
    shadow: "shadow-xl",
    heroBg: "bg-gray-900",
  },
  T09: {
    // ストーリー重視
    background: "bg-stone-50",
    textPrimary: "text-stone-900",
    textSecondary: "text-stone-700",
    accent: "text-stone-800",
    border: "border-stone-300",
    cardBg: "bg-white",
    shadow: "shadow-md",
    heroBg: "bg-stone-100",
  },
  T10: {
    // パーソナル強調
    background: "bg-rose-50",
    textPrimary: "text-rose-900",
    textSecondary: "text-rose-700",
    accent: "text-rose-600",
    border: "border-rose-200",
    cardBg: "bg-white",
    shadow: "shadow-sm",
    heroBg: "bg-rose-100",
  },
};

/**
 * テーマIDからスタイルを取得
 */
export function getThemeStyles(themeId: string | null | undefined): ThemeStyles {
  if (!themeId || !themeStyles[themeId]) {
    // デフォルトはT01（クリーン・誠実）
    return themeStyles.T01;
  }
  return themeStyles[themeId];
}
