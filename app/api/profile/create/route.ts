import { NextResponse } from "next/server";
import { profileQueries } from "@/lib/db-helpers";
import { generateSlug } from "@/lib/utils";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 既存のプロフィールをチェック
    const existing = await profileQueries.findByUserId(userId);

    if (existing) {
      return NextResponse.json(
        { error: "Profile already exists", profileId: existing.id },
        { status: 400 }
      );
    }

    // slugを生成（衝突時は再生成）
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

    // プロフィール作成
    const profile = await profileQueries.create({
      userId,
      slug,
      isPublished: false,
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
