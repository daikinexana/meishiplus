import { notFound } from "next/navigation";
import { profileQueries } from "@/lib/db-helpers";
import type { Metadata } from "next";
import { LayoutTemplates } from "./components/LayoutTemplates";

async function getProfilePage(slug: string) {
  const page = await profileQueries.findBySlug(slug);

  if (!page || !page.isPublished) {
    return null;
  }

  return page;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getProfilePage(slug);

  if (!page) {
    return {
      title: "ページが見つかりません | Meishi+",
    };
  }

  const name = page.name || "ユーザー";
  return {
    title: `${name} | Meishi+`,
    description: `${name} の紹介ページ。名刺以上、Web未満の個人プロフィール。`,
    openGraph: {
      title: `${name} | Meishi+`,
      description: `${name} の紹介ページ。名刺以上、Web未満の個人プロフィール。`,
      type: "profile",
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getProfilePage(slug);

  if (!page) {
    notFound();
  }

  const generatedJson = page.generatedJson as any;

  // 生成されていない場合の警告（開発環境のみ）
  if (process.env.NODE_ENV === "development" && !generatedJson) {
    console.warn("[public] ⚠️ No generatedJson found. Profile should be generated first.");
  }

  return (
    <LayoutTemplates
      profile={{
        name: page.name || undefined,
        photoUrl: page.photoUrl || undefined,
        photoUrls: page.photoUrls || undefined,
        headline: page.headline || undefined,
        tagline: page.tagline || undefined,
        links: page.links?.map((link: any) => ({ label: link.label, url: link.url })) || [],
        layoutTemplateId: page.layoutTemplateId || undefined,
      }}
      generatedJson={generatedJson}
      slug={page.slug}
    />
  );
}
