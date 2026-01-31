import { redirect } from "next/navigation";
import { profileQueries } from "@/lib/db-helpers";
import { getAuthenticatedUserId } from "@/lib/auth";
import Link from "next/link";
import { CopyUrlButton } from "./components/CopyUrlButton";
import { SignOutButton } from "./components/SignOutButton";

export default async function TopPage() {
  // ユーザーIDを取得
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    // 認証されていない場合はトップページにリダイレクト
    redirect("/");
  }

  // プロフィールを取得（存在しない場合はnull）
  const profile = await profileQueries.findByUserId(userId);

  const hasProfile = !!profile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* ヘッダー */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Meishi+</h1>
            <p className="text-gray-600">あなたのプロフィールページを管理</p>
          </div>
          <SignOutButton />
        </div>

        {!hasProfile ? (
          /* プロフィール未作成の場合 */
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              プロフィールを作成しましょう
            </h2>
            <p className="mb-8 text-gray-600">
              まずは3つの質問に答えて、あなたのプロフィールを作成しましょう
            </p>
            <Link
              href="/top/mypage/onboarding"
              className="inline-block rounded-full bg-black px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-gray-800"
            >
              はじめる
            </Link>
          </div>
        ) : !profile.role || !profile.audience || profile.impressionTags.length === 0 ? (
          /* オンボーディング未完了の場合 */
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              オンボーディングを完了しましょう
            </h2>
            <p className="mb-8 text-gray-600">
              まずは3つの質問に答えてください
            </p>
            <Link
              href="/top/mypage/onboarding"
              className="inline-block rounded-full bg-black px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-gray-800"
            >
              オンボーディングを開始
            </Link>
          </div>
        ) : (
          /* プロフィール作成済みの場合 */
          <div className="space-y-6">
            {/* プロフィール状態 */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                プロフィール状態
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">公開状態</span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      profile.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {profile.isPublished ? "公開中" : "非公開"}
                  </span>
                </div>
                {profile.isPublished && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">公開URL</span>
                    <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                      /{profile.slug}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {/* アクション */}
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/top/mypage/editor"
                className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  エディター
                </h3>
                <p className="text-sm text-gray-600">
                  プロフィール情報を編集します
                </p>
              </Link>

              <Link
                href="/top/mypage/preview"
                className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  プレビュー
                </h3>
                <p className="text-sm text-gray-600">
                  公開ページのプレビューを確認します
                </p>
              </Link>
            </div>

            {/* 公開URL表示 */}
            {profile.isPublished && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  公開URL
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${profile.slug}`}
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <CopyUrlButton
                    url={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${profile.slug}`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
