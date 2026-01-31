import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ログイン不要のパス（パブリックアクセス可能）
const isPublicRoute = createRouteMatcher([
  "/", // トップページ
  "/:slug(.*)", // 公開プロフィールページ
  "/api/public(.*)", // 公開API
  "/api/webhooks(.*)", // Webhookエンドポイント
]);

export default clerkMiddleware(async (auth, request) => {
  // パブリックルート以外は認証が必要
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // すべてのパスを対象
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API ルートも対象
    "/(api|trpc)(.*)",
  ],
};
