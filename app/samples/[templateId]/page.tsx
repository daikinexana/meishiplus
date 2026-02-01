/**
 * 個別テンプレートのサンプルページ
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { LayoutTemplates } from "@/app/[slug]/components/LayoutTemplates";
import { getLayoutTemplate } from "@/lib/layout-templates";

// サンプルデータ
const SAMPLE_DATA = {
  profile: {
    name: "山田 太郎",
    photoUrl: "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/868/large/df159e84-be91-4b3c-8ce5-2604de5f15ca.jpg?1684817396",
    // L01用: ヒーロー1枚 + セクション4枚 = 合計5枚
    photoUrls: [
      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/868/large/df159e84-be91-4b3c-8ce5-2604de5f15ca.jpg?1684817396", // ヒーロー用
      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/876/large/949d68a9-059b-4060-bb83-dd9f295049c7.jpg?1684818134", // Reason用
      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/891/large/9cb3646f-3ef2-4877-8de0-96a693750d2c.jpg?1684818791", // Values用
      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/896/large/b2167f70-5777-4552-ba6b-f3adbc838dfd.jpg?1684819105", // NotFit用
      "https://cdn.clipkit.co/tenants/1252/item_images/images/000/003/875/large/d4ace765-1ff0-4d2f-a8a9-2254bbca6f00.jpg?1684817646", // Human用
    ],
    headline: "ビジネスコンサルタント",
    tagline: "経営課題を解決するパートナーとして、企業の成長を支援しています",
    links: [
      { label: "公式サイト", url: "https://example.com" },
      { label: "LinkedIn", url: "https://linkedin.com/in/example" },
      { label: "Twitter", url: "https://twitter.com/example" },
    ],
  },
  generatedJson: {
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
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getLayoutTemplate(templateId);

  return {
    title: `${template.name} - サンプル | Meishi+`,
    description: `${template.description} - レイアウトテンプレートのサンプルページ`,
  };
}

export default async function SampleTemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getLayoutTemplate(templateId);

  if (!template) {
    notFound();
  }

  return (
    <>
      {/* サンプルページ用のバナー */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3">
          <span className="rounded-full bg-white/20 px-3 py-1">サンプルページ</span>
          <span className="hidden sm:inline">{template.name} ({template.id})</span>
          <Link
            href="/samples"
            className="ml-auto rounded-full bg-white/20 px-3 py-1 transition-colors hover:bg-white/30"
          >
            一覧に戻る
          </Link>
        </div>
      </div>

      {/* テンプレートコンテンツ */}
      <div className="pt-14">
        <LayoutTemplates
          profile={{
            ...SAMPLE_DATA.profile,
            layoutTemplateId: templateId,
          }}
          generatedJson={SAMPLE_DATA.generatedJson}
          slug="sample"
        />
      </div>
    </>
  );
}
