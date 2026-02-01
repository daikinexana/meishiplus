import { redirect } from "next/navigation";
import { profileQueries } from "@/lib/db-helpers";
import { getAuthenticatedUserId } from "@/lib/auth";
import Link from "next/link";
import { CopyUrlButton } from "./components/CopyUrlButton";
import { SignOutButton } from "./components/SignOutButton";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
          {/* ヘッダー */}
          <div className="mb-12 sm:mb-16">
            <div className="mb-4 inline-block">
              <h1 className="text-5xl font-light tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
                My Page
              </h1>
              <div className="mt-2 h-0.5 w-full bg-gradient-to-r from-gray-900 via-gray-700 to-transparent"></div>
            </div>
            <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
              プロフィールを作成・管理して、<br className="sm:hidden" />
              あなたの紹介ページを公開しましょう
            </p>
          </div>

        {!hasProfile ? (
          /* プロフィール未作成の場合 */
          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 text-center shadow-lg shadow-gray-200/50 transition-all hover:shadow-xl hover:shadow-gray-300/50 sm:p-12 md:p-16">
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 sm:h-24 sm:w-24">
              <svg className="h-10 w-10 sm:h-12 sm:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="mb-4 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              はじめましょう
            </h2>
            <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
              3つの簡単な質問に答えるだけで、<br className="sm:hidden" />
              AIがあなたのプロフィールを自動生成します
            </p>
            <div className="mx-auto mb-10 max-w-md space-y-4 text-left">
              <div className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 transition-all hover:from-blue-50 hover:to-blue-50/50">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/30">1</span>
                <span className="pt-1 text-sm leading-relaxed text-gray-700 sm:text-base">あなたの役割・専門分野を教えてください</span>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 transition-all hover:from-blue-50 hover:to-blue-50/50">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/30">2</span>
                <span className="pt-1 text-sm leading-relaxed text-gray-700 sm:text-base">誰に向けてプロフィールを作成しますか？</span>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 transition-all hover:from-blue-50 hover:to-blue-50/50">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/30">3</span>
                <span className="pt-1 text-sm leading-relaxed text-gray-700 sm:text-base">どんな印象を与えたいですか？（タグ選択）</span>
              </div>
            </div>
            <Link
              href="/top/mypage/onboarding"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-4 text-base font-medium text-white shadow-lg shadow-gray-900/30 transition-all hover:scale-105 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl hover:shadow-gray-900/40 active:scale-95 sm:px-10 sm:py-4 sm:text-lg"
            >
              <span>はじめる</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : !profile.role || !profile.audience || profile.impressionTags.length === 0 ? (
          /* オンボーディング未完了の場合 */
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-amber-50/40 backdrop-blur-sm p-8 text-center shadow-lg shadow-amber-200/30 transition-all hover:shadow-xl hover:shadow-amber-300/40 sm:p-12 md:p-16">
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40 sm:h-24 sm:w-24">
              <svg className="h-10 w-10 sm:h-12 sm:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mb-4 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              もう少しで完了です
            </h2>
            <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
              3つの質問に答えると、プロフィール作成に進めます
            </p>
            <div className="mx-auto mb-10 max-w-md space-y-4 text-left">
              <div className={`flex items-start gap-4 rounded-xl p-4 transition-all ${
                profile.role 
                  ? "bg-gradient-to-r from-green-50/50 to-green-50/30" 
                  : "bg-gradient-to-r from-gray-50/50 to-gray-50/30"
              }`}>
                {profile.role ? (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-sm font-semibold text-white shadow-md shadow-green-500/30">✓</span>
                ) : (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-sm font-semibold text-gray-400">1</span>
                )}
                <span className={`pt-1 text-sm leading-relaxed sm:text-base ${profile.role ? "text-gray-500 line-through" : "text-gray-700"}`}>あなたの役割・専門分野</span>
              </div>
              <div className={`flex items-start gap-4 rounded-xl p-4 transition-all ${
                profile.audience 
                  ? "bg-gradient-to-r from-green-50/50 to-green-50/30" 
                  : "bg-gradient-to-r from-gray-50/50 to-gray-50/30"
              }`}>
                {profile.audience ? (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-sm font-semibold text-white shadow-md shadow-green-500/30">✓</span>
                ) : (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-sm font-semibold text-gray-400">2</span>
                )}
                <span className={`pt-1 text-sm leading-relaxed sm:text-base ${profile.audience ? "text-gray-500 line-through" : "text-gray-700"}`}>誰に向けてプロフィールを作成しますか？</span>
              </div>
              <div className={`flex items-start gap-4 rounded-xl p-4 transition-all ${
                profile.impressionTags && profile.impressionTags.length > 0
                  ? "bg-gradient-to-r from-green-50/50 to-green-50/30" 
                  : "bg-gradient-to-r from-gray-50/50 to-gray-50/30"
              }`}>
                {profile.impressionTags && profile.impressionTags.length > 0 ? (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-sm font-semibold text-white shadow-md shadow-green-500/30">✓</span>
                ) : (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-sm font-semibold text-gray-400">3</span>
                )}
                <span className={`pt-1 text-sm leading-relaxed sm:text-base ${profile.impressionTags && profile.impressionTags.length > 0 ? "text-gray-500 line-through" : "text-gray-700"}`}>どんな印象を与えたいですか？</span>
              </div>
            </div>
            <Link
              href="/top/mypage/onboarding"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-4 text-base font-medium text-white shadow-lg shadow-gray-900/30 transition-all hover:scale-105 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl hover:shadow-gray-900/40 active:scale-95 sm:px-10 sm:py-4 sm:text-lg"
            >
              <span>続ける</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          /* プロフィール作成済みの場合 */
          <div className="space-y-6 sm:space-y-8">
            {/* 使い方ガイド */}
            <div className="rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-sm p-6 shadow-md shadow-gray-200/20 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm sm:h-14 sm:w-14">
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">使い方</h3>
              </div>
              <ol className="space-y-3.5 text-sm leading-relaxed text-gray-700 sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 font-semibold text-gray-900">1.</span>
                  <span className="flex-1">「AIでMeishi+プロフィールを作成/更新」から、簡単な質問に答えてプロフィール情報を入力</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 font-semibold text-gray-900">2.</span>
                  <span className="flex-1">「プレビュー」でAIが生成したプロフィールを確認</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 font-semibold text-gray-900">3.</span>
                  <span className="flex-1">問題なければ「公開」して、URLを共有</span>
                </li>
              </ol>
            </div>

            {/* プロフィール状態 */}
            <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-md shadow-gray-200/30 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 sm:text-base">公開状態</span>
                <span
                  className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all ${
                    profile.isPublished
                      ? "bg-gradient-to-r from-green-50 to-green-50/80 text-green-700 ring-1 ring-green-200/50"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {profile.isPublished ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                      </span>
                      公開中
                    </>
                  ) : (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
                      非公開
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* アクション */}
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-6">
              <Link
                href="/top/mypage/editor"
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-gray-200/20 transition-all hover:-translate-y-1.5 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-300/30 active:scale-[0.98] sm:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/0 to-gray-50/0 transition-all group-hover:from-gray-50/30 group-hover:to-gray-50/10"></div>
                <div className="relative">
                  <div className="mb-5 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-xs font-bold text-white shadow-md shadow-gray-900/30">1</span>
                    <span className="text-xs font-semibold text-gray-700">ステップ1</span>
                  </div>
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 shadow-md shadow-gray-200/30 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gray-300/40 sm:h-20 sm:w-20">
                    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-light tracking-tight text-gray-900 sm:text-2xl">
                    AIでMeishi+プロフィールを作成/更新
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
                    簡単な質問に答えるだけで、AIが魅力的なプロフィールを自動生成します。完璧な文章は不要です。
                  </p>
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 transition-colors group-hover:text-gray-700 sm:text-base">
                    <span>作成/更新する</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              <Link
                href="/top/mypage/preview"
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-gray-200/20 transition-all hover:-translate-y-1.5 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-300/30 active:scale-[0.98] sm:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/0 to-gray-50/0 transition-all group-hover:from-gray-50/30 group-hover:to-gray-50/10"></div>
                <div className="relative">
                  <div className="mb-5 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-xs font-bold text-white shadow-md shadow-gray-900/30">2</span>
                    <span className="text-xs font-semibold text-gray-700">ステップ2</span>
                  </div>
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 shadow-md shadow-gray-200/30 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gray-300/40 sm:h-20 sm:w-20">
                    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-light tracking-tight text-gray-900 sm:text-2xl">
                    プレビュー・公開
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
                    AIが生成したプロフィールを確認して、問題なければ公開しましょう。公開後はURLを共有できます。
                  </p>
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 transition-colors group-hover:text-gray-700 sm:text-base">
                    <span>確認する</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* 公開URL表示 */}
            {profile.isPublished && (
              <div className="rounded-2xl border border-gray-200/60 bg-gradient-to-br from-gray-50/80 via-white/80 to-gray-50/60 backdrop-blur-sm p-6 shadow-lg shadow-gray-200/30 transition-all hover:shadow-xl hover:shadow-gray-300/40 sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/30 transition-all hover:scale-105 sm:h-16 sm:w-16">
                    <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                      公開URL
                    </h3>
                    <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
                      このURLをコピーして共有できます
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${profile.slug}`}
                    className="flex-1 rounded-xl border border-gray-200/60 bg-white/80 px-4 py-3.5 text-sm font-mono text-gray-800 ring-1 ring-gray-200/50 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-300/50 sm:py-4 sm:text-base"
                  />
                  <CopyUrlButton
                    url={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${profile.slug}`}
                  />
                </div>
              </div>
            )}
          </div>
        )}

          {/* ログアウトボタン */}
          <div className="mt-12 flex justify-center border-t border-gray-200 pt-8 sm:mt-16 sm:pt-10">
            <SignOutButton />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
