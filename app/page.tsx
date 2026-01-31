import { SignUpButton } from "@clerk/nextjs";
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
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Meishi+
          </h1>
          <p className="mb-4 text-2xl font-semibold text-gray-800 sm:text-3xl">
            名刺以上、Web未満。
          </p>
          <p className="mb-8 text-lg text-gray-600 sm:text-xl">
            第三者が安心して渡せる、あなたの紹介ページを10分で。
          </p>
          <p className="mb-12 text-base text-gray-500 sm:text-lg">
            名刺だけでは足りない。でも、ホームページほど重くしたくない人へ。
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <button className="rounded-full bg-black px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-gray-800">
                無料で作ってみる
              </button>
            </SignUpButton>
            <Link
              href="#sample"
              className="rounded-full border border-gray-300 px-8 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              サンプルを見る
            </Link>
          </div>
        </section>

        {/* SEO用本文（DOMに存在させる） */}
        <section className="mx-auto max-w-4xl px-6 pb-24">
          <div className="prose prose-lg mx-auto max-w-3xl text-gray-700">
            <p>
              Meishi+（メイシプラス）は、名刺以上、Web未満の個人紹介ページを作成できるサービスです。
            </p>
            <p>
              個人事業主、フリーランス、不動産エージェント、保険営業、スタートアップ経営者、VC、コンサルタントなど、
              「人」で信頼される仕事をしている方に向いています。
            </p>
            <p>
              質問に答えるだけで、第三者目線のインタビュー形式をもとに、営業臭のない紹介ページを自動生成します。
            </p>
            <p>
              ホームページほど重くなく、名刺より多くの情報を伝えられる、新しい自己紹介の形です。
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mx-auto max-w-4xl px-6 pb-24">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            よくある質問（FAQ）
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Meishi+ とは何ですか？
              </h3>
              <p className="text-gray-700">
                Meishi+（メイシプラス）は、名刺以上、Web未満の個人紹介ページを作成できるサービスです。
                第三者が安心して紹介できる1ページを、質問に答えるだけで作れます。
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                ホームページやLPとは何が違いますか？
              </h3>
              <p className="text-gray-700">
                ホームページほど情報が重くなく、名刺よりもしっかりと人となりや考えを伝えられるのが特徴です。
                営業や集客を目的としたLPではありません。
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                どんな人に向いていますか？
              </h3>
              <p className="text-gray-700">
                個人事業主、フリーランス、不動産エージェント、保険営業、スタートアップ経営者、VC、コンサルタントなど、
                「人」で信頼される仕事をしている方に向いています。
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                自分で文章を書く必要はありますか？
              </h3>
              <p className="text-gray-700">
                箇条書きや話し言葉で大丈夫です。入力内容をもとに、Meishi+
                が紹介用の文章に自動で整えます。
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                営業っぽくなりませんか？
              </h3>
              <p className="text-gray-700">
                営業臭や自慢表現を抑える設計になっています。「向いていない人」も正直に書くことで、信頼性を高めています。
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                無料で使えますか？
              </h3>
              <p className="text-gray-700">
                MVP段階では無料でご利用いただけます。今後、より高品質なAI生成などを有料プランとして提供する可能性があります。
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                作ったページは検索エンジンに表示されますか？
              </h3>
              <p className="text-gray-700">
                はい。公開設定にしたページは、Googleなどの検索エンジンに表示されるよう設計されています。
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                名刺やSNSとどう使い分ければいいですか？
              </h3>
              <p className="text-gray-700">
                名刺やSNSの「次の一枚」として使うのがおすすめです。紹介や初対面の場面で、URLやQRを渡すだけで説明が完結します。
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
