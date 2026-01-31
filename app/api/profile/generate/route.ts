import { NextResponse } from "next/server";
import { profileQueries } from "@/lib/db-helpers";
import { getAuthenticatedUserId } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `あなたは編集者です。
以下の入力をもとに、営業臭や自慢を排除し、
第三者が安心して紹介できる「紹介記事形式」の文章を生成してください。

【重要ルール】
- Q&A形式で出力しない
- 見出しは疑問形にしない
- 断定・誇張表現を避ける
- 読み物として自然な日本語にする
- notFit は失礼にならない表現にする
  （期待値のズレ / 進め方の相性 / 守備範囲 のいずれか）
- 出力は必ず指定された JSON 形式のみ
- links（リンク集）は本文に混ぜない

【テーマ選択の重要ルール】
- role（役割）、audience（対象者）、impressionTags（印象タグ）を必ず考慮してテーマを選ぶ
- 常にT01を選ぶのではなく、入力内容に最も適したテーマを選ぶ
- 複数のテーマが適切な場合は、最も強くマッチするものを選ぶ
- テーマは必ずT01〜T10のいずれかを選び、理由を明確に説明する`;

const THEMES = `【テーマ一覧と選択基準】

T01: クリーン・誠実
- 特徴: 白背景、シンプル、信頼感
- 適する場合: 「誠実」「丁寧」が印象タグ、見込み顧客・既存顧客が対象、一般的なビジネス

T02: ロジカル・整然
- 特徴: インディゴ系、整理された印象、論理的
- 適する場合: 「論理的」「知的」が印象タグ、コンサルタント・エンジニア・経営層向け

T03: やわらか・親近
- 特徴: オレンジ系、温かみ、親しみやすい
- 適する場合: 「親しみ」「温かい」が印象タグ、個人向けサービス、カウンセラー・コーチ

T04: ミニマル・信頼
- 特徴: 白背景、装飾なし、極シンプル
- 適する場合: 「フラット」「クール」が印象タグ、デザイナー・アーティスト、上質感重視

T05: モダン・知的
- 特徴: スレート系、洗練された、知的
- 適する場合: 「知的」「モダン」が印象タグ、テック系、スタートアップ、投資家向け

T06: クリエイティブ
- 特徴: パープル系、創造性、個性的
- 適する場合: 「クリエイター」「デザイナー」「アーティスト」がrole、創造性重視

T07: 落ち着き・安心
- 特徴: エメラルド系、安定感、安心感
- 適する場合: 「落ち着き」「安心」が印象タグ、医療・金融・不動産、信頼重視

T08: シャープ・決断
- 特徴: ダーク系、力強い、決断力
- 適する場合: 「情熱」「決断」が印象タグ、経営者・投資家・起業家向け、強いメッセージ

T09: ストーリー重視
- 特徴: ストーン系、物語性、ナラティブ
- 適する場合: 「ストーリー」「人柄」が重要、カウンセラー・コーチ・ライター

T10: パーソナル強調
- 特徴: ローズ系、個人的、親密感
- 適する場合: 「親しみ」「温かい」が印象タグ、個人向けサービス、カウンセラー・セラピスト

【テーマ選択の例】
- role: コンサルタント、audience: 経営者、impressionTags: 論理的、知的 → T02（ロジカル・整然）
- role: カウンセラー、audience: 個人、impressionTags: 温かい、親しみ → T03（やわらか・親近）またはT10（パーソナル強調）
- role: デザイナー、audience: クリエイター、impressionTags: クリエイティブ、フラット → T06（クリエイティブ）またはT04（ミニマル・信頼）
- role: 経営者、audience: 投資家、impressionTags: 情熱、決断 → T08（シャープ・決断）
- role: 医師、audience: 患者、impressionTags: 落ち着き、安心 → T07（落ち着き・安心）`;

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // プロフィールを取得
    const profile = await profileQueries.findByUserId(userId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // 必須フィールドのチェック
    if (!profile.role || !profile.audience || !profile.impressionTags.length) {
      return NextResponse.json(
        { error: "Onboarding not completed" },
        { status: 400 }
      );
    }

    // ユーザープロンプトを構築
    const userPrompt = `【プロフィール情報（テーマ選択の重要要素）】
- role: ${profile.role}
- audience: ${profile.audience}
- impressionTags: ${profile.impressionTags.join(", ")}

【ユーザー入力（生データ）】
- name: ${profile.name || ""}
- headline: ${profile.headline || ""}
- tagline: ${profile.tagline || ""}
- whoHelp: ${profile.whoHelp || ""}
- situation: ${profile.situation || ""}
- reasonText: ${profile.reasonText || ""}
- valueText: ${profile.valueText || ""}
- notFitText: ${profile.notFitText || ""}
- experienceTags: ${profile.experienceTags.join(", ") || ""}
- commonQuestions: ${profile.commonQuestions.join(", ") || ""}
- humanText: ${profile.humanText || ""}

${THEMES}

【重要】上記のテーマ選択基準に基づいて、role、audience、impressionTagsを必ず考慮し、最も適したテーマを選んでください。常にT01を選ぶのではなく、入力内容に応じて適切なテーマ（T01〜T10）を選択してください。

以下のJSON形式で出力してください：

{
  "tone": "logical | soft | flat",
  "themeId": "T01〜T10のいずれか（必ず入力内容に基づいて選択）",
  "themeReason": "なぜこのテーマを選んだか（role、audience、impressionTagsとの関連を明記）",
  "sections": {
    "quick": {
      "body": "30秒で理解できる紹介文"
    },
    "reason": {
      "heading": "この仕事をしている理由",
      "summary": "ひとことで言うと〜",
      "body": "読み物として整えた本文"
    },
    "values": {
      "heading": "判断で大事にしていること",
      "summary": "ひとことで言うと〜",
      "body": "読み物として整えた本文"
    },
    "notFit": {
      "heading": "こんな方には向いていません",
      "summary": "ひとことで言うと〜",
      "body": "失礼にならない表現の本文"
    },
    "proof": {
      "heading": "これまで多い相談",
      "body": "experienceTags や commonQuestions を自然文に変換"
    },
    "human": {
      "heading": "最近考えていること",
      "summary": "ひとことで言うと〜",
      "body": "人柄が伝わる短文"
    }
  }
}`;

    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0]?.message?.content;
    if (!generatedContent) {
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 500 }
      );
    }

    const generatedJson = JSON.parse(generatedContent);

    // テーマIDの検証
    if (!generatedJson.themeId || !generatedJson.themeId.match(/^T(0[1-9]|10)$/)) {
      console.warn("[generate] ⚠️ Invalid themeId received:", generatedJson.themeId, "→ Using T01 as fallback");
      generatedJson.themeId = "T01";
    }

    // プロフィールを更新（テーマIDと生成されたJSONを保存）
    console.log("[generate] 📝 Input context:", {
      role: profile.role,
      audience: profile.audience,
      impressionTags: profile.impressionTags,
    });
    console.log("[generate] 🎨 Selected themeId:", generatedJson.themeId);
    console.log("[generate] 📄 Theme reason:", generatedJson.themeReason);
    console.log("[generate] 💾 Saving themeId to database...");
    
    const updatedProfile = await profileQueries.update(profile.id, {
      tone: generatedJson.tone,
      themeId: generatedJson.themeId,
      generatedJson: generatedJson,
    });

    console.log("[generate] ✅ Profile updated successfully");
    console.log("[generate] ✅ Saved themeId:", updatedProfile.themeId);
    console.log("[generate] ✅ Has generatedJson:", !!updatedProfile.generatedJson);

    return NextResponse.json(
      { profile: updatedProfile, generated: generatedJson },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
