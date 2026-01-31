import { auth } from "@clerk/nextjs/server";
import { userQueries } from "@/lib/db-helpers";
import type { User } from "@/lib/types";

/**
 * Clerk IDからUserを取得する
 * Userが存在しない場合は作成する
 */
export async function getOrCreateUser(clerkId: string): Promise<User> {
  if (!clerkId) {
    throw new Error("[getOrCreateUser] clerkId is required");
  }

  try {
    // 既存のUserを検索
    let user = await userQueries.findByClerkId(clerkId);

    // Userが存在しない場合は作成
    if (!user) {
      console.log("[getOrCreateUser] User not found, creating new user for clerkId:", clerkId);
      try {
        user = await userQueries.create({
          clerkId,
          role: "user",
        });
        console.log("[getOrCreateUser] ✅ User created successfully:", user.id);
      } catch (error) {
        // より詳細なエラー情報を記録
        if (error instanceof Error) {
          // Unique constraintエラー（Webhookと同時実行で既に作成された場合）
          if (error.message.includes("Unique constraint") || error.message.includes("duplicate key")) {
            console.log("[getOrCreateUser] ⚠️ User already exists (likely created by webhook), fetching...");
            // 既に存在する場合は取得を試みる
            try {
              user = await userQueries.findByClerkId(clerkId);
              if (user) {
                console.log("[getOrCreateUser] ✅ User found after unique constraint error:", user.id);
              } else {
                console.error("[getOrCreateUser] ❌ User not found after unique constraint error");
                throw error;
              }
            } catch (fetchError) {
              console.error("[getOrCreateUser] ❌ Error fetching user after unique constraint:", fetchError);
              throw error;
            }
          } else {
            console.error("[getOrCreateUser] ❌ Error creating user:", {
              message: error.message,
              name: error.name,
              stack: error.stack,
              clerkId,
            });
            
            // テーブルが存在しない可能性
            if (error.message.includes("does not exist") || error.message.includes("relation") || error.message.includes("table")) {
              console.error("[getOrCreateUser] 💡 Database table might not exist. Please create the tables manually.");
            }
            
            // 接続エラーの可能性
            if (error.message.includes("connect") || error.message.includes("connection") || error.message.includes("timeout")) {
              console.error("[getOrCreateUser] 💡 Database connection error. Check DATABASE_URL in .env");
            }
            
            throw error;
          }
        } else {
          console.error("[getOrCreateUser] ❌ Unknown error creating user:", error);
          throw error;
        }
      }
    } else {
      console.log("[getOrCreateUser] ✅ User found:", user.id);
      // 最終ログイン日時を更新
      try {
        await userQueries.updateLastLogin(user.id);
      } catch (error) {
        console.error("[getOrCreateUser] ⚠️ Error updating lastLoginAt:", error);
        // 更新エラーは致命的ではないので続行
      }
    }

    return user;
  } catch (error) {
    // データベースエラーを再スロー
    throw error;
  }
}

/**
 * 認証されたユーザーを取得する
 */
export async function getAuthenticatedUser() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      console.log("[getAuthenticatedUser] No clerkId found (user not authenticated)");
      return null;
    }

    console.log("[getAuthenticatedUser] Clerk ID found:", clerkId);
    const user = await getOrCreateUser(clerkId);
    return user;
  } catch (error) {
    // より詳細なエラー情報を記録
    if (error instanceof Error) {
      console.error("[getAuthenticatedUser] ❌ Fatal error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    } else {
      console.error("[getAuthenticatedUser] ❌ Unknown fatal error:", error);
    }
    
    // エラーを隠さずに再スロー（呼び出し側で適切に処理できるように）
    throw error;
  }
}

/**
 * 認証されたユーザーのIDを取得する
 */
export async function getAuthenticatedUserId() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log("[getAuthenticatedUserId] No user found");
      return null;
    }
    console.log("[getAuthenticatedUserId] ✅ User ID:", user.id);
    return user.id;
  } catch (error) {
    // データベースエラーの場合はログを記録してnullを返す
    console.error("[getAuthenticatedUserId] ❌ Error getting user ID:", error);
    return null;
  }
}
