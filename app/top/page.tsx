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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
        {/* ヘッダー */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div className="animate-fade-in-up">
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Meishi+
              </span>
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              あなたのプロフィールページを管理
            </p>
          </div>
          <div className="flex-shrink-0">
            <SignOutButton />
          </div>
        </div>

        {!hasProfile ? (
          /* プロフィール未作成の場合 */
          <div className="card-hover animate-scale-in mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-12 md:p-16">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg sm:h-20 sm:w-20">
              <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              プロフィールを作成しましょう
            </h2>
            <p className="mx-auto mb-8 max-w-md text-base text-gray-600 sm:text-lg">
              まずは3つの質問に答えて、<br className="sm:hidden" />
              あなたのプロフィールを作成しましょう
            </p>
            <Link
              href="/top/mypage/onboarding"
              className="btn-primary group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:px-10 sm:py-4 sm:text-lg"
            >
              <span>はじめる</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : !profile.role || !profile.audience || profile.impressionTags.length === 0 ? (
          /* オンボーディング未完了の場合 */
          <div className="card-hover animate-scale-in mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-12 md:p-16">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg sm:h-20 sm:w-20">
              <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              オンボーディングを完了しましょう
            </h2>
            <p className="mx-auto mb-8 max-w-md text-base text-gray-600 sm:text-lg">
              まずは3つの質問に答えてください
            </p>
            <Link
              href="/top/mypage/onboarding"
              className="btn-primary group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:px-10 sm:py-4 sm:text-lg"
            >
              <span>オンボーディングを開始</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          /* プロフィール作成済みの場合 */
          <div className="space-y-6 sm:space-y-8">
            {/* プロフィール状態 */}
            <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg sm:h-12 sm:w-12">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  プロフィール状態
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-gray-700 sm:text-base">公開状態</span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                      profile.isPublished
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {profile.isPublished ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        公開中
                      </>
                    ) : (
                      "非公開"
                    )}
                  </span>
                </div>
                {profile.isPublished && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-medium text-gray-700 sm:text-base">公開URL</span>
                    <code className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-mono text-gray-800 sm:px-4">
                      /{profile.slug}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {/* アクション */}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <Link
                href="/top/mypage/editor"
                className="card-hover group animate-fade-in-up rounded-2xl bg-white p-6 shadow-md transition-all duration-300 sm:p-8"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
                  エディター
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  プロフィール情報を編集します
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 sm:text-base">
                  <span>編集する</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/top/mypage/preview"
                className="card-hover group animate-fade-in-up rounded-2xl bg-white p-6 shadow-md transition-all duration-300 sm:p-8"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
                  プレビュー
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  公開ページのプレビューを確認します
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-600 sm:text-base">
                  <span>確認する</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* 公開URL表示 */}
            {profile.isPublished && (
              <div className="card-hover animate-fade-in-up rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 p-6 shadow-md sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg sm:h-12 sm:w-12">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                    公開URL
                  </h3>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${profile.slug}`}
                    className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-mono text-gray-800 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-base"
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
