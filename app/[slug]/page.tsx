import { notFound } from "next/navigation";
import { profileQueries } from "@/lib/db-helpers";
import type { Metadata } from "next";
import { QRCodeDisplay } from "./components/QRCodeDisplay";
import { getThemeStyles } from "@/lib/theme-styles";

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
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const profileUrl = `${baseUrl}/${page.slug}`;
  const theme = getThemeStyles(page.themeId);

  // デバッグ用ログ
  if (process.env.NODE_ENV === "development") {
    console.log("[public] Theme debug:", {
      themeId: page.themeId,
      themeBackground: theme.background,
      themeTextPrimary: theme.textPrimary,
      themeBorder: theme.border,
    });
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero */}
        <div className={`mb-8 rounded-lg ${theme.cardBg} p-8 ${theme.shadow} ${theme.heroBg || theme.cardBg}`}>
          <h1 className={`mb-2 text-4xl font-bold ${theme.textPrimary}`}>
            {page.name || "プロフィール"}
          </h1>
          {page.tagline && (
            <p className={`text-xl ${theme.textSecondary}`}>{page.tagline}</p>
          )}
        </div>

        {/* Quick Profile */}
        {generatedJson?.sections?.quick && (
          <div className={`mb-8 rounded-lg ${theme.cardBg} p-6 ${theme.shadow}`}>
            <p className={`${theme.textPrimary} leading-relaxed`}>
              {generatedJson.sections.quick.body}
            </p>
          </div>
        )}

        {/* Reason */}
        {generatedJson?.sections?.reason && (
          <div className={`mb-8 rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
            <h2 className={`mb-2 text-2xl font-semibold ${theme.textPrimary}`}>
              {generatedJson.sections.reason.heading}
            </h2>
            {generatedJson.sections.reason.summary && (
              <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                {generatedJson.sections.reason.summary}
              </p>
            )}
            <p className={`${theme.textPrimary} leading-relaxed`}>
              {generatedJson.sections.reason.body}
            </p>
          </div>
        )}

        {/* Values */}
        {generatedJson?.sections?.values && (
          <div className={`mb-8 rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
            <h2 className={`mb-2 text-2xl font-semibold ${theme.textPrimary}`}>
              {generatedJson.sections.values.heading}
            </h2>
            {generatedJson.sections.values.summary && (
              <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                {generatedJson.sections.values.summary}
              </p>
            )}
            <p className={`${theme.textPrimary} leading-relaxed`}>
              {generatedJson.sections.values.body}
            </p>
          </div>
        )}

        {/* Not Fit */}
        {generatedJson?.sections?.notFit && (
          <div className={`mb-8 rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border-2 ${theme.border}`}>
            <h2 className={`mb-2 text-2xl font-semibold ${theme.textPrimary}`}>
              {generatedJson.sections.notFit.heading}
            </h2>
            {generatedJson.sections.notFit.summary && (
              <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                {generatedJson.sections.notFit.summary}
              </p>
            )}
            <p className={`${theme.textPrimary} leading-relaxed`}>
              {generatedJson.sections.notFit.body}
            </p>
          </div>
        )}

        {/* Proof */}
        {generatedJson?.sections?.proof && (
          <div className={`mb-8 rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
            <h2 className={`mb-4 text-2xl font-semibold ${theme.textPrimary}`}>
              {generatedJson.sections.proof.heading}
            </h2>
            <p className={`${theme.textPrimary} leading-relaxed`}>
              {generatedJson.sections.proof.body}
            </p>
          </div>
        )}

        {/* Human */}
        {generatedJson?.sections?.human && (
          <div className={`mb-8 rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
            <h2 className={`mb-2 text-2xl font-semibold ${theme.textPrimary}`}>
              {generatedJson.sections.human.heading}
            </h2>
            {generatedJson.sections.human.summary && (
              <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                {generatedJson.sections.human.summary}
              </p>
            )}
            <p className={`${theme.textPrimary} leading-relaxed`}>
              {generatedJson.sections.human.body}
            </p>
          </div>
        )}

        {/* Links */}
        {page.links && page.links.length > 0 && (
          <div className={`mb-8 rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
            <h2 className={`mb-4 text-2xl font-semibold ${theme.textPrimary}`}>
              リンク
            </h2>
            <div className="space-y-2">
              {page.links.map((link: { id: string; label: string; url: string }) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded border ${theme.border} p-3 ${theme.textPrimary} transition-colors ${
                    theme.cardBg === 'bg-white' ? 'hover:bg-gray-50' : 'hover:opacity-80'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Share / QR Code */}
        <QRCodeDisplay url={profileUrl} />
      </div>
    </div>
  );
}
