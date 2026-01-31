import { NextResponse } from "next/server";
import { profileQueries, linkQueries } from "@/lib/db-helpers";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await profileQueries.findByUserId(userId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { label, url } = body;

    if (!label || !url) {
      return NextResponse.json(
        { error: "Label and URL are required" },
        { status: 400 }
      );
    }

    // 既存のリンク数を確認（最大5）
    const existingLinks = await linkQueries.countByPageId(profile.id);

    if (existingLinks >= 5) {
      return NextResponse.json(
        { error: "Maximum 5 links allowed" },
        { status: 400 }
      );
    }

    const link = await linkQueries.create({
      pageId: profile.id,
      label,
      url,
      order: existingLinks,
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
