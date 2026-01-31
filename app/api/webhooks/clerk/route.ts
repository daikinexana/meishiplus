import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { userQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Clerk Webhookのシークレットキーを取得
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  // ヘッダーを取得
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // ヘッダーがない場合はエラー
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // リクエストボディを取得
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Webhookの検証
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Webhookの署名を検証
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // イベントタイプに応じて処理
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses } = evt.data;

    try {
      // Userテーブルにレコードを作成
      await userQueries.create({
        clerkId: id,
        email: email_addresses?.[0]?.email_address || null,
        role: "user",
      });

      console.log(`User created: ${id}`);
    } catch (error) {
      console.error("Error creating user:", error);
      // 既に存在する場合はスキップ（エラーを無視）
      if (
        error instanceof Error &&
        (error.message.includes("Unique constraint") || error.message.includes("duplicate key"))
      ) {
        console.log(`User already exists: ${id}`);
      } else {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses } = evt.data;

    try {
      // Userテーブルを更新
      await userQueries.update(id, {
        email: email_addresses?.[0]?.email_address || null,
      });

      console.log(`User updated: ${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      // ユーザーが存在しない場合は作成
      if (
        error instanceof Error &&
        (error.message.includes("Record to update does not exist") ||
          error.message.includes("does not exist") ||
          error.message.includes("Unique constraint"))
      ) {
        try {
          await userQueries.create({
            clerkId: id,
            email: email_addresses?.[0]?.email_address || null,
            role: "user",
          });
          console.log(`User created after update attempt: ${id}`);
        } catch (createError) {
          console.error("Error creating user after update:", createError);
        }
      }
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Userテーブルから削除（CASCADEでProfilePageも削除される）
      await userQueries.delete(id);

      console.log(`User deleted: ${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      // 既に削除されている場合はスキップ
    }
  }

  return NextResponse.json({ received: true });
}
