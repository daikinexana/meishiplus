"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getThemeStyles } from "@/lib/theme-styles";

interface GeneratedContent {
  tone: string;
  themeId: string;
  themeReason: string;
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
    "プロフィール情報を分析中...",
    "テーマを決定中...",
    "文章を生成中...",
    "最終調整中...",
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  // テーマを取得（生成済みの場合はthemeIdを使用、未生成の場合はデフォルト）
  // profile.themeIdを優先（データベースから取得した最新の値）
  const themeId = profile?.themeId || generated?.themeId || null;
  const theme = getThemeStyles(themeId);
  
  // デバッグ用ログ
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[preview] Theme debug:", {
      profileThemeId: profile?.themeId,
      generatedThemeId: generated?.themeId,
      finalThemeId: themeId,
      themeBackground: theme.background,
      themeTextPrimary: theme.textPrimary,
    });
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/top")}
              className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm"
            >
              <svg
                className="h-4 w-4"
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
              topに戻る
            </button>
            <h1 className="text-3xl font-bold text-gray-900">プレビュー</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* 成功メッセージ */}
            {showSuccess && (
              <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 animate-in fade-in slide-in-from-right duration-300">
                <svg
                  className="h-4 w-4"
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
                生成が完了しました
              </div>
            )}
            <div className="flex gap-4">
            {generated && !generating && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={`flex items-center gap-2 rounded px-6 py-2 font-medium text-white transition-all ${
                  profile.isPublished
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-black hover:bg-gray-800"
                } disabled:bg-gray-300 hover:shadow-sm`}
              >
                {publishing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>処理中...</span>
                  </>
                ) : profile.isPublished ? (
                  "非公開にする"
                ) : (
                  "公開する"
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
              <div className="rounded-lg bg-white p-12 text-center shadow-sm animate-in fade-in duration-300">
                <div className="mb-6">
                  {/* スピナー */}
                  <div className="mx-auto mb-6 h-20 w-20">
                    <div className="relative h-full w-full">
                      <div className="absolute inset-0 h-full w-full animate-spin rounded-full border-4 border-gray-100"></div>
                      <div className="absolute inset-0 h-full w-full animate-spin rounded-full border-4 border-transparent border-t-black border-r-black" style={{ animationDuration: '1s' }}></div>
                    </div>
                  </div>
                  {/* 進捗メッセージ */}
                  <p className="text-xl font-semibold text-gray-900 mb-2">
                    {generationSteps[generationStep]}
                  </p>
                  <p className="text-sm text-gray-500">
                    通常30秒〜1分程度かかります
                  </p>
                </div>
                {/* プログレスバー */}
                <div className="mx-auto h-2.5 w-full max-w-md overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-gradient-to-r from-black to-gray-800 transition-all duration-1000 ease-out shadow-sm"
                    style={{
                      width: `${((generationStep + 1) / generationSteps.length) * 100}%`,
                    }}
                  ></div>
                </div>
                {/* ステップインジケーター */}
                <div className="mt-6 flex justify-center gap-2">
                  {generationSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index <= generationStep
                          ? "bg-black scale-125"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* スケルトンローディング（生成中のプレビュー） */}
            {generating && (
              <div className="space-y-8 animate-pulse">
                {/* Hero スケルトン */}
                <div className="rounded-lg bg-white p-8 shadow-sm">
                  <div className="h-8 w-64 mb-4 bg-gray-200 rounded"></div>
                  <div className="h-6 w-96 bg-gray-200 rounded"></div>
                </div>

                {/* Quick Profile スケルトン */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Reason スケルトン */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="h-7 w-48 mb-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 mb-4 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Values スケルトン */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="h-7 w-48 mb-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 mb-4 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Not Fit スケルトン */}
                <div className="rounded-lg bg-white p-6 shadow-sm border-2 border-gray-200">
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
              <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                <p className="mb-4 text-gray-600">
                  まだ生成されていません。生成ボタンをクリックしてください。
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="rounded bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300"
                >
                  生成する
                </button>
              </div>
            )}
          </div>
        ) : (
          (() => {
            // 生成済みコンテンツ表示時も、最新のprofile.themeIdを使用
            const displayThemeId = profile?.themeId || generated?.themeId || null;
            const theme = getThemeStyles(displayThemeId);
            
            if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
              console.log("[preview] Display theme:", {
                profileThemeId: profile?.themeId,
                generatedThemeId: generated?.themeId,
                displayThemeId,
                themeBackground: theme.background,
              });
            }
            
            return (
              <div className={`space-y-8 animate-in fade-in duration-500 ${theme.background}`}>
                {/* Hero */}
                <div className={`rounded-lg ${theme.cardBg} p-8 ${theme.shadow} ${theme.heroBg || theme.cardBg}`}>
                  <h1 className={`mb-2 text-4xl font-bold ${theme.textPrimary}`}>
                    {profile.name || "プロフィール"}
                  </h1>
                  {profile.tagline && (
                    <p className={`text-xl ${theme.textSecondary}`}>{profile.tagline}</p>
                  )}
                </div>

                {/* Quick Profile */}
                {generated.sections.quick && (
                  <div className={`rounded-lg ${theme.cardBg} p-6 ${theme.shadow}`}>
                    <p className={`${theme.textPrimary} leading-relaxed`}>
                      {generated.sections.quick.body}
                    </p>
                  </div>
                )}

                {/* Reason */}
                {generated.sections.reason && (
                  <div className={`rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
                    <h2 className={`mb-2 text-2xl font-semibold ${theme.textPrimary}`}>
                      {generated.sections.reason.heading}
                    </h2>
                    <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                      {generated.sections.reason.summary}
                    </p>
                    <p className={`${theme.textPrimary} leading-relaxed`}>
                      {generated.sections.reason.body}
                    </p>
                  </div>
                )}

                {/* Values */}
                {generated.sections.values && (
                  <div className={`rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
                    <h2 className={`mb-2 text-2xl font-semibold ${theme.textPrimary}`}>
                      {generated.sections.values.heading}
                    </h2>
                    <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                      {generated.sections.values.summary}
                    </p>
                    <p className={`${theme.textPrimary} leading-relaxed`}>
                      {generated.sections.values.body}
                    </p>
                  </div>
                )}

                {/* Not Fit */}
                {generated.sections.notFit && (
                  <div className={`rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border-2 ${theme.border}`}>
                    <h2 className={`mb-2 text-2xl font-semibold ${theme.textPrimary}`}>
                      {generated.sections.notFit.heading}
                    </h2>
                    <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                      {generated.sections.notFit.summary}
                    </p>
                    <p className={`${theme.textPrimary} leading-relaxed`}>
                      {generated.sections.notFit.body}
                    </p>
                  </div>
                )}

                {/* Proof */}
                {generated.sections.proof && (
                  <div className={`rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
                    <h2 className={`mb-4 text-2xl font-semibold ${theme.textPrimary}`}>
                      {generated.sections.proof.heading}
                    </h2>
                    <p className={`${theme.textPrimary} leading-relaxed`}>
                      {generated.sections.proof.body}
                    </p>
                  </div>
                )}

                {/* Human */}
                {generated.sections.human && (
                  <div className={`rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
                    <h2 className={`mb-2 text-2xl font-semibold ${theme.textPrimary}`}>
                      {generated.sections.human.heading}
                    </h2>
                    <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                      {generated.sections.human.summary}
                    </p>
                    <p className={`${theme.textPrimary} leading-relaxed`}>
                      {generated.sections.human.body}
                    </p>
                  </div>
                )}

                {/* Links */}
                {profile.links && profile.links.length > 0 && (
                  <div className={`rounded-lg ${theme.cardBg} p-6 ${theme.shadow} border ${theme.border}`}>
                    <h2 className={`mb-4 text-2xl font-semibold ${theme.textPrimary}`}>
                      リンク
                    </h2>
                    <div className="space-y-2">
                      {profile.links.map((link: any, index: number) => (
                        <a
                          key={index}
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
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
