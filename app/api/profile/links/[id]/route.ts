import { NextResponse } from "next/server";
import { profileQueries, linkQueries } from "@/lib/db-helpers";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // プロフィールを取得して所有権を確認
    const profile = await profileQueries.findByUserId(userId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // リンクを取得して所有権を確認
    const link = await linkQueries.findById(id);

    if (!link || link.pageId !== profile.id) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const updatedLink = await linkQueries.update(id, {
      label: body.label,
      url: body.url,
    });

    return NextResponse.json({ link: updatedLink }, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // プロフィールを取得して所有権を確認
    const profile = await profileQueries.findByUserId(userId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // リンクを取得して所有権を確認
    const link = await linkQueries.findById(id);

    if (!link || link.pageId !== profile.id) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await linkQueries.delete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
