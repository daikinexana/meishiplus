import { NextResponse } from "next/server";
import { profileQueries, linkQueries } from "@/lib/db-helpers";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // プロフィールを取得（存在しない場合は作成）
    let existing = await profileQueries.findByUserId(userId);

    if (!existing) {
      // プロフィールが存在しない場合は作成
      const { generateSlug } = await import("@/lib/utils");
      let slug = generateSlug();
      let attempts = 0;
      while (await profileQueries.slugExists(slug)) {
        slug = generateSlug();
        attempts++;
        if (attempts > 10) {
          return NextResponse.json(
            { error: "Failed to generate unique slug" },
            { status: 500 }
          );
        }
      }

      existing = await profileQueries.create({
        userId,
        slug,
        isPublished: false,
      });
    }

    // 更新可能なフィールドを定義
    const updateData: {
      role?: string;
      audience?: string;
      impressionTags?: string[];
      name?: string;
      photoUrl?: string;
      headline?: string;
      tagline?: string;
      whoHelp?: string;
      situation?: string;
      reasonText?: string;
      valueText?: string;
      notFitText?: string;
      experienceTags?: string[];
      commonQuestions?: string[];
      humanText?: string;
    } = {};

    if (body.role !== undefined) updateData.role = body.role;
    if (body.audience !== undefined) updateData.audience = body.audience;
    if (body.impressionTags !== undefined)
      updateData.impressionTags = body.impressionTags;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl;
    if (body.headline !== undefined) updateData.headline = body.headline;
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.whoHelp !== undefined) updateData.whoHelp = body.whoHelp;
    if (body.situation !== undefined) updateData.situation = body.situation;
    if (body.reasonText !== undefined) updateData.reasonText = body.reasonText;
    if (body.valueText !== undefined) updateData.valueText = body.valueText;
    if (body.notFitText !== undefined) updateData.notFitText = body.notFitText;
    if (body.experienceTags !== undefined)
      updateData.experienceTags = body.experienceTags;
    if (body.commonQuestions !== undefined)
      updateData.commonQuestions = body.commonQuestions;
    if (body.humanText !== undefined) updateData.humanText = body.humanText;

    // リンクの更新（links配列が提供された場合）
    if (body.links !== undefined && Array.isArray(body.links)) {
      // 最大5件まで
      const linksToSave = body.links.slice(0, 5);
      
      // 既存のリンクを削除
      await linkQueries.deleteByPageId(existing.id);

      // 新しいリンクを作成
      for (let index = 0; index < linksToSave.length; index++) {
        const link = linksToSave[index];
        await linkQueries.create({
          pageId: existing.id,
          label: link.label,
          url: link.url,
          order: index,
        });
      }
    }

    // プロフィール更新
    const profile = await profileQueries.update(existing.id, updateData);
    
    // リンクを含めて返す
    const profileWithLinks = await profileQueries.findByUserId(userId);

    return NextResponse.json({ profile: profileWithLinks }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    );
  }
}
