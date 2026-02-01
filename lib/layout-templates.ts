/**
 * レイアウトテンプレート定義
 * 10種類のインタビューページUI/UXテンプレート
 */

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  previewImage?: string; // 将来的にプレビュー画像を追加可能
  referenceUrl: string;
  features: string[]; // このテンプレートの特徴
}

export const layoutTemplates: Record<string, LayoutTemplate> = {
  L01: {
    id: "L01",
    name: "クラシック・縦型",
    description: "シンプルで読みやすい縦型レイアウト。大きな見出しと写真で構成された、伝統的なインタビューページスタイル。",
    referenceUrl: "https://www.ark-gr.co.jp/business_blog/interview-tips/",
    features: ["縦型レイアウト", "シンプル", "読みやすい"]
  },
  L02: {
    id: "L02",
    name: "エレガント・ベージュ",
    description: "淡いベージュ背景と大きな写真を組み合わせた、上品で落ち着いたレイアウト。",
    referenceUrl: "https://otonamuse.jp/people/183159/",
    features: ["写真重視", "上品", "落ち着いた"]
  },
  L03: {
    id: "L03",
    name: "Q&A・モダン",
    description: "Q&A形式で構成された、クリーンでモダンなレイアウト。緑のアクセントカラーが特徴的。",
    referenceUrl: "https://ldfcorp.com/ja/careers/interview/interview12/",
    features: ["Q&A形式", "モダン", "クリーン"]
  },
  L04: {
    id: "L04",
    name: "記事型・目次付き",
    description: "目次付きの記事型レイアウト。長文も読みやすく、情報を整理して表示。",
    referenceUrl: "https://newspicks.com/news/14029368/body/",
    features: ["目次付き", "記事型", "読みやすい"]
  },
  L05: {
    id: "L05",
    name: "Q&A・番号付け",
    description: "Q1、Q2形式で質問を番号付けした、わかりやすいレイアウト。",
    referenceUrl: "https://www.docomobs.com/career/interview/",
    features: ["Q&A形式", "番号付け", "わかりやすい"]
  },
  L06: {
    id: "L06",
    name: "採用向け・イエロー",
    description: "黄色のアクセントカラーと大きなヒーロー写真が特徴的な、採用向けレイアウト。",
    referenceUrl: "https://www.eysc.jp/recruit/new_graduate/special/interview_03/",
    features: ["採用向け", "黄色アクセント", "ヒーロー写真"]
  },
  L07: {
    id: "L07",
    name: "ソフト・ピンク",
    description: "淡いグレー背景とピンクのアクセントが特徴的な、柔らかい印象のレイアウト。",
    referenceUrl: "https://www.dentsusoken.com/saiyo/woman/interview/staff_02.html",
    features: ["柔らかい印象", "ピンクアクセント", "淡い背景"]
  },
  L08: {
    id: "L08",
    name: "バナー型・シンプル",
    description: "セクション見出しに赤い縦線付きバナーを使用した、視覚的に区切りやすいレイアウト。",
    referenceUrl: "https://www.ark-gr.co.jp/business_blog/interview-tips/",
    features: ["バナー型見出し", "視覚的区切り", "シンプル"]
  },
};

/**
 * レイアウトテンプレートIDからテンプレート情報を取得
 */
export function getLayoutTemplate(templateId: string | null | undefined): LayoutTemplate {
  if (!templateId || !layoutTemplates[templateId]) {
    // デフォルトはL01（クラシック・縦型）
    return layoutTemplates.L01;
  }
  return layoutTemplates[templateId];
}

/**
 * すべてのレイアウトテンプレートを配列で取得
 */
export function getAllLayoutTemplates(): LayoutTemplate[] {
  return Object.values(layoutTemplates);
}
