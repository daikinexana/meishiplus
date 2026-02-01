/**
 * レイアウトテンプレートコンポーネント
 * 10種類の異なるUI/UXスタイルを実装
 * 各テンプレートは独自の色合いとUI/UXを持つ
 */

"use client";

import { QRCodeDisplay } from "./QRCodeDisplay";
import { getLayoutTemplate } from "@/lib/layout-templates";

interface ProfileData {
  name?: string;
  photoUrl?: string;
  photoUrls?: string[]; // 複数の写真URL（最大5枚）
  headline?: string;
  tagline?: string;
  generatedJson?: any;
  links?: Array<{ label: string; url: string }>;
  layoutTemplateId?: string;
}

interface LayoutTemplatesProps {
  profile: ProfileData;
  generatedJson: any;
  slug: string;
}

export function LayoutTemplates({ profile, generatedJson, slug }: LayoutTemplatesProps) {
  const layoutTemplateId = profile.layoutTemplateId || "L01";

  // 各テンプレートに応じたレンダリング
  switch (layoutTemplateId) {
    case "L01":
      return <LayoutL01 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L02":
      return <LayoutL02 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L03":
      return <LayoutL03 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L04":
      return <LayoutL04 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L05":
      return <LayoutL05 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L06":
      return <LayoutL06 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L07":
      return <LayoutL07 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L08":
      return <LayoutL08 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L09":
      return <LayoutL09 profile={profile} generatedJson={generatedJson} slug={slug} />;
    case "L10":
      return <LayoutL10 profile={profile} generatedJson={generatedJson} slug={slug} />;
    default:
      return <LayoutL01 profile={profile} generatedJson={generatedJson} slug={slug} />;
  }
}

// ============================================
// L01: ARK Group風インタビュー記事スタイル
// 参考: https://www.ark-gr.co.jp/business_blog/interview-tips/
// ============================================
function LayoutL01({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";
  
  // 写真の配列を取得（photoUrlsがあれば使用、なければphotoUrlを配列に変換）
  const photos = profile.photoUrls || (profile.photoUrl ? [profile.photoUrl] : []);
  const heroPhoto = photos[0];
  const sectionPhotos = photos.slice(1, 5); // 残り4枚をセクション用に使用
  
  // セクションの順序を定義
  const sectionOrder = [
    { key: 'reason', section: sections.reason, photo: sectionPhotos[0] },
    { key: 'values', section: sections.values, photo: sectionPhotos[1] },
    { key: 'notFit', section: sections.notFit, photo: sectionPhotos[2] },
    { key: 'human', section: sections.human, photo: sectionPhotos[3] },
  ].filter(item => item.section);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 大きな見出し */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          {headline && (
            <h1 className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.3' }}>
              {headline}
            </h1>
          )}
          {profile.name && (
            <p className="mb-4 text-lg text-gray-600 sm:text-xl" style={{ color: '#666666' }}>
              {profile.name}
            </p>
          )}
          {tagline && (
            <p className="mb-8 text-base text-gray-700 sm:text-lg" style={{ color: '#333333' }}>
              {tagline}
            </p>
          )}
        </div>
      </section>

      {/* Hero Image - 大きな中央写真 */}
      {heroPhoto && (
        <section className="bg-white pb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <img
              src={heroPhoto}
              alt={profile.name || "プロフィール写真"}
              className="mx-auto h-auto w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Quick Profile - 最初のテキストセクション */}
      {sections.quick && (
        <section className="bg-white py-20 sm:py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 lg:px-12">
            <p className="text-xl leading-[1.8] text-gray-900 sm:text-2xl md:text-3xl md:leading-[1.9]">
              {sections.quick.body}
            </p>
          </div>
        </section>
      )}

      {/* 各セクションを順番に表示 */}
      {sectionOrder.map((item) => {
        const section = item.section;
        
        return (
          <div key={item.key}>
            {/* 写真セクション */}
            {item.photo && (
              <section className="bg-white py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                  <img 
                    src={item.photo} 
                    alt="" 
                    className="h-auto w-full object-cover"
                  />
                </div>
              </section>
            )}
            
            {/* テキストセクション */}
            <section className="bg-white py-12 sm:py-16">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                  {section.heading}
                </h2>
                {section.summary && (
                  <p className="mb-6 text-lg text-gray-700 sm:text-xl" style={{ color: '#333333' }}>
                    {section.summary}
                  </p>
                )}
                <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                  {section.body}
                </p>
              </div>
            </section>
          </div>
        );
      })}

      {/* Proof Section - 写真なし */}
      {sections.proof && (
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
              {sections.proof.heading}
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
              {sections.proof.body}
            </p>
          </div>
        </section>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-20 sm:py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 lg:px-12">
            <h2 className="mb-12 text-3xl font-light text-gray-900 sm:text-4xl md:text-5xl">リンク集</h2>
            <div className="space-y-6">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block border-b border-gray-300 pb-6 transition-colors hover:border-gray-500"
                  >
                    <span className="text-xl text-gray-900 group-hover:text-gray-700 sm:text-2xl">
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="bg-white" textClass="text-gray-900" />
    </div>
  );
}

// ============================================
// L02: オトナミューズ風インタビュースタイル
// 参考: https://otonamuse.jp/people/183159/
// ============================================
function LayoutL02({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";
  
  // 写真の配列を取得（photoUrlsがあれば使用、なければphotoUrlを配列に変換）
  const photos = profile.photoUrls || (profile.photoUrl ? [profile.photoUrl] : []);
  const heroPhoto = photos[0];
  const sectionPhotos = photos.slice(1, 5); // 残り4枚をセクション用に使用

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8e6df' }}>
      {/* Hero Section - 大きなタイトルと写真 */}
      <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#e8e6df' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          {/* タイトル */}
          {headline && (
            <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
              {headline}
            </h1>
          )}
          
          {/* サブタイトル */}
          {tagline && (
            <p className="mb-8 text-lg sm:text-xl md:text-2xl" style={{ color: '#333333' }}>
              {tagline}
            </p>
          )}
          
          {/* 名前 */}
          {profile.name && (
            <p className="mb-8 text-base sm:text-lg" style={{ color: '#666666' }}>
              {profile.name}
            </p>
          )}
          
          {/* ヒーロー写真 */}
          {heroPhoto && (
            <div className="mt-8 overflow-hidden">
              <img 
                src={heroPhoto} 
                alt={profile.name || "プロフィール写真"} 
                className="h-auto w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Quick Profile - 最初のテキストセクション */}
      {sections.quick && (
        <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#e8e6df' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <p className="text-base leading-relaxed sm:text-lg md:text-xl" style={{ color: '#2d2d2d', lineHeight: '1.9' }}>
              {sections.quick.body}
            </p>
          </div>
        </section>
      )}

      {/* Reason Section - 写真とテキスト */}
      {sections.reason && (
        <>
          {sectionPhotos[0] && (
            <section className="py-8 sm:py-12" style={{ backgroundColor: '#e8e6df' }}>
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[0]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#e8e6df' }}>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                {sections.reason.heading}
              </h2>
              {sections.reason.summary && (
                <p className="mb-8 text-lg sm:text-xl" style={{ color: '#333333' }}>
                  {sections.reason.summary}
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg md:text-xl" style={{ color: '#2d2d2d', lineHeight: '1.9' }}>
                {sections.reason.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Values Section - 写真とテキスト */}
      {sections.values && (
        <>
          {sectionPhotos[1] && (
            <section className="py-8 sm:py-12" style={{ backgroundColor: '#e8e6df' }}>
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[1]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#e8e6df' }}>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                {sections.values.heading}
              </h2>
              {sections.values.summary && (
                <p className="mb-8 text-lg sm:text-xl" style={{ color: '#333333' }}>
                  {sections.values.summary}
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg md:text-xl" style={{ color: '#2d2d2d', lineHeight: '1.9' }}>
                {sections.values.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Not Fit Section - 写真とテキスト */}
      {sections.notFit && (
        <>
          {sectionPhotos[2] && (
            <section className="py-8 sm:py-12" style={{ backgroundColor: '#e8e6df' }}>
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[2]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#e8e6df' }}>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                {sections.notFit.heading}
              </h2>
              {sections.notFit.summary && (
                <p className="mb-8 text-lg sm:text-xl" style={{ color: '#333333' }}>
                  {sections.notFit.summary}
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg md:text-xl" style={{ color: '#2d2d2d', lineHeight: '1.9' }}>
                {sections.notFit.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Proof Section */}
      {sections.proof && (
        <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#e8e6df' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
              {sections.proof.heading}
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg md:text-xl" style={{ color: '#2d2d2d', lineHeight: '1.9' }}>
              {sections.proof.body}
            </p>
          </div>
        </section>
      )}

      {/* Human Section - 写真とテキスト */}
      {sections.human && (
        <>
          {sectionPhotos[3] && (
            <section className="py-8 sm:py-12" style={{ backgroundColor: '#e8e6df' }}>
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[3]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#e8e6df' }}>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                {sections.human.heading}
              </h2>
              {sections.human.summary && (
                <p className="mb-8 text-lg sm:text-xl" style={{ color: '#333333' }}>
                  {sections.human.summary}
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg md:text-xl" style={{ color: '#2d2d2d', lineHeight: '1.9' }}>
                {sections.human.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#e8e6df' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl md:text-4xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>リンク集</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
                    style={{ 
                      borderColor: '#d0d0d0', 
                      backgroundColor: '#f5f3ed',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#b0b0b0';
                      e.currentTarget.style.backgroundColor = '#f0ede5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#d0d0d0';
                      e.currentTarget.style.backgroundColor = '#f5f3ed';
                    }}
                  >
                    <span className="text-base font-medium" style={{ color: '#1a1a1a' }}>
                      {link.label}
                    </span>
                    <svg className="h-5 w-5" style={{ color: '#999999' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="" textClass="text-gray-900" bgStyle={{ backgroundColor: '#e8e6df' }} />
    </div>
  );
}

// ============================================
// L03: LINE Digital Frontier風インタビュースタイル
// 参考: https://ldfcorp.com/ja/careers/interview/interview12/
// ============================================
function LayoutL03({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";
  
  // 写真の配列を取得（photoUrlsがあれば使用、なければphotoUrlを配列に変換）
  const photos = profile.photoUrls || (profile.photoUrl ? [profile.photoUrl] : []);
  const heroPhoto = photos[0];
  const sectionPhotos = photos.slice(1, 5); // 残り4枚をセクション用に使用

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 大きな見出し */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          {headline && (
            <h1 className="mb-12 text-center text-2xl font-bold sm:text-3xl md:text-4xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.4' }}>
              {headline}
            </h1>
          )}
        </div>
      </section>

      {/* Hero Image - 大きな中央写真 */}
      {heroPhoto && (
        <section className="bg-white pb-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <img
              src={heroPhoto}
              alt={profile.name || "プロフィール写真"}
              className="mx-auto h-auto w-full max-w-3xl object-cover"
            />
          </div>
        </section>
      )}

      {/* Profile Info - 写真の下の情報 */}
      <section className="bg-white pb-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 md:px-8">
          {tagline && (
            <>
              <p className="mb-2 text-base" style={{ color: '#1a1a1a' }}>
                {tagline.split(' / ')[0] || tagline}
              </p>
              {tagline.includes(' / ') && (
                <p className="mb-3 text-base" style={{ color: '#1a1a1a' }}>
                  {tagline.split(' / ')[1]}
                </p>
              )}
            </>
          )}
          {profile.name && (
            <p className="mb-3 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
              {profile.name}
            </p>
          )}
          {tagline && tagline.split(' / ').length > 2 && (
            <p className="text-base" style={{ color: '#666666' }}>
              {tagline.split(' / ')[2]}
            </p>
          )}
        </div>
      </section>

      {/* Quick Profile - 最初のテキストセクション */}
      {sections.quick && (
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <p className="text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
              {sections.quick.body}
            </p>
          </div>
        </section>
      )}

      {/* Reason Section - Qアイコン付き */}
      {sections.reason && (
        <>
          {sectionPhotos[0] && (
            <section className="bg-white py-8">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[0]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12" style={{ backgroundColor: '#B8E986' }}>
                  <span className="text-xl font-bold sm:text-2xl" style={{ color: '#1a1a1a' }}>Q</span>
                </div>
                <h2 className="flex-1 text-lg font-bold sm:text-xl md:text-2xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.5' }}>
                  {sections.reason.heading}
                </h2>
              </div>
              {sections.reason.summary && (
                <p className="mb-4 ml-14 text-base sm:ml-16 sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                  {sections.reason.summary}
                </p>
              )}
              <p className="ml-14 whitespace-pre-line text-base leading-relaxed sm:ml-16 sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                {sections.reason.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Values Section - Qアイコン付き */}
      {sections.values && (
        <>
          {sectionPhotos[1] && (
            <section className="bg-white py-8">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[1]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12" style={{ backgroundColor: '#B8E986' }}>
                  <span className="text-xl font-bold sm:text-2xl" style={{ color: '#1a1a1a' }}>Q</span>
                </div>
                <h2 className="flex-1 text-lg font-bold sm:text-xl md:text-2xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.5' }}>
                  {sections.values.heading}
                </h2>
              </div>
              {sections.values.summary && (
                <p className="mb-4 ml-14 text-base sm:ml-16 sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                  {sections.values.summary}
                </p>
              )}
              <p className="ml-14 whitespace-pre-line text-base leading-relaxed sm:ml-16 sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                {sections.values.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Not Fit Section - Qアイコン付き */}
      {sections.notFit && (
        <>
          {sectionPhotos[2] && (
            <section className="bg-white py-8">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[2]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12" style={{ backgroundColor: '#B8E986' }}>
                  <span className="text-xl font-bold sm:text-2xl" style={{ color: '#1a1a1a' }}>Q</span>
                </div>
                <h2 className="flex-1 text-lg font-bold sm:text-xl md:text-2xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.5' }}>
                  {sections.notFit.heading}
                </h2>
              </div>
              {sections.notFit.summary && (
                <p className="mb-4 ml-14 text-base sm:ml-16 sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                  {sections.notFit.summary}
                </p>
              )}
              <p className="ml-14 whitespace-pre-line text-base leading-relaxed sm:ml-16 sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                {sections.notFit.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Proof Section - Qアイコン付き */}
      {sections.proof && (
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12" style={{ backgroundColor: '#B8E986' }}>
                <span className="text-xl font-bold sm:text-2xl" style={{ color: '#1a1a1a' }}>Q</span>
              </div>
              <h2 className="flex-1 text-lg font-bold sm:text-xl md:text-2xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.5' }}>
                {sections.proof.heading}
              </h2>
            </div>
            <p className="ml-14 whitespace-pre-line text-base leading-relaxed sm:ml-16 sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
              {sections.proof.body}
            </p>
          </div>
        </section>
      )}

      {/* Human Section - Qアイコン付き */}
      {sections.human && (
        <>
          {sectionPhotos[3] && (
            <section className="bg-white py-8">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[3]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12" style={{ backgroundColor: '#B8E986' }}>
                  <span className="text-xl font-bold sm:text-2xl" style={{ color: '#1a1a1a' }}>Q</span>
                </div>
                <h2 className="flex-1 text-lg font-bold sm:text-xl md:text-2xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.5' }}>
                  {sections.human.heading}
                </h2>
              </div>
              {sections.human.summary && (
                <p className="mb-4 ml-14 text-base sm:ml-16 sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                  {sections.human.summary}
                </p>
              )}
              <p className="ml-14 whitespace-pre-line text-base leading-relaxed sm:ml-16 sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                {sections.human.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* 注釈 - 最後のセクションの後に表示 */}
      {(sections.reason || sections.values || sections.notFit || sections.proof || sections.human) && (
        <section className="bg-white pb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <p className="text-right text-xs text-gray-500 sm:text-sm" style={{ color: '#999999' }}>
              ※内容はインタビュー時のものです
            </p>
          </div>
        </section>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">リンク集</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
                  >
                    <span className="text-base font-medium text-gray-900 group-hover:text-gray-700">
                      {link.label}
                    </span>
                    <svg className="ml-auto h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="bg-white" textClass="text-gray-900" bgStyle={{ backgroundColor: '#ffffff' }} />
    </div>
  );
}

// ============================================
// L04: NewsPicks風インタビュースタイル
// 参考: https://newspicks.com/news/14029368/body/
// ============================================
function LayoutL04({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";
  
  // 写真の配列を取得（photoUrlsがあれば使用、なければphotoUrlを配列に変換）
  const photos = profile.photoUrls || (profile.photoUrl ? [profile.photoUrl] : []);
  const heroPhoto = photos[0];
  const sectionPhotos = photos.slice(1, 5); // 残り4枚をセクション用に使用
  
  // インデックス用のセクションリスト
  const indexItems = [
    sections.quick && { id: 'quick', title: sections.quick.heading || 'プロフィール' },
    sections.reason && { id: 'reason', title: sections.reason.heading },
    sections.values && { id: 'values', title: sections.values.heading },
    sections.notFit && { id: 'notFit', title: sections.notFit.heading },
    sections.proof && { id: 'proof', title: sections.proof.heading },
    sections.human && { id: 'human', title: sections.human.heading },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 大きな見出し */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          {headline && (
            <h1 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.3' }}>
              {headline}
            </h1>
          )}
          {profile.name && (
            <p className="mb-4 text-lg text-gray-600 sm:text-xl" style={{ color: '#666666' }}>
              {profile.name}
            </p>
          )}
          {tagline && (
            <p className="mb-8 text-base text-gray-700 sm:text-lg" style={{ color: '#333333' }}>
              {tagline}
            </p>
          )}
        </div>
      </section>

      {/* Hero Image - 大きな中央写真 */}
      {heroPhoto && (
        <section className="bg-white pb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <img
              src={heroPhoto}
              alt={profile.name || "プロフィール写真"}
              className="mx-auto h-auto w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Index Section - 目次 */}
      {indexItems.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-lg font-bold" style={{ color: '#1a1a1a' }}>INDEX</h2>
            <ul className="space-y-3">
              {indexItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.id}`}
                    className="text-base hover:underline"
                    style={{ color: '#1a1a1a' }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Quick Profile - 最初のテキストセクション */}
      {sections.quick && (
        <section id="quick" className="border-t border-gray-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
              {sections.quick.heading || 'プロフィール'}
            </h2>
            <p className="text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
              {sections.quick.body}
            </p>
          </div>
        </section>
      )}

      {/* Reason Section */}
      {sections.reason && (
        <>
          {sectionPhotos[0] && (
            <section className="bg-white py-8">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[0]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section id="reason" className="border-t border-gray-200 bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                {sections.reason.heading}
              </h2>
              {sections.reason.summary && (
                <p className="mb-6 text-lg text-gray-700 sm:text-xl" style={{ color: '#333333' }}>
                  {sections.reason.summary}
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                {sections.reason.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Values Section */}
      {sections.values && (
        <>
          {sectionPhotos[1] && (
            <section className="bg-white py-8">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[1]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section id="values" className="border-t border-gray-200 bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                {sections.values.heading}
              </h2>
              {sections.values.summary && (
                <p className="mb-6 text-lg text-gray-700 sm:text-xl" style={{ color: '#333333' }}>
                  {sections.values.summary}
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                {sections.values.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Not Fit Section */}
      {sections.notFit && (
        <>
          {sectionPhotos[2] && (
            <section className="bg-white py-8">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[2]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section id="notFit" className="border-t border-gray-200 bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                {sections.notFit.heading}
              </h2>
              {sections.notFit.summary && (
                <p className="mb-6 text-lg text-gray-700 sm:text-xl" style={{ color: '#333333' }}>
                  {sections.notFit.summary}
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                {sections.notFit.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Proof Section */}
      {sections.proof && (
        <section id="proof" className="border-t border-gray-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
              {sections.proof.heading}
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
              {sections.proof.body}
            </p>
          </div>
        </section>
      )}

      {/* Human Section */}
      {sections.human && (
        <>
          {sectionPhotos[3] && (
            <section className="bg-white py-8">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <img 
                  src={sectionPhotos[3]} 
                  alt="" 
                  className="h-auto w-full object-cover"
                />
              </div>
            </section>
          )}
          <section id="human" className="border-t border-gray-200 bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                {sections.human.heading}
              </h2>
              {sections.human.summary && (
                <p className="mb-6 text-lg text-gray-700 sm:text-xl" style={{ color: '#333333' }}>
                  {sections.human.summary}
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                {sections.human.body}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>リンク集</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
                  >
                    <span className="text-base font-medium text-gray-900 group-hover:text-gray-700">
                      {link.label}
                    </span>
                    <svg className="ml-auto h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="bg-white" textClass="text-gray-900" bgStyle={{ backgroundColor: '#ffffff' }} />
    </div>
  );
}

// ============================================
// L05: NTTドコモビジネスソリューションズ風インタビュースタイル
// 参考: https://www.docomobs.com/career/interview/
// ============================================
function LayoutL05({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";
  
  // 写真の配列を取得（photoUrlsがあれば使用、なければphotoUrlを配列に変換）
  const photos = profile.photoUrls || (profile.photoUrl ? [profile.photoUrl] : []);
  const heroPhoto = photos[0];
  const sectionPhotos = photos.slice(1, 5); // 残り4枚をセクション用に使用
  
  // セクションの順序を定義（Q番号を決定するため）
  const sectionOrder: Array<{ key: string; section: any; photoIndex: number | null }> = [];
  let qNumber = 0;
  
  if (sections.quick) {
    sectionOrder.push({ key: 'quick', section: sections.quick, photoIndex: null });
    qNumber++;
  }
  if (sections.reason) {
    sectionOrder.push({ key: 'reason', section: sections.reason, photoIndex: 0 });
    qNumber++;
  }
  if (sections.values) {
    sectionOrder.push({ key: 'values', section: sections.values, photoIndex: 1 });
    qNumber++;
  }
  if (sections.notFit) {
    sectionOrder.push({ key: 'notFit', section: sections.notFit, photoIndex: 2 });
    qNumber++;
  }
  if (sections.proof) {
    sectionOrder.push({ key: 'proof', section: sections.proof, photoIndex: null });
    qNumber++;
  }
  if (sections.human) {
    sectionOrder.push({ key: 'human', section: sections.human, photoIndex: 3 });
    qNumber++;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 大きな見出し */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          {headline && (
            <h1 className="mb-12 text-center text-3xl font-bold sm:text-4xl md:text-5xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.4' }}>
              {headline}
            </h1>
          )}
        </div>
      </section>

      {/* Hero Image - 大きな中央写真 */}
      {heroPhoto && (
        <section className="bg-white pb-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <img
              src={heroPhoto}
              alt={profile.name || "プロフィール写真"}
              className="mx-auto h-auto w-full max-w-3xl object-cover"
            />
          </div>
        </section>
      )}

      {/* Profile Info - 写真の下の情報 */}
      <section className="bg-white pb-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 md:px-8">
          {tagline && (
            <>
              <p className="mb-2 text-base" style={{ color: '#1a1a1a' }}>
                {tagline.split(' / ')[0] || tagline}
              </p>
              {tagline.includes(' / ') && (
                <p className="mb-3 text-base" style={{ color: '#1a1a1a' }}>
                  {tagline.split(' / ')[1]}
                </p>
              )}
            </>
          )}
          {profile.name && (
            <p className="mb-3 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
              {profile.name}
            </p>
          )}
          {tagline && tagline.split(' / ').length > 2 && (
            <p className="text-base" style={{ color: '#666666' }}>
              {tagline.split(' / ')[2]}
            </p>
          )}
        </div>
      </section>

      {/* 各セクションを順番に表示（Q1, Q2, Q3, Q4...） */}
      {sectionOrder.map((item, index) => {
        const currentQNumber = index + 1;
        const section = item.section;
        
        return (
          <div key={item.key}>
            {/* 写真セクション */}
            {item.photoIndex !== null && sectionPhotos[item.photoIndex] && (
              <section className="bg-white py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                  <img
                    src={sectionPhotos[item.photoIndex]}
                    alt=""
                    className="mx-auto h-auto w-full object-cover"
                  />
                </div>
              </section>
            )}
            
            {/* テキストセクション */}
            <section className="bg-white py-12 sm:py-16">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                  Q{currentQNumber}{section.heading ? ` ${section.heading}` : ''}
                </h2>
                {section.summary && (
                  <p className="mb-4 text-base text-gray-700 sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                    {section.summary}
                  </p>
                )}
                <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1a1a1a', lineHeight: '1.9' }}>
                  {section.body}
                </p>
              </div>
            </section>
          </div>
        );
      })}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>リンク集</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
                  >
                    <span className="text-base font-medium text-gray-900 group-hover:text-gray-700">
                      {link.label}
                    </span>
                    <svg className="ml-auto h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="bg-white" textClass="text-gray-900" bgStyle={{ backgroundColor: '#ffffff' }} />
    </div>
  );
}

// ============================================
// L06: EY風インタビュー記事スタイル
// 参考: https://www.eysc.jp/recruit/new_graduate/special/interview_03/
// ============================================
function LayoutL06({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";

  // 写真の配列を取得（photoUrlsがあれば使用、なければphotoUrlを配列に変換）
  const photos = profile.photoUrls || (profile.photoUrl ? [profile.photoUrl] : []);
  const heroPhoto = photos[0];
  const sectionPhotos = photos.slice(1, 5); // 残り4枚をセクション用に使用

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image - 大きなヒーロー写真 */}
      {heroPhoto && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <img
              src={heroPhoto}
              alt={profile.name || "プロフィール写真"}
              className="mx-auto h-auto w-full max-w-5xl object-cover"
            />
          </div>
        </section>
      )}

      {/* Profile Info - 写真の下の情報 */}
      <section className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
          {tagline && (
            <p className="mb-6 text-base sm:text-lg" style={{ color: '#333333', lineHeight: '1.6' }}>
              {tagline}
            </p>
          )}
          {profile.name && (
            <h1 className="mb-8 inline-block text-3xl font-bold sm:text-4xl md:text-5xl" style={{ color: '#1a1a1a', fontWeight: 700 }}>
              <span className="border-b-4 pb-2" style={{ borderColor: '#FFC107', display: 'inline-block' }}>
                {profile.name}
              </span>
            </h1>
          )}
          {headline && (
            <p className="mt-8 whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
              {headline}
            </p>
          )}
        </div>
      </section>

      {/* Reason Section - インタビュー詳細 */}
      {sections.reason && (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            {sectionPhotos[0] && (
              <div className="mb-10 lg:mb-12">
                <img
                  src={sectionPhotos[0]}
                  alt=""
                  className="mx-auto h-auto w-full max-w-4xl object-cover"
                />
              </div>
            )}
            <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.reason.heading}
            </h2>
            {sections.reason.summary && (
              <p className="mb-8 text-base sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                {sections.reason.summary}
              </p>
            )}
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
              {sections.reason.body}
            </p>
          </div>
        </section>
      )}

      {/* Values Section - インタビュー詳細 */}
      {sections.values && (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            {sectionPhotos[1] && (
              <div className="mb-10 lg:mb-12">
                <img
                  src={sectionPhotos[1]}
                  alt=""
                  className="mx-auto h-auto w-full max-w-4xl object-cover"
                />
              </div>
            )}
            <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.values.heading}
            </h2>
            {sections.values.summary && (
              <p className="mb-8 text-base sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                {sections.values.summary}
              </p>
            )}
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
              {sections.values.body}
            </p>
          </div>
        </section>
      )}

      {/* Not Fit Section - インタビュー詳細 */}
      {sections.notFit && (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            {sectionPhotos[2] && (
              <div className="mb-10 lg:mb-12">
                <img
                  src={sectionPhotos[2]}
                  alt=""
                  className="mx-auto h-auto w-full max-w-4xl object-cover"
                />
              </div>
            )}
            <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.notFit.heading}
            </h2>
            {sections.notFit.summary && (
              <p className="mb-8 text-base sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                {sections.notFit.summary}
              </p>
            )}
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
              {sections.notFit.body}
            </p>
          </div>
        </section>
      )}

      {/* Proof Section - インタビュー詳細 */}
      {sections.proof && (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.proof.heading}
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
              {sections.proof.body}
            </p>
          </div>
        </section>
      )}

      {/* Human Section - インタビュー詳細 */}
      {sections.human && (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            {sectionPhotos[3] && (
              <div className="mb-10 lg:mb-12">
                <img
                  src={sectionPhotos[3]}
                  alt=""
                  className="mx-auto h-auto w-full max-w-4xl object-cover"
                />
              </div>
            )}
            <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.human.heading}
            </h2>
            {sections.human.summary && (
              <p className="mb-8 text-base sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
                {sections.human.summary}
              </p>
            )}
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#333333', lineHeight: '1.8' }}>
              {sections.human.body}
            </p>
          </div>
        </section>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#2d2d2d' }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl" style={{ color: '#FFC107', fontWeight: 700 }}>リンク集</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-yellow-400 hover:shadow-md"
                    style={{ borderColor: '#555555', backgroundColor: '#3a3a3a' }}
                  >
                    <span className="text-base font-medium text-white group-hover:text-yellow-300">
                      {link.label}
                    </span>
                    <svg className="ml-auto h-5 w-5 text-gray-400 group-hover:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="" textClass="text-white" bgStyle={{ backgroundColor: '#2d2d2d' }} titleColor="#FFC107" />
    </div>
  );
}

// ============================================
// L07: 電通総研風インタビュー記事スタイル
// 参考: https://www.dentsusoken.com/saiyo/woman/interview/staff_02.html
// ============================================
function LayoutL07({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";

  // 写真の配列を取得（photoUrlsがあれば使用、なければphotoUrlを配列に変換）
  const photos = profile.photoUrls || (profile.photoUrl ? [profile.photoUrl] : []);
  const heroPhoto = photos[0];
  const sectionPhotos = photos.slice(1, 5); // 残り4枚をセクション用に使用

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
      {/* Hero Section - タイトルと見出し */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-12" style={{ backgroundColor: '#f5f5f0' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          {/* tagline（ビジネスコンサルタント）を中央揃えで表示 */}
          {tagline && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl" style={{ color: '#1e3a5f', fontWeight: 700, lineHeight: '1.3' }}>
                {tagline}
              </h1>
            </div>
          )}
          
          {/* headline（経営課題を解決するパートナーとして、企業の成長を支援しています）を中央揃えで表示 */}
          {headline && (
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl" style={{ color: '#1e3a5f', fontWeight: 700, lineHeight: '1.4' }}>
                {headline}
              </h2>
            </div>
          )}
        </div>
      </section>

      {/* Profile Info - プロフィール情報 */}
      <section className="pb-8 sm:pb-12" style={{ backgroundColor: '#f5f5f0' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          {profile.name && (
            <div className="mb-2 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl" style={{ color: '#1e3a5f', fontWeight: 700, lineHeight: '1.3' }}>
                {profile.name}
              </h2>
            </div>
          )}
        </div>
      </section>

      {/* Hero Image - 大きな中央写真 */}
      {heroPhoto && (
        <section className="pb-12 sm:pb-16" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <div className="relative">
              <img
                src={heroPhoto}
                alt={profile.name || "プロフィール写真"}
                className="mx-auto h-auto w-full object-cover"
              />
              {/* 右端の薄いグリーンのバー */}
              <div className="absolute right-0 top-0 h-full" style={{ width: '4px', backgroundColor: '#90EE90', opacity: 0.7 }}></div>
              {/* 下部の薄いグリーンのバー */}
              <div className="absolute bottom-0 left-0 w-full" style={{ height: '4px', backgroundColor: '#90EE90', opacity: 0.7 }}></div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Profile - 最初のテキストセクション */}
      {sections.quick && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <p className="text-base leading-relaxed sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
              {sections.quick.body}
            </p>
          </div>
        </section>
      )}

      {/* Reason Section */}
      {sections.reason && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            {sectionPhotos[0] && (
              <div className="mb-8">
                <img
                  src={sectionPhotos[0]}
                  alt=""
                  className="mx-auto h-auto w-full object-cover"
                />
              </div>
            )}
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1e3a5f', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.reason.heading}
            </h2>
            {sections.reason.summary && (
              <p className="mb-6 text-base sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
                {sections.reason.summary}
              </p>
            )}
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
              {sections.reason.body}
            </p>
          </div>
        </section>
      )}

      {/* Values Section */}
      {sections.values && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            {sectionPhotos[1] && (
              <div className="mb-8">
                <img
                  src={sectionPhotos[1]}
                  alt=""
                  className="mx-auto h-auto w-full object-cover"
                />
              </div>
            )}
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1e3a5f', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.values.heading}
            </h2>
            {sections.values.summary && (
              <p className="mb-6 text-base sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
                {sections.values.summary}
              </p>
            )}
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
              {sections.values.body}
            </p>
          </div>
        </section>
      )}

      {/* Not Fit Section */}
      {sections.notFit && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            {sectionPhotos[2] && (
              <div className="mb-8">
                <img
                  src={sectionPhotos[2]}
                  alt=""
                  className="mx-auto h-auto w-full object-cover"
                />
              </div>
            )}
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1e3a5f', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.notFit.heading}
            </h2>
            {sections.notFit.summary && (
              <p className="mb-6 text-base sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
                {sections.notFit.summary}
              </p>
            )}
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
              {sections.notFit.body}
            </p>
          </div>
        </section>
      )}

      {/* Proof Section */}
      {sections.proof && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1e3a5f', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.proof.heading}
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
              {sections.proof.body}
            </p>
          </div>
        </section>
      )}

      {/* Human Section */}
      {sections.human && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            {sectionPhotos[3] && (
              <div className="mb-8">
                <img
                  src={sectionPhotos[3]}
                  alt=""
                  className="mx-auto h-auto w-full object-cover"
                />
              </div>
            )}
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1e3a5f', fontWeight: 700, lineHeight: '1.4' }}>
              {sections.human.heading}
            </h2>
            {sections.human.summary && (
              <p className="mb-6 text-base sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
                {sections.human.summary}
              </p>
            )}
            <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg" style={{ color: '#1e3a5f', lineHeight: '1.8' }}>
              {sections.human.body}
            </p>
          </div>
        </section>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="py-12" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ color: '#1e3a5f', fontWeight: 700 }}>リンク集</h2>
            <div className="space-y-3">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 border-l-4 p-4 transition-all"
                    style={{ borderColor: '#FF69B4', backgroundColor: '#ffffff' }}
                  >
                    <span className="font-semibold group-hover:opacity-80" style={{ color: '#1e3a5f' }}>
                      {link.label}
                    </span>
                    <svg className="ml-auto h-5 w-5" style={{ color: '#1e3a5f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="" textClass="text-white" bgStyle={{ backgroundColor: '#f5f5f0' }} titleColor="#1e3a5f" />
    </div>
  );
}

// ============================================
// L08: ARK Group風インタビュー記事スタイル
// 参考: https://www.ark-gr.co.jp/business_blog/interview-tips/
// ============================================
function LayoutL08({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";

  // 写真の配列を取得（photoUrlsがあれば使用、なければphotoUrlを配列に変換）
  const photos = profile.photoUrls || (profile.photoUrl ? [profile.photoUrl] : []);
  const heroPhoto = photos[0];
  const sectionPhotos = photos.slice(1, 5); // 残り4枚をセクション用に使用

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 大きな見出し */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
          {headline && (
            <h1 className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-5xl" style={{ color: '#1a1a1a', fontWeight: 700, lineHeight: '1.3' }}>
              {headline}
            </h1>
          )}
          {profile.name && (
            <p className="mb-4 text-lg text-gray-600 sm:text-xl lg:text-xl" style={{ color: '#666666' }}>
              {profile.name}
            </p>
          )}
          {tagline && (
            <p className="mb-8 text-base text-gray-700 sm:text-lg lg:text-lg" style={{ color: '#333333' }}>
              {tagline}
            </p>
          )}
        </div>
      </section>

      {/* Hero Image - 大きな中央写真 */}
      {heroPhoto && (
        <section className="bg-white pb-12 lg:pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <img
              src={heroPhoto}
              alt={profile.name || "プロフィール写真"}
              className="mx-auto h-auto w-full max-w-5xl object-cover"
            />
          </div>
        </section>
      )}

      {/* Quick Profile - 最初のテキストセクション */}
      {sections.quick && (
        <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <p className="text-xl leading-[1.8] text-gray-900 sm:text-2xl md:text-3xl lg:text-xl lg:leading-[1.9]">
              {sections.quick.body}
            </p>
          </div>
        </section>
      )}

      {/* Reason Section - 写真とテキスト */}
      {sections.reason && (
        <>
          {sectionPhotos[0] && (
            <section className="relative h-[60vh] overflow-hidden sm:h-[70vh] md:h-[80vh] lg:h-[85vh]">
              <div className="mx-auto max-w-6xl">
                <img 
                  src={sectionPhotos[0]} 
                  alt="" 
                  className="h-full w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
              {/* セクション見出しバナー */}
              {sections.reason.heading && (
                <div className="mb-12 flex items-center lg:mb-16" style={{ backgroundColor: '#e5e5e5' }}>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                  <h2 className="flex-1 py-4 pl-6 pr-6 text-left text-xl font-bold sm:text-2xl md:text-3xl lg:text-2xl" style={{ color: '#2c2c2c', fontWeight: 700 }}>
                    {sections.reason.heading}
                  </h2>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                </div>
              )}
              {sections.reason.summary && (
                <p className="mb-12 text-xl italic text-gray-600 sm:text-2xl lg:text-xl lg:mb-16">
                  {sections.reason.summary}
                </p>
              )}
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line text-xl leading-[1.9] text-gray-900 sm:text-2xl md:text-3xl lg:text-xl lg:leading-[2.0]">
                  {sections.reason.body}
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Values Section - 写真とテキスト */}
      {sections.values && (
        <>
          {sectionPhotos[1] && (
            <section className="relative h-[60vh] overflow-hidden sm:h-[70vh] md:h-[80vh] lg:h-[85vh]">
              <div className="mx-auto max-w-6xl">
                <img 
                  src={sectionPhotos[1]} 
                  alt="" 
                  className="h-full w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
              {/* セクション見出しバナー */}
              {sections.values.heading && (
                <div className="mb-12 flex items-center lg:mb-16" style={{ backgroundColor: '#e5e5e5' }}>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                  <h2 className="flex-1 py-4 pl-6 pr-6 text-left text-xl font-bold sm:text-2xl md:text-3xl lg:text-2xl" style={{ color: '#2c2c2c', fontWeight: 700 }}>
                    {sections.values.heading}
                  </h2>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                </div>
              )}
              {sections.values.summary && (
                <p className="mb-12 text-xl italic text-gray-600 sm:text-2xl lg:text-xl lg:mb-16">
                  {sections.values.summary}
                </p>
              )}
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line text-xl leading-[1.9] text-gray-900 sm:text-2xl md:text-3xl lg:text-xl lg:leading-[2.0]">
                  {sections.values.body}
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Not Fit Section - 写真とテキスト */}
      {sections.notFit && (
        <>
          {sectionPhotos[2] && (
            <section className="relative h-[60vh] overflow-hidden sm:h-[70vh] md:h-[80vh] lg:h-[85vh]">
              <div className="mx-auto max-w-6xl">
                <img 
                  src={sectionPhotos[2]} 
                  alt="" 
                  className="h-full w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
              {/* セクション見出しバナー */}
              {sections.notFit.heading && (
                <div className="mb-12 flex items-center lg:mb-16" style={{ backgroundColor: '#e5e5e5' }}>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                  <h2 className="flex-1 py-4 pl-6 pr-6 text-left text-xl font-bold sm:text-2xl md:text-3xl lg:text-2xl" style={{ color: '#2c2c2c', fontWeight: 700 }}>
                    {sections.notFit.heading}
                  </h2>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                </div>
              )}
              {sections.notFit.summary && (
                <p className="mb-12 text-xl italic text-gray-600 sm:text-2xl lg:text-xl lg:mb-16">
                  {sections.notFit.summary}
                </p>
              )}
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line text-xl leading-[1.9] text-gray-900 sm:text-2xl md:text-3xl lg:text-xl lg:leading-[2.0]">
                  {sections.notFit.body}
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Proof Section */}
      {sections.proof && (
        <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
              {/* セクション見出しバナー */}
              {sections.proof.heading && (
                <div className="mb-12 flex items-center lg:mb-16" style={{ backgroundColor: '#e5e5e5' }}>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                  <h2 className="flex-1 py-4 pl-6 pr-6 text-left text-xl font-bold sm:text-2xl md:text-3xl lg:text-2xl" style={{ color: '#2c2c2c', fontWeight: 700 }}>
                    {sections.proof.heading}
                  </h2>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                </div>
              )}
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-line text-xl leading-[1.9] text-gray-900 sm:text-2xl md:text-3xl lg:text-xl lg:leading-[2.0]">
                {sections.proof.body}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Human Section - 最後の写真とテキスト */}
      {sections.human && (
        <>
          {sectionPhotos[3] && (
            <section className="relative h-[60vh] overflow-hidden sm:h-[70vh] md:h-[80vh] lg:h-[85vh]">
              <div className="mx-auto max-w-6xl">
                <img 
                  src={sectionPhotos[3]} 
                  alt="" 
                  className="h-full w-full object-cover"
                />
              </div>
            </section>
          )}
          <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
              {/* セクション見出しバナー */}
              {sections.human.heading && (
                <div className="mb-12 flex items-center lg:mb-16" style={{ backgroundColor: '#e5e5e5' }}>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                  <h2 className="flex-1 py-4 pl-6 pr-6 text-left text-xl font-bold sm:text-2xl md:text-3xl lg:text-2xl" style={{ color: '#2c2c2c', fontWeight: 700 }}>
                    {sections.human.heading}
                  </h2>
                  <div className="flex-shrink-0" style={{ width: '4px', backgroundColor: '#8B0000' }}></div>
                </div>
              )}
              {sections.human.summary && (
                <p className="mb-12 text-xl italic text-gray-600 sm:text-2xl lg:text-xl lg:mb-16">
                  {sections.human.summary}
                </p>
              )}
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line text-xl leading-[1.9] text-gray-900 sm:text-2xl md:text-3xl lg:text-xl lg:leading-[2.0]">
                  {sections.human.body}
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-20 sm:py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <h2 className="mb-12 text-3xl font-light text-gray-900 sm:text-4xl md:text-5xl lg:text-3xl lg:mb-16">リンク集</h2>
            <div className="space-y-6 lg:space-y-8">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block border-b border-gray-300 pb-6 transition-colors hover:border-gray-500 lg:pb-8"
                  >
                    <span className="text-xl text-gray-900 group-hover:text-gray-700 sm:text-2xl lg:text-xl">
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="bg-white" textClass="text-gray-900" />
    </div>
  );
}

// ============================================
// L09: パーソナル・親しみやすい - 親しみやすい、人柄重視
// ============================================
function LayoutL09({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Hero - Warm and personal */}
      <section className="bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center text-center text-white">
            {profile.photoUrl && (
              <img
                src={profile.photoUrl}
                alt={profile.name || "プロフィール写真"}
                className="mb-6 h-36 w-36 rounded-full object-cover shadow-2xl ring-4 ring-white/30 sm:h-44 sm:w-44"
              />
            )}
            {profile.name && (
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                {profile.name}
              </h1>
            )}
            {headline && (
              <h2 className="mb-3 text-xl font-semibold text-rose-100 sm:text-2xl md:text-3xl">
                {headline}
              </h2>
            )}
            {tagline && (
              <p className="text-base text-rose-100 sm:text-lg md:text-xl">
                {tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Warm sections */}
      {sections.quick && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <p className="text-lg leading-relaxed text-gray-700">{sections.quick.body}</p>
          </div>
        </section>
      )}

      {sections.reason && (
        <section className="bg-rose-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-4 text-2xl font-bold text-rose-900 sm:text-3xl">{sections.reason.heading}</h2>
            {sections.reason.summary && (
              <p className="mb-6 text-lg text-rose-700">{sections.reason.summary}</p>
            )}
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{sections.reason.body}</p>
          </div>
        </section>
      )}

      {sections.values && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-4 text-2xl font-bold text-rose-900 sm:text-3xl">{sections.values.heading}</h2>
            {sections.values.summary && (
              <p className="mb-6 text-lg text-rose-700">{sections.values.summary}</p>
            )}
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{sections.values.body}</p>
          </div>
        </section>
      )}

      {sections.notFit && (
        <section className="bg-amber-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-4 text-2xl font-bold text-rose-900 sm:text-3xl">{sections.notFit.heading}</h2>
            {sections.notFit.summary && (
              <p className="mb-6 text-lg text-rose-700">{sections.notFit.summary}</p>
            )}
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{sections.notFit.body}</p>
          </div>
        </section>
      )}

      {sections.proof && (
        <section className="bg-rose-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-4 text-2xl font-bold text-rose-900 sm:text-3xl">{sections.proof.heading}</h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{sections.proof.body}</p>
          </div>
        </section>
      )}

      {sections.human && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-4 text-2xl font-bold text-rose-900 sm:text-3xl">{sections.human.heading}</h2>
            {sections.human.summary && (
              <p className="mb-6 text-lg text-rose-700">{sections.human.summary}</p>
            )}
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{sections.human.body}</p>
          </div>
        </section>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="bg-rose-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-2xl font-bold text-rose-900 sm:text-3xl">リンク集</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border-2 border-rose-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-rose-400 hover:bg-rose-50 hover:shadow-md"
                  >
                    <span className="text-base font-semibold text-rose-900 group-hover:text-rose-700">
                      {link.label}
                    </span>
                    <svg className="h-5 w-5 text-rose-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="bg-rose-50" textClass="text-rose-900" />
    </div>
  );
}

// ============================================
// L10: ポートフォリオ・視覚重視 - 写真中心、ポートフォリオ風
// ============================================
function LayoutL10({ profile, generatedJson, slug }: { profile: ProfileData; generatedJson: any; slug: string }) {
  const sections = generatedJson?.sections || {};
  const headline = generatedJson?.headline || profile.headline || "";
  const tagline = generatedJson?.tagline || profile.tagline || "";

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero - Portfolio style with large image */}
      <section className="relative min-h-[80vh] overflow-hidden">
        {profile.photoUrl && (
          <div className="absolute inset-0">
            <img src={profile.photoUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-neutral-900"></div>
          </div>
        )}
        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl items-center px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center text-center text-white">
            {profile.name && (
              <h1 className="mb-4 text-5xl font-bold sm:text-6xl md:text-7xl">
                {profile.name}
              </h1>
            )}
            {headline && (
              <h2 className="mb-3 text-3xl font-light text-neutral-200 sm:text-4xl md:text-5xl">
                {headline}
              </h2>
            )}
            {tagline && (
              <p className="max-w-2xl text-xl text-neutral-300 sm:text-2xl">
                {tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Portfolio-style sections */}
      {sections.quick && (
        <section className="bg-neutral-800 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
            <p className="text-xl leading-relaxed text-neutral-200">{sections.quick.body}</p>
          </div>
        </section>
      )}

      {sections.reason && (
        <section className="bg-neutral-900 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">{sections.reason.heading}</h2>
            {sections.reason.summary && (
              <p className="mb-8 text-lg text-neutral-400">{sections.reason.summary}</p>
            )}
            <p className="whitespace-pre-line text-xl leading-relaxed text-neutral-200">{sections.reason.body}</p>
          </div>
        </section>
      )}

      {sections.values && (
        <section className="bg-neutral-800 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">{sections.values.heading}</h2>
            {sections.values.summary && (
              <p className="mb-8 text-lg text-neutral-400">{sections.values.summary}</p>
            )}
            <p className="whitespace-pre-line text-xl leading-relaxed text-neutral-200">{sections.values.body}</p>
          </div>
        </section>
      )}

      {sections.notFit && (
        <section className="bg-amber-900/20 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">{sections.notFit.heading}</h2>
            {sections.notFit.summary && (
              <p className="mb-8 text-lg text-neutral-400">{sections.notFit.summary}</p>
            )}
            <p className="whitespace-pre-line text-xl leading-relaxed text-neutral-200">{sections.notFit.body}</p>
          </div>
        </section>
      )}

      {sections.proof && (
        <section className="bg-neutral-900 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">{sections.proof.heading}</h2>
            <p className="whitespace-pre-line text-xl leading-relaxed text-neutral-200">{sections.proof.body}</p>
          </div>
        </section>
      )}

      {sections.human && (
        <section className="bg-neutral-800 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">{sections.human.heading}</h2>
            {sections.human.summary && (
              <p className="mb-8 text-lg text-neutral-400">{sections.human.summary}</p>
            )}
            <p className="whitespace-pre-line text-xl leading-relaxed text-neutral-200">{sections.human.body}</p>
          </div>
        </section>
      )}

      {/* Links */}
      {profile.links && profile.links.length > 0 && (
        <section className="bg-neutral-900 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
            <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">リンク集</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profile.links.map((link, index) => {
                const normalizedUrl = link.url?.startsWith("http://") || link.url?.startsWith("https://") 
                  ? link.url 
                  : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border-2 border-neutral-700 bg-neutral-800 p-5 shadow-lg transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-700"
                  >
                    <span className="text-lg font-semibold text-white group-hover:text-neutral-300">
                      {link.label}
                    </span>
                    <svg className="ml-auto h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <ShareSection slug={slug} bgClass="bg-neutral-800" textClass="text-white" />
    </div>
  );
}

// ============================================
// 共通コンポーネント
// ============================================

function ShareSection({ slug, bgClass, textClass, bgStyle, titleColor }: { slug: string; bgClass: string; textClass: string; bgStyle?: React.CSSProperties; titleColor?: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const profileUrl = `${baseUrl}/${slug}`;
  
  return (
    <section className={`${bgClass} py-12`} style={bgStyle}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        <h2 className={`mb-6 text-2xl font-bold ${textClass} sm:text-3xl`} style={titleColor ? { color: titleColor } : {}}>
          この人を紹介する
        </h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <QRCodeDisplay url={profileUrl} />
        </div>
      </div>
    </section>
  );
}
