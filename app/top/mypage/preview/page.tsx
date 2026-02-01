"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplates } from "@/app/[slug]/components/LayoutTemplates";

interface GeneratedContent {
  tone: string;
  themeId: string;
  themeReason: string;
  headline?: string;
  tagline?: string;
  sections: {
    quick: { body: string };
    reason: { heading: string; summary: string; body: string };
    values: { heading: string; summary: string; body: string };
    notFit: { heading: string; summary: string; body: string };
    proof: { heading: string; body: string };
    human: { heading: string; summary: string; body: string };
  };
}

export default function PreviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const generationSteps = [
    {
      title: "プロフィール情報を分析中",
      description: "入力内容を読み込んでいます",
      icon: "📊"
    },
    {
      title: "最適なテーマを選定中",
      description: "あなたにぴったりのデザインを選んでいます",
      icon: "🎨"
    },
    {
      title: "魅力的な文章を生成中",
      description: "AIが紹介記事を作成しています",
      icon: "✨"
    },
    {
      title: "最終調整中",
      description: "仕上げの調整を行っています",
      icon: "🎯"
    },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  // URLパラメータで自動生成を開始
  useEffect(() => {
    if (typeof window === "undefined" || loading) return;
    
    const params = new URLSearchParams(window.location.search);
    const autoGenerate = params.get("autoGenerate") === "true";
    
    // autoGenerate=trueの場合、既に生成済みでも再生成する（エディターページからの編集を反映）
    if (autoGenerate && !generating && profile) {
      // 少し待ってから自動生成を開始（UX向上のため）
      const timer = setTimeout(() => {
        handleGenerate();
        // URLからパラメータを削除
        window.history.replaceState({}, "", "/top/mypage/preview");
      }, 800);
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, loading, generating]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile/me");
      if (res.status === 404 || res.status === 503) {
        // プロフィールが存在しない場合は/topに戻る
        router.push("/top");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await res.json();
      if (data.profile) {
        console.log("[preview] Fetched profile with themeId:", data.profile.themeId);
        setProfile(data.profile);
        if (data.profile.generatedJson) {
          setGenerated(data.profile.generatedJson as GeneratedContent);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // エラー時は/topに戻る
      router.push("/top");
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStep(0);

    // 進捗表示のアニメーション
    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000); // 2秒ごとに次のステップへ

    try {
      const res = await fetch("/api/profile/generate", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to generate");
      }

      const data = await res.json();
      
      // 成功時は最後のステップを表示
      setGenerationStep(generationSteps.length - 1);
      
      // 少し待ってからコンテンツを更新
      setTimeout(async () => {
        // 生成されたコンテンツを設定
        setGenerated(data.generated);
        
        // プロフィールを最新の状態で再取得（themeIdを含む）
        try {
          const profileRes = await fetch("/api/profile/me");
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.profile) {
              console.log("[preview] Updated profile with themeId:", profileData.profile.themeId);
              setProfile(profileData.profile);
            }
          }
        } catch (error) {
          console.error("Error fetching updated profile:", error);
          // エラー時はレスポンスのプロフィールを使用
          if (data.profile) {
            setProfile(data.profile);
          }
        }
        
        setGenerating(false);
        setGenerationStep(0);
        setShowSuccess(true);
        
        // 3秒後に成功メッセージを非表示
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }, 800);
    } catch (error) {
      console.error("Error:", error);
      clearInterval(stepInterval);
      setGenerating(false);
      setGenerationStep(0);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      clearInterval(stepInterval);
    }
  };

  const handlePublish = async () => {
    if (!generated) {
      alert("まず生成を実行してください");
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/profile/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !profile.isPublished }),
      });

      if (!res.ok) {
        throw new Error("Failed to publish");
      }

      const data = await res.json();
      setProfile(data.profile);
      alert(
        data.profile.isPublished
          ? "公開しました"
          : "非公開にしました"
      );
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
          <p className="text-base font-medium text-gray-600 sm:text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
        {/* ヘッダー */}
        <div className="mb-10">
          <div className="mb-4 inline-block">
            <h1 className="text-5xl font-light tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              Preview
            </h1>
            <div className="mt-2 h-0.5 w-full bg-gradient-to-r from-gray-900 via-gray-700 to-transparent"></div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => router.push("/top")}
              className="group flex w-fit items-center gap-2 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:px-5 sm:py-3"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-1 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">topに戻る</span>
              <span className="sm:hidden">戻る</span>
            </button>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* 成功メッセージ */}
              {showSuccess && (
                <div className="flex items-center gap-2 rounded-xl border-2 border-green-200/60 bg-white/90 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-green-700 shadow-md animate-fade-in sm:px-5 sm:py-3">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>生成が完了しました</span>
                </div>
              )}
              {generated && !generating && (
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className={`group flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:px-8 sm:py-3 sm:text-base ${
                    profile.isPublished
                      ? "bg-gradient-to-r from-gray-600 to-gray-700"
                      : "bg-gradient-to-r from-gray-900 to-gray-800"
                  }`}
                >
                  {publishing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>処理中...</span>
                    </>
                  ) : profile.isPublished ? (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span>非公開にする</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>公開する</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {!generated || generating ? (
          <div className="space-y-8">
            {/* 生成中のローディングUI */}
            {generating && (
              <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 text-center shadow-lg shadow-gray-200/20 transition-all hover:shadow-xl hover:shadow-gray-300/30 sm:p-12 md:p-16">
                {/* メインアイコン */}
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl sm:h-28 sm:w-28">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 h-full w-full animate-spin rounded-full border-4 border-white/30"></div>
                    <div className="absolute inset-0 h-full w-full animate-spin rounded-full border-4 border-transparent border-t-white border-r-white" style={{ animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-10 w-10 text-white sm:h-12 sm:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 現在のステップ */}
                <div className="mb-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-600"></span>
                    </span>
                    <span>ステップ {generationStep + 1} / {generationSteps.length}</span>
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {generationSteps[generationStep].icon} {generationSteps[generationStep].title}
                  </h2>
                  <p className="text-base text-gray-600 sm:text-lg">
                    {generationSteps[generationStep].description}
                  </p>
                </div>

                {/* プログレスバー */}
                <div className="mx-auto mb-6 h-3 w-full max-w-md overflow-hidden rounded-full bg-gray-100 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-gray-900 to-gray-800 transition-all duration-1000 ease-out shadow-sm"
                    style={{
                      width: `${((generationStep + 1) / generationSteps.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* ステップインジケーター */}
                <div className="flex justify-center gap-3">
                  {generationSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                        index <= generationStep ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300 sm:h-12 sm:w-12 ${
                          index < generationStep
                            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg scale-110"
                            : index === generationStep
                            ? "bg-gradient-to-br from-gray-700 to-gray-600 text-white shadow-md scale-110 animate-pulse"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {index < generationStep ? (
                          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm sm:text-base">{step.icon}</span>
                        )}
                      </div>
                      <p className={`hidden text-xs font-medium sm:block ${
                        index === generationStep ? "text-gray-900" : "text-gray-500"
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 補足メッセージ */}
                <p className="mt-8 text-sm text-gray-500">
                  通常30秒〜1分程度かかります。しばらくお待ちください。
                </p>
              </div>
            )}

            {/* スケルトンローディング（生成中のプレビュー） */}
            {generating && (
              <div className="space-y-8 animate-pulse">
                {/* Hero スケルトン */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-sm">
                  <div className="h-8 w-64 mb-4 bg-gray-200 rounded"></div>
                  <div className="h-6 w-96 bg-gray-200 rounded"></div>
                </div>

                {/* Quick Profile スケルトン */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Reason スケルトン */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
                  <div className="h-7 w-48 mb-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 mb-4 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Values スケルトン */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
                  <div className="h-7 w-48 mb-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 mb-4 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Not Fit スケルトン */}
                <div className="rounded-2xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
                  <div className="h-7 w-56 mb-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 mb-4 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            )}

            {/* 未生成時のメッセージ */}
            {!generating && (
              <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 text-center shadow-lg shadow-gray-200/20 transition-all hover:shadow-xl hover:shadow-gray-300/30 sm:p-12 md:p-16">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg sm:h-20 sm:w-20">
                  <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  プロフィールを生成しましょう
                </h2>
                <p className="mx-auto mb-8 max-w-md text-base text-gray-600 sm:text-lg">
                  入力内容をもとに、<br className="sm:hidden" />
                  AIが魅力的なプロフィールページを生成します
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-gray-900/30 transition-all hover:scale-105 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl hover:shadow-gray-900/40 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 active:scale-95 sm:px-10 sm:py-4 sm:text-lg"
                >
                  <svg
                    className="h-5 w-5 transition-transform group-hover:rotate-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>生成する</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <LayoutTemplates
            profile={{
              name: profile?.name || undefined,
              photoUrl: profile?.photoUrl || undefined,
              photoUrls: profile?.photoUrls || undefined,
              headline: profile?.headline || undefined,
              tagline: profile?.tagline || undefined,
              links: profile?.links?.map((link: any) => ({ label: link.label, url: link.url })) || [],
              layoutTemplateId: profile?.layoutTemplateId || undefined,
            }}
            generatedJson={generated}
            slug={profile?.slug || ""}
          />
        )}
      </div>
    </div>
  );
}
