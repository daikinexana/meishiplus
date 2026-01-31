import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meishi+｜名刺以上、Web未満の個人紹介ページ",
  description:
    "Meishi+（メイシプラス）は、名刺以上Web未満の個人紹介ページを10分で作れるサービスです。第三者が安心して紹介できるプロフィールを簡単に作成できます。",
  keywords: [
    "名刺以上Web未満",
    "自己紹介 ページ",
    "プロフィール 作成",
    "フリーランス プロフィール",
    "個人事業主 名刺",
    "紹介用 プロフィール",
    "Meishi+",
  ],
  openGraph: {
    title: "Meishi+｜名刺以上、Web未満。",
    description: "第三者が安心して渡せる、1ページの個人紹介を10分で。",
    url: "https://meishi.plus",
    siteName: "Meishi+",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Meishi+ 名刺以上、Web未満",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

export default async function Home() {
  const { userId } = await auth();
  
  // ログイン済みの場合は/topにリダイレクト
  if (userId) {
    redirect("/top");
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Meishi+",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "名刺以上、Web未満の個人紹介ページを作成できるサービス",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section - モバイルファースト */}
        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24 lg:py-32">
          {/* 背景装飾 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative text-center animate-fade-in-up">
            {/* バッジ */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-1.5 text-sm font-medium text-purple-700 sm:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>10分で完成</span>
            </div>

            {/* メインタイトル */}
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Meishi+</span>
              <span className="block mt-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                名刺以上、Web未満。
              </span>
            </h1>

            {/* サブタイトル */}
            <p className="mx-auto mb-6 max-w-2xl text-lg font-medium text-gray-700 sm:mb-8 sm:text-xl md:text-2xl">
              第三者が安心して渡せる、<br className="sm:hidden" />
              あなたの紹介ページを10分で。
            </p>

            {/* 説明文 */}
            <p className="mx-auto mb-8 max-w-xl text-sm text-gray-600 sm:mb-12 sm:text-base md:text-lg">
              名刺だけでは足りない。<br className="sm:hidden" />
              でも、ホームページほど重くしたくない人へ。
            </p>

            {/* CTAボタン群 */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <SignUpButton mode="modal" fallbackRedirectUrl="/top">
                <button className="btn-primary group relative w-full max-w-xs overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto sm:px-10 sm:py-4 sm:text-lg">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>無料で作ってみる</span>
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </SignUpButton>
              
              <SignInButton mode="modal" fallbackRedirectUrl="/top">
                <button className="w-full max-w-xs rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:w-auto sm:px-10 sm:py-4 sm:text-lg">
                  ログイン
                </button>
              </SignInButton>
            </div>

            {/* サンプルリンク */}
            <div className="mt-6 sm:mt-8">
              <Link
                href="#sample"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-purple-600 sm:text-base"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                サンプルを見る
              </Link>
            </div>
          </div>
        </section>

        {/* サンプルセクション */}
        <section id="sample" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-4">
              完成イメージ
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
              実際に作成されたページのイメージです
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="card-hover overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 sm:p-8 md:p-12">
                <div className="mx-auto max-w-2xl">
                  <div className="mb-6 flex items-center gap-4 sm:mb-8">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 sm:h-20 sm:w-20"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">山田 太郎</h3>
                      <p className="text-sm text-gray-600 sm:text-base">フリーランスコンサルタント</p>
                    </div>
                  </div>
                  <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                    経営課題の解決をサポートするコンサルタントとして、10年以上の実績があります。
                    特に、スタートアップの成長支援と組織開発を専門としています。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 sm:text-sm">経営コンサル</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 sm:text-sm">組織開発</span>
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 sm:text-sm">スタートアップ支援</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                なぜMeishi+なのか
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
              信頼を築くための、新しい自己紹介の形
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {/* 特徴カード1 */}
            <div className="card-hover group rounded-2xl bg-white p-6 shadow-md sm:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg sm:h-14 sm:w-14">
                <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl">10分で完成</h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                質問に答えるだけで、AIが自動で紹介ページを生成。複雑な設定は一切不要です。
              </p>
            </div>

            {/* 特徴カード2 */}
            <div className="card-hover group rounded-2xl bg-white p-6 shadow-md sm:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg sm:h-14 sm:w-14">
                <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl">営業臭ゼロ</h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                誇張や断定を避け、第三者が安心して紹介できる信頼性の高いプロフィールを生成します。
              </p>
            </div>

            {/* 特徴カード3 */}
            <div className="card-hover group rounded-2xl bg-white p-6 shadow-md sm:p-8 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg sm:h-14 sm:w-14">
                <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl">人となりを伝える</h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                名刺では伝えきれない、あなたの価値観や考え方をしっかりと表現できます。
              </p>
            </div>
          </div>
        </section>

        {/* SEO用本文（DOMに存在させる） */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <div className="prose prose-lg mx-auto max-w-3xl text-gray-700">
            <p className="text-base leading-relaxed sm:text-lg">
              Meishi+（メイシプラス）は、名刺以上、Web未満の個人紹介ページを作成できるサービスです。
            </p>
            <p className="text-base leading-relaxed sm:text-lg">
              個人事業主、フリーランス、不動産エージェント、保険営業、スタートアップ経営者、VC、コンサルタントなど、
              「人」で信頼される仕事をしている方に向いています。
            </p>
            <p className="text-base leading-relaxed sm:text-lg">
              質問に答えるだけで、第三者目線のインタビュー形式をもとに、営業臭のない紹介ページを自動生成します。
            </p>
            <p className="text-base leading-relaxed sm:text-lg">
              ホームページほど重くなく、名刺より多くの情報を伝えられる、新しい自己紹介の形です。
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-4">
              よくある質問
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
              気になる点があれば、お気軽にお問い合わせください
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
            <div className="card-hover rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                Meishi+ とは何ですか？
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                Meishi+（メイシプラス）は、名刺以上、Web未満の個人紹介ページを作成できるサービスです。
                第三者が安心して紹介できる1ページを、質問に答えるだけで作れます。
              </p>
            </div>

            <div className="card-hover rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                ホームページやLPとは何が違いますか？
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                ホームページほど情報が重くなく、名刺よりもしっかりと人となりや考えを伝えられるのが特徴です。
                営業や集客を目的としたLPではありません。
              </p>
            </div>

            <div className="card-hover rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                どんな人に向いていますか？
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                個人事業主、フリーランス、不動産エージェント、保険営業、スタートアップ経営者、VC、コンサルタントなど、
                「人」で信頼される仕事をしている方に向いています。
              </p>
            </div>

            <div className="card-hover rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                自分で文章を書く必要はありますか？
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                箇条書きや話し言葉で大丈夫です。入力内容をもとに、Meishi+
                が紹介用の文章に自動で整えます。
              </p>
            </div>

            <div className="card-hover rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                営業っぽくなりませんか？
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                営業臭や自慢表現を抑える設計になっています。「向いていない人」も正直に書くことで、信頼性を高めています。
              </p>
            </div>

            <div className="card-hover rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                無料で使えますか？
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                MVP段階では無料でご利用いただけます。今後、より高品質なAI生成などを有料プランとして提供する可能性があります。
              </p>
            </div>

            <div className="card-hover rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                作ったページは検索エンジンに表示されますか？
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                はい。公開設定にしたページは、Googleなどの検索エンジンに表示されるよう設計されています。
              </p>
            </div>

            <div className="card-hover rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                名刺やSNSとどう使い分ければいいですか？
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                名刺やSNSの「次の一枚」として使うのがおすすめです。紹介や初対面の場面で、URLやQRを渡すだけで説明が完結します。
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
