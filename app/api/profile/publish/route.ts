import { NextResponse } from "next/server";
import { profileQueries } from "@/lib/db-helpers";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const isPublished = body.isPublished ?? true;

    // プロフィールを取得
    const profile = await profileQueries.findByUserId(userId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // 公開する場合は、生成済みかチェック
    if (isPublished && !profile.generatedJson) {
      return NextResponse.json(
        { error: "Profile must be generated before publishing" },
        { status: 400 }
      );
    }

    // 公開状態を更新
    const updatedProfile = await profileQueries.update(profile.id, {
      isPublished,
    });

    return NextResponse.json({ profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Error publishing profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
