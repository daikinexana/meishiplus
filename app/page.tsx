import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LayoutTemplates } from "./[slug]/components/LayoutTemplates";

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
      <Header />
      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* Hero Section - Studio.design風 */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-24 md:px-8 md:py-32 lg:py-40">
          <div className="text-center">
            {/* メインタイトル */}
            <h1 className="mb-6 text-3xl font-light leading-tight tracking-tight text-gray-900 sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-7xl lg:leading-tight xl:text-8xl xl:leading-tight">
              <span className="block whitespace-nowrap">あなたの理想の紹介ページを</span>
              <span className="block mt-1 whitespace-nowrap sm:mt-2">最速で公開。</span>
          </h1>

            {/* キャッチフレーズ */}
            <p className="mb-8 text-base font-light text-gray-600 sm:mb-10 sm:text-lg md:mb-12 md:text-xl lg:text-2xl">
            名刺以上、Web未満。
          </p>

            {/* CTAボタン */}
            <div className="mt-8 sm:mt-10 md:mt-12">
            <SignUpButton mode="modal" fallbackRedirectUrl="/top">
                <button className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4 md:text-lg">
                  <span>無料でMeishi+をはじめる</span>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
              </button>
            </SignUpButton>
            </div>
          </div>
        </section>

        {/* サンプルセクション */}
        <section id="sample" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-24 md:px-8 md:py-32">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl font-light text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
              完成イメージ
            </h2>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {/* L02テンプレートのプレビュー */}
              <div className="max-h-[800px] overflow-y-auto">
                <LayoutTemplates
                  profile={{
                    name: "山田 太郎",
                    photoUrl: "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/868/large/df159e84-be91-4b3c-8ce5-2604de5f15ca.jpg?1684817396",
                    photoUrls: [
                      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/868/large/df159e84-be91-4b3c-8ce5-2604de5f15ca.jpg?1684817396",
                      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/876/large/949d68a9-059b-4060-bb83-dd9f295049c7.jpg?1684818134",
                      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/891/large/9cb3646f-3ef2-4877-8de0-96a693750d2c.jpg?1684818791",
                      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/896/large/b2167f70-5777-4552-ba6b-f3adbc838dfd.jpg?1684819105",
                      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/875/large/d4ace765-1ff0-4d2f-a8a9-2254bbca6f00.jpg?1684817646",
                    ],
                    headline: "ビジネスコンサルタント",
                    tagline: "経営課題を解決するパートナーとして、企業の成長を支援しています",
                    links: [
                      { label: "公式サイト", url: "https://example.com" },
                      { label: "LinkedIn", url: "https://linkedin.com/in/example" },
                      { label: "Twitter", url: "https://twitter.com/example" },
                    ],
                    layoutTemplateId: "L02",
                  }}
                  generatedJson={{
                    tone: "logical",
                    headline: "ビジネスコンサルタント",
                    tagline: "経営課題を解決するパートナーとして、企業の成長を支援しています",
                    sections: {
                      quick: {
                        body: "10年以上のコンサルティング経験を持ち、主に中小企業の経営課題解決をサポートしています。特にマーケティング戦略と組織改革に強みがあり、これまでに100社以上の企業成長を支援してきました。",
                      },
                      reason: {
                        heading: "今の仕事をしている理由",
                        summary: "企業の成長を通じて、社会に貢献したいという想いから",
                        body: "大学卒業後、大手コンサルティングファームで働いていましたが、中小企業の経営課題に直接関わりたいという想いが強くなり、独立しました。\n\n特に、優れた技術やサービスを持ちながら、マーケティングや組織運営で苦労している企業を支援したいと考えています。企業が成長することで、従業員の生活が豊かになり、地域経済にも良い影響を与えられると信じています。\n\nこれまでに支援した企業の多くが、売上を2倍、3倍に伸ばし、従業員の満足度も向上させてきました。そのような成果を目の当たりにすると、この仕事を選んで本当に良かったと感じます。",
                      },
                      values: {
                        heading: "仕事で大切にしている判断基準",
                        summary: "長期的な視点と、クライアントの本質的な課題解決",
                        body: "短期的な成果を追うのではなく、クライアント企業が長期的に持続可能な成長を実現できるよう、本質的な課題解決に取り組んでいます。\n\n例えば、売上が伸び悩んでいる企業に対して、単に広告予算を増やすのではなく、ターゲット顧客の明確化や、商品・サービスの差別化戦略から見直すことが重要だと考えています。\n\nまた、組織改革においても、表面的な制度変更ではなく、企業文化やコミュニケーションの質を改善することで、真の変革を実現します。",
                      },
                      notFit: {
                        heading: "こういったお客様は、お断りしています",
                        summary: "短期的な成果のみを求める方、根本的な課題解決に取り組む意思がない方",
                        body: "コンサルティングは、クライアント企業の経営陣や従業員の協力なしには成果を出せません。\n\n例えば、「3ヶ月で売上を2倍にしてください」という依頼でも、商品開発や組織改革など、時間のかかる取り組みが必要な場合があります。そのような場合、短期的な成果のみを求め、根本的な課題解決に取り組む意思がないクライアントとは、残念ながらお断りさせていただくことがあります。\n\nまた、コンサルタントに全てを任せきりで、自社での取り組みを避けるような場合も、長期的な成果は期待できません。",
                      },
                      proof: {
                        heading: "これまで多い相談",
                        body: "・マーケティング戦略の立案と実行支援（50社以上）\n・組織改革と人材育成（30社以上）\n・新規事業開発の支援（20社以上）\n\n「売上が伸び悩んでいるが、何から手をつけていいかわからない」\n「優秀な人材が育たず、組織が機能していない」\n「新規事業を立ち上げたいが、どう進めればいいかわからない」\n\nなどの相談を多く受けています。",
                      },
                      human: {
                        heading: "最近考えていること",
                        summary: "クライアント企業の成長を通じて、より良い社会を作りたい",
                        body: "最近、特に感じているのは、企業の成長が単なる数値の向上ではなく、従業員の生活の質向上や、地域社会への貢献につながるということです。\n\n支援した企業の従業員から「この会社で働けて良かった」という声を聞くと、とても嬉しく感じます。また、企業が成長することで、地域経済が活性化し、新しい雇用が生まれることもあります。\n\n今後も、クライアント企業の本質的な課題解決に取り組み、企業の成長を通じて、より良い社会を作っていきたいと考えています。",
                      },
                    },
                  }}
                  slug="sample"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-24 md:px-8 md:py-32">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl font-light leading-relaxed text-gray-900 sm:text-3xl sm:leading-relaxed md:text-4xl md:leading-relaxed lg:text-5xl lg:leading-relaxed xl:text-6xl xl:leading-relaxed mb-4 sm:mb-6">
              コードを書かずに<br />
              構築、公開、運用まで<br />
              Meishi+で完結。
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed lg:text-2xl lg:leading-relaxed">
              AI搭載のエディタで、自由に紹介ページを構築。<br className="hidden sm:block" />
              ワンクリックでスピーディに公開。第三者が安心して紹介できるプロフィールを簡単に作成できます。
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* 特徴カード1 */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">10分で完成</h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base sm:leading-relaxed md:text-lg">
                質問に答えるだけで、AIが自動で紹介ページを生成。複雑な設定は一切不要です。
              </p>
            </div>

            {/* 特徴カード2 */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">営業臭ゼロ</h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base sm:leading-relaxed md:text-lg">
                誇張や断定を避け、第三者が安心して紹介できる信頼性の高いプロフィールを生成します。
              </p>
            </div>

            {/* 特徴カード3 */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8 sm:col-span-2 lg:col-span-1">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">人となりを伝える</h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base sm:leading-relaxed md:text-lg">
                名刺では伝えきれない、あなたの価値観や考え方をしっかりと表現できます。
              </p>
            </div>
          </div>
        </section>

        {/* SEO用本文（DOMに存在させる） */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-3xl">
            <p className="text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl">
              Meishi+（メイシプラス）は、名刺以上、Web未満の個人紹介ページを作成できるサービスです。
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-700 sm:mt-6 sm:text-lg md:text-xl">
              個人事業主、フリーランス、不動産エージェント、保険営業、スタートアップ経営者、VC、コンサルタントなど、
              「人」で信頼される仕事をしている方に向いています。
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-700 sm:mt-6 sm:text-lg md:text-xl">
              質問に答えるだけで、第三者目線のインタビュー形式をもとに、営業臭のない紹介ページを自動生成します。
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-700 sm:mt-6 sm:text-lg md:text-xl">
              ホームページほど重くなく、名刺より多くの情報を伝えられる、新しい自己紹介の形です。
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-24 md:px-8 md:py-32">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl font-light text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6">
              よくある質問
          </h2>
          </div>

          <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 md:space-y-12">
            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                Meishi+ とは何ですか？
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                Meishi+（メイシプラス）は、名刺以上、Web未満の個人紹介ページを作成できるサービスです。
                第三者が安心して紹介できる1ページを、質問に答えるだけで作れます。
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                ホームページやLPとは何が違いますか？
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                ホームページほど情報が重くなく、名刺よりもしっかりと人となりや考えを伝えられるのが特徴です。
                営業や集客を目的としたLPではありません。
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                どんな人に向いていますか？
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                個人事業主、フリーランス、不動産エージェント、保険営業、スタートアップ経営者、VC、コンサルタントなど、
                「人」で信頼される仕事をしている方に向いています。
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                自分で文章を書く必要はありますか？
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                箇条書きや話し言葉で大丈夫です。入力内容をもとに、Meishi+
                が紹介用の文章に自動で整えます。
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                営業っぽくなりませんか？
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                営業臭や自慢表現を抑える設計になっています。「向いていない人」も正直に書くことで、信頼性を高めています。
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                無料で使えますか？
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                MVP段階では無料でご利用いただけます。今後、より高品質なAI生成などを有料プランとして提供する可能性があります。
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                作ったページは検索エンジンに表示されますか？
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                はい。公開設定にしたページは、Googleなどの検索エンジンに表示されるよう設計されています。
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <h3 className="mb-3 text-xl font-light text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                名刺やSNSとどう使い分ければいいですか？
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                名刺やSNSの「次の一枚」として使うのがおすすめです。紹介や初対面の場面で、URLやQRを渡すだけで説明が完結します。
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
