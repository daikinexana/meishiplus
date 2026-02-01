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
- headline（見出し）とtagline（タグライン）は、ユーザーが入力した内容を基に、
  紹介記事として魅力的で自然な表現に変換してください
  （単にそのまま使うのではなく、営業臭を排除し、第三者が安心して紹介できる表現に）`;

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
    const userPrompt = `【プロフィール情報】
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

以下のJSON形式で出力してください：

{
  "tone": "logical | soft | flat",
  "headline": "ユーザーが入力したheadlineを、紹介記事として魅力的で自然な表現に変換したもの（元のheadlineが空の場合は、roleや入力内容から適切に生成）",
  "tagline": "ユーザーが入力したtaglineを、紹介記事として魅力的で自然な表現に変換したもの（元のtaglineが空の場合は、入力内容から適切に生成）",
  "sections": {
    "quick": {
      "body": "30秒で理解できる紹介文"
    },
    "reason": {
      "heading": "今の仕事をしている理由",
      "summary": "ひとことで言うと〜",
      "body": "読み物として整えた本文"
    },
    "values": {
      "heading": "仕事で大切にしている判断基準",
      "summary": "ひとことで言うと〜",
      "body": "読み物として整えた本文"
    },
    "notFit": {
      "heading": "こういったお客様は、お断りしています",
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
}

【重要】tone（トーン）の決定について：
- impressionTags（選ばれた印象タグ）に基づいて、適切なtoneを決定してください
- toneの決定ルール：
  * "logical"（論理的）：以下のタグが含まれる場合 → 「誠実」「論理的」「知的」「丁寧」
  * "soft"（柔らかい）：以下のタグが含まれる場合 → 「温かい」「親しみ」「落ち着き」「情熱」
  * "flat"（フラット）：以下のタグが含まれる場合 → 「フラット」「クール」
- 複数のタグが選ばれている場合は、最も多く該当するカテゴリを優先してください
- 同数の場合は、より具体的な印象（logical > soft > flat の順）を優先してください
- 選ばれたtoneに合わせて、文章全体のトーンや表現を調整してください：
  * "logical"の場合：論理的で整理された表現、データや根拠を重視した文章
  * "soft"の場合：温かみがあり親しみやすい表現、感情や想いを大切にした文章
  * "flat"の場合：シンプルでクールな表現、余計な装飾を避けた文章

【重要】headlineとtaglineについて：
- ユーザーが入力したheadlineやtaglineがある場合は、それを基に紹介記事として魅力的で自然な表現に変換してください
- 単にそのまま使うのではなく、営業臭を排除し、第三者が安心して紹介できる表現にしてください
- 元のheadlineやtaglineが空の場合は、roleや入力内容から適切に生成してください
- headlineは職業や肩書きを自然に表現したものにしてください
- taglineは特に重要です。価値観や想いを一言で表現した、キャッチーで印象に残るフレーズにしてください
  - 短く、力強いメッセージが理想的です（10〜20文字程度）
  - 読んだ人が「この人のことが知りたい」と思えるような表現にしてください
  - 営業臭や自慢ではなく、誠実さや想いが伝わる表現にしてください
  - 例：「デザインで事業を成長させる」「経営課題を解決するパートナー」「理想の住まいを見つけるお手伝い」`;

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

    // プロフィールを更新（生成されたJSONを保存）
    console.log("[generate] 📝 Input context:", {
      role: profile.role,
      audience: profile.audience,
      impressionTags: profile.impressionTags,
    });
    console.log("[generate] 💾 Saving generated content to database...");
    
    const updatedProfile = await profileQueries.update(profile.id, {
      tone: generatedJson.tone,
      generatedJson: generatedJson,
    });

    console.log("[generate] ✅ Profile updated successfully");
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
