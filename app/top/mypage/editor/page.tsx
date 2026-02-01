"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllLayoutTemplates, type LayoutTemplate } from "@/lib/layout-templates";

// ヘルプ説明コンポーネント
function HelpTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.help-tooltip-container')) {
          setIsOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="help-tooltip-container relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="group flex items-center justify-center transition-colors"
        aria-label="ヘルプを表示"
      >
        {children}
      </button>
      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-72 rounded-xl bg-white p-4 text-sm text-gray-700 shadow-xl border-2 border-gray-100 animate-fade-in sm:w-80 sm:right-auto sm:left-0">
          <p className="leading-relaxed">{content}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="閉じる"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}


// 仕様書に基づく選択肢
const AUDIENCE_OPTIONS = [
  "見込み顧客",
  "既存顧客",
  "紹介者",
  "採用・協業",
  "投資家・起業家",
];

const IMPRESSION_TAGS_OPTIONS = [
  "誠実",
  "論理的",
  "落ち着き",
  "親しみ",
  "丁寧",
  "知的",
  "温かい",
  "情熱",
  "フラット",
  "クール",
];

interface ProfileData {
  role?: string;
  audience?: string;
  impressionTags?: string[];
  name?: string;
  photoUrl?: string;
  photoUrls?: string[];
  headline?: string;
  tagline?: string;
  whoHelp?: string;
  situation?: string;
  reasonText?: string;
  valueText?: string;
  notFitText?: string;
  experienceTags?: string[];
  commonQuestions?: string[];
  humanText?: string;
  links?: Array<{ id?: string; label: string; url: string; order: number }>;
  layoutTemplateId?: string;
}

export default function EditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showGitHubForm, setShowGitHubForm] = useState(false);
  const [gitHubUsername, setGitHubUsername] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [data, setData] = useState<ProfileData>({
    role: "",
    audience: "",
    impressionTags: [],
    name: "",
    photoUrls: [],
    headline: "",
    tagline: "",
    whoHelp: "",
    situation: "",
    reasonText: "",
    valueText: "",
    notFitText: "",
    experienceTags: [""], // 初期状態で1つのフィールドを表示
    commonQuestions: [""], // 初期状態で1つのフィールドを表示
    humanText: "",
    links: [],
    layoutTemplateId: "L01", // デフォルトはL01
  });

  useEffect(() => {
    // プロフィールデータを取得
    fetch("/api/profile/me")
      .then((res) => {
        if (res.status === 404 || res.status === 503) {
          // プロフィールが存在しない場合は新規作成モード（データは空のまま）
          setLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        return res.json();
      })
      .then((result) => {
        if (result && result.profile) {
          setData({
            role: result.profile.role || "",
            audience: result.profile.audience || "",
            impressionTags: result.profile.impressionTags || [],
            name: result.profile.name || "",
            photoUrl: result.profile.photoUrl || "",
            photoUrls: result.profile.photoUrls || [],
            headline: result.profile.headline || "",
            tagline: result.profile.tagline || "",
            whoHelp: result.profile.whoHelp || "",
            situation: result.profile.situation || "",
            reasonText: result.profile.reasonText || "",
            valueText: result.profile.valueText || "",
            notFitText: result.profile.notFitText || "",
            // 既存データがある場合はそれを使用、ない場合は初期値として空文字列1つを設定
            experienceTags: result.profile.experienceTags && result.profile.experienceTags.length > 0 
              ? result.profile.experienceTags 
              : [""],
            commonQuestions: result.profile.commonQuestions && result.profile.commonQuestions.length > 0
              ? result.profile.commonQuestions
              : [""],
            humanText: result.profile.humanText || "",
            links: result.profile.links || [],
            layoutTemplateId: result.profile.layoutTemplateId || "L01",
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        // エラー時も新規作成モードとして続行
        setLoading(false);
      });
  }, [router]);

  const handleSave = async (autoGenerate = false) => {
    setSaving(true);
    try {
      // まずプロフィールが存在するか確認
      let checkRes;
      try {
        checkRes = await fetch("/api/profile/me");
      } catch (error) {
        console.error("Error checking profile:", error);
        throw new Error("プロフィールの確認中にエラーが発生しました。ネットワーク接続を確認してください。");
      }

      const isNewProfile = checkRes.status === 404;

      if (isNewProfile) {
        // プロフィールが存在しない場合は作成
        let createRes;
        try {
          createRes = await fetch("/api/profile/create", {
            method: "POST",
          });
        } catch (error) {
          console.error("Error creating profile:", error);
          throw new Error("プロフィールの作成中にエラーが発生しました。");
        }

        if (!createRes.ok && createRes.status !== 400) {
          // 400の場合は既に存在する（競合状態）
          const errorData = await createRes.json().catch(() => ({}));
          console.error("Failed to create profile:", errorData);
          throw new Error(errorData.error || "プロフィールの作成に失敗しました");
        }
      }

      // プロフィールを更新（または作成後の更新）
      let res;
      try {
        res = await fetch("/api/profile/update", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error("プロフィールの更新中にエラーが発生しました。ネットワーク接続を確認してください。");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to update profile:", errorData);
        throw new Error(errorData.error || "プロフィールの更新に失敗しました");
      }

      if (autoGenerate) {
        // 保存して生成の場合、プレビューページに遷移して自動生成を開始
        router.push("/top/mypage/preview?autoGenerate=true");
      } else {
        // 通常の保存の場合、トップページに戻る
        alert("保存しました");
        router.push("/top");
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      const errorMessage = error instanceof Error ? error.message : "エラーが発生しました。もう一度お試しください。";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const addExperienceTag = () => {
    if (data.experienceTags && data.experienceTags.length < 3) {
      setData({
        ...data,
        experienceTags: [...(data.experienceTags || []), ""],
      });
    }
  };

  const updateExperienceTag = (index: number, value: string) => {
    const tags = [...(data.experienceTags || [])];
    tags[index] = value;
    setData({ ...data, experienceTags: tags });
  };

  const removeExperienceTag = (index: number) => {
    const tags = [...(data.experienceTags || [])];
    tags.splice(index, 1);
    setData({ ...data, experienceTags: tags });
  };

  const addCommonQuestion = () => {
    if (data.commonQuestions && data.commonQuestions.length < 3) {
      setData({
        ...data,
        commonQuestions: [...(data.commonQuestions || []), ""],
      });
    }
  };

  const updateCommonQuestion = (index: number, value: string) => {
    const questions = [...(data.commonQuestions || [])];
    questions[index] = value;
    setData({ ...data, commonQuestions: questions });
  };

  const removeCommonQuestion = (index: number) => {
    const questions = [...(data.commonQuestions || [])];
    questions.splice(index, 1);
    setData({ ...data, commonQuestions: questions });
  };

  const addLink = () => {
    if (data.links && data.links.length < 5) {
      setData({
        ...data,
        links: [
          ...(data.links || []),
          { label: "", url: "", order: data.links.length },
        ],
      });
    }
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    const links = [...(data.links || [])];
    links[index] = { ...links[index], [field]: value };
    setData({ ...data, links });
  };

  const removeLink = (index: number) => {
    const links = [...(data.links || [])];
    links.splice(index, 1);
    setData({ ...data, links });
  };

  const handleImageUpload = async (index: number, file: File) => {
    // ファイルサイズチェック（制限なし）
    // if (file.size > 5 * 1024 * 1024) {
    //   alert("ファイルサイズは5MB以下にしてください");
    //   return;
    // }

    // ファイルタイプチェック
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    setUploadingIndex(index);

    try {
      // 署名付きURLを取得
      const response = await fetch("/api/upload/photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "アップロードURLの取得に失敗しました");
      }

      const { signedUrl, publicUrl } = await response.json();

      if (!signedUrl) {
        throw new Error("署名付きURLの取得に失敗しました");
      }

      console.log("署名付きURLを取得しました:", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        signedUrlLength: signedUrl.length,
      });

      // S3に直接アップロード
      try {
        console.log("S3へのアップロードを開始します...");
        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          const errorDetails = {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            error: errorText,
            headers: Object.fromEntries(uploadResponse.headers.entries()),
            signedUrl: signedUrl.substring(0, 200) + "...", // URLの一部のみログ出力
            fileType: file.type,
            fileName: file.name,
            fileSize: file.size,
          };
          console.error("S3アップロードエラー:", errorDetails);
          
          // エラーメッセージをより詳細に
          let errorMessage = `S3へのアップロードに失敗しました (${uploadResponse.status}: ${uploadResponse.statusText})`;
          if (errorText) {
            try {
              const errorJson = JSON.parse(errorText);
              if (errorJson.Message) {
                errorMessage += `: ${errorJson.Message}`;
              } else if (errorJson.message) {
                errorMessage += `: ${errorJson.message}`;
              }
            } catch {
              // JSONパースに失敗した場合は、そのままテキストを使用
              if (errorText.length < 200) {
                errorMessage += `: ${errorText}`;
              }
            }
          }
          
          throw new Error(errorMessage);
        }
      } catch (fetchError) {
        // より詳細なエラー情報を取得
        const errorDetails: any = {
          error: fetchError,
          errorType: fetchError?.constructor?.name,
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          stack: fetchError instanceof Error ? fetchError.stack : undefined,
          signedUrl: signedUrl ? signedUrl.substring(0, 100) + "..." : "N/A",
        };

        // ネットワークエラーの場合、追加情報を取得
        if (fetchError instanceof TypeError && fetchError.message === "Failed to fetch") {
          errorDetails.networkError = true;
          errorDetails.possibleCauses = [
            "CORS設定が正しくない可能性があります",
            "S3バケットのCORS設定を確認してください",
            "ネットワーク接続の問題の可能性があります",
          ];
        }

        console.error("Fetch error details:", errorDetails);
        throw new Error(
          `S3への接続に失敗しました: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`
        );
      }

      // アップロード成功後、URLをデータに保存
      const newPhotoUrls = [...(data.photoUrls || [])];
      newPhotoUrls[index] = publicUrl;
      setData({ ...data, photoUrls: newPhotoUrls });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error instanceof Error ? error.message : "画像のアップロードに失敗しました");
    } finally {
      setUploadingIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
          <p className="text-base font-medium text-gray-600 sm:text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
          {/* ヘッダー */}
          <div className="mb-10">
            <div className="mb-4 inline-block">
              <h1 className="text-5xl font-light tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
                Editor
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
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={() => router.push("/top/mypage/preview")}
                  className="group flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>プレビュー</span>
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/30 transition-all hover:scale-105 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl hover:shadow-gray-900/40 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 active:scale-95 sm:px-8 sm:py-3 sm:text-base"
                >
                  {saving ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
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
                      <span>保存して生成</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        {/* 説明バナー */}
        <div className="mb-8 rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-sm p-6 shadow-md shadow-gray-200/20 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm sm:h-14 sm:w-14">
              <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                完璧な文章は不要です。殴り書きでOK！
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                箇条書きや話し言葉、メモ感覚で大丈夫です。入力内容をもとに、<span className="font-semibold text-gray-900">Meishi+ AI</span>が自動で魅力的なプロフィールページを生成します。営業臭を排除し、第三者が安心して紹介できる表現に整えます。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* 最初の3つの質問 */}
          <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-gray-200/20 transition-all hover:shadow-xl hover:shadow-gray-300/30 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm sm:h-14 sm:w-14">
                <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  基本設定
                </h2>
                  <HelpTooltip content="プロフィールページの基本となる情報を設定します。これらの情報は、AIが紹介文を生成する際の重要な要素となります。">
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </HelpTooltip>
              </div>
            </div>
            <div className="space-y-6">
              {/* Role */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="block text-sm font-semibold text-gray-900 sm:text-base">
                    役割・職業
                  </label>
                  <HelpTooltip content="あなたの職業や役割を簡潔に記入してください。見る人が「この人は何をする人か」をすぐに理解できるように、具体的な職種や肩書きを書くと良いでしょう。">
                    <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </HelpTooltip>
                </div>
                <input
                  type="text"
                  value={data.role}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                  placeholder="例：フリーランスデザイナー、不動産エージェント、スタートアップ経営者、コンサルタント、保険営業、VCパートナーなど"
                  className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
                />
                <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                  例：フリーランスWebデザイナー、不動産エージェント、スタートアップ経営者
                </p>
              </div>

              {/* Audience */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <label className="block text-sm font-semibold text-gray-900 sm:text-base">
                    主な対象者
                  </label>
                  <HelpTooltip content="このプロフィールページを見る主な相手を選んでください。選んだ対象者に合わせて、AIが適切なトーンと内容で紹介文を生成します。">
                    <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </HelpTooltip>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {AUDIENCE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all duration-300 ${
                        data.audience === option
                          ? "border-gray-900 bg-gray-50 shadow-md"
                          : "border-gray-200/60 bg-white/80 backdrop-blur-sm hover:border-gray-300 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      <input
                        type="radio"
                        name="audience"
                        value={option}
                        checked={data.audience === option}
                        onChange={(e) => setData({ ...data, audience: e.target.value })}
                        className="h-4 w-4 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                      />
                      <span className="text-sm font-medium text-gray-900 sm:text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Impression Tags */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-semibold text-gray-900 sm:text-base">
                      どんな印象を与えたいですか？
                    </label>
                    <HelpTooltip content="あなたが相手に与えたい印象を最大3つ選んでください。選んだ印象に合わせて、AIが紹介文のトーンや表現を調整します。複数選ぶことで、より多面的な印象を伝えられます。">
                      <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </HelpTooltip>
                  </div>
                  <span className="text-xs font-medium text-gray-500 sm:text-sm">
                    選択中: {data.impressionTags?.length || 0}/3
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {IMPRESSION_TAGS_OPTIONS.map((tag) => {
                    const isSelected = data.impressionTags?.includes(tag) || false;
                    const canSelect = !isSelected && (data.impressionTags?.length || 0) < 3;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setData({
                              ...data,
                              impressionTags: data.impressionTags?.filter((t) => t !== tag) || [],
                            });
                          } else if (canSelect) {
                            setData({
                              ...data,
                              impressionTags: [...(data.impressionTags || []), tag],
                            });
                          }
                        }}
                        disabled={!canSelect && !isSelected}
                        className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                          isSelected
                            ? "border-gray-900 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md"
                            : "border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-700 hover:border-gray-300 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* テンプレート選択 */}
          <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-gray-200/20 transition-all hover:shadow-xl hover:shadow-gray-300/30 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm sm:h-14 sm:w-14">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  テンプレート
                </h2>
                <HelpTooltip content="プロフィールページのデザインテンプレートを選択できます。8種類の異なるスタイルから、あなたの印象に合ったレイアウトを選んでください。">
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </HelpTooltip>
              </div>
            </div>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getAllLayoutTemplates().map((template) => {
                const isSelected = data.layoutTemplateId === template.id;
                // 特徴タグを最大2つまで表示
                const displayFeatures = template.features.slice(0, 2);
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setData({ ...data, layoutTemplateId: template.id })}
                    className="group block h-full text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {/* カード */}
                    <div className={`flex h-full min-h-[180px] flex-col overflow-hidden rounded-lg border transition-all sm:min-h-[200px] ${
                      isSelected
                        ? "border-gray-900 bg-white shadow-xl ring-2 ring-gray-900 ring-offset-2"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
                    }`}>
                      {/* カードヘッダー */}
                      <div className={`shrink-0 border-b px-4 py-3 transition-colors sm:px-5 sm:py-3.5 ${
                        isSelected
                          ? "border-gray-300 bg-gray-100"
                          : "border-gray-200 bg-gray-50 group-hover:bg-gray-100"
                      }`}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-900 sm:text-sm">{template.id}</span>
                          {isSelected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white shadow-sm">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h3 className="line-clamp-1 text-xs font-light text-gray-900 sm:text-sm lg:text-base">{template.name}</h3>
                      </div>
                      
                      {/* カード本文 */}
                      <div className="flex min-h-0 flex-1 flex-col px-4 py-3 sm:px-5 sm:py-3.5">
                        <p className="mb-3 line-clamp-2 flex-shrink-0 text-xs leading-snug text-gray-600 sm:text-sm sm:leading-relaxed">{template.description}</p>
                        
                        {/* 特徴タグ */}
                        <div className="mt-auto flex flex-wrap gap-1.5">
                          {displayFeatures.map((feature, index) => (
                            <span
                              key={index}
                              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                            >
                              {feature}
                            </span>
                          ))}
                          {template.features.length > 2 && (
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                              +{template.features.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 画像アップロード */}
          <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-gray-200/20 transition-all hover:shadow-xl hover:shadow-gray-300/30 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm sm:h-14 sm:w-14">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  画像
                </h2>
                <HelpTooltip content="プロフィールページに表示する画像を最大5枚までアップロードできます。画像URLを入力してください。">
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </HelpTooltip>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 5 }).map((_, index) => {
                  const photoUrl = data.photoUrls?.[index] || "";
                  return (
                    <div key={index} className="group relative">
                      <div className={`flex h-48 flex-col overflow-hidden rounded-lg border-2 transition-all ${
                        photoUrl
                          ? "border-gray-300 bg-gray-50"
                          : "border-dashed border-gray-200 bg-gray-50/50"
                      }`}>
                        {photoUrl ? (
                          <>
                            <div className="relative h-40 w-full overflow-hidden">
                              <img
                                src={photoUrl}
                                alt={`画像 ${index + 1}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E画像エラー%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPhotoUrls = [...(data.photoUrls || [])];
                                  newPhotoUrls.splice(index, 1);
                                  setData({ ...data, photoUrls: newPhotoUrls });
                                }}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex-1 p-2">
                              <input
                                type="url"
                                value={photoUrl}
                                onChange={(e) => {
                                  const newPhotoUrls = [...(data.photoUrls || [])];
                                  newPhotoUrls[index] = e.target.value;
                                  setData({ ...data, photoUrls: newPhotoUrls });
                                }}
                                placeholder="画像URL"
                                className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center p-4">
                            {uploadingIndex === index ? (
                              <div className="flex flex-col items-center justify-center">
                                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
                                <p className="text-xs text-gray-500">アップロード中...</p>
                              </div>
                            ) : (
                              <>
                                <label className="mb-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-100">
                                  <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  <span className="text-xs">ファイルを選択</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleImageUpload(index, file);
                                      }
                                    }}
                                  />
                                </label>
                                <div className="mt-2 w-full border-t border-gray-200"></div>
                                <input
                                  type="url"
                                  value=""
                                  onChange={(e) => {
                                    const newPhotoUrls = [...(data.photoUrls || [])];
                                    newPhotoUrls[index] = e.target.value;
                                    setData({ ...data, photoUrls: newPhotoUrls });
                                  }}
                                  placeholder="またはURLを入力"
                                  className="mt-2 w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                                />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 sm:text-sm">
                ファイルを選択してアップロードするか、画像URLを入力してください。最大5枚まで、各ファイル5MB以下。
              </p>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-gray-200/20 transition-all hover:shadow-xl hover:shadow-gray-300/30 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm sm:h-14 sm:w-14">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  基本情報
                </h2>
                  <HelpTooltip content="プロフィールページの上部に表示される基本情報です。名前、見出し、タグラインは、訪問者が最初に目にする重要な要素です。">
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </HelpTooltip>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="block text-sm font-semibold text-gray-900 sm:text-base">
                    名前
                  </label>
                  <HelpTooltip content="あなたの本名や活動名を記入してください。名刺に書く名前と同じで構いません。">
                    <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </HelpTooltip>
                </div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="あなたの名前"
                  className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
                />
                <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                  例：山田 太郎、Yamada Taro、株式会社○○代表取締役 山田太郎
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="block text-sm font-semibold text-gray-900 sm:text-base">
                    見出し
                  </label>
                  <HelpTooltip content="あなたの職業や肩書きを簡潔に表現してください。名刺の肩書きと同じで構いません。">
                    <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </HelpTooltip>
                </div>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) =>
                    setData({ ...data, headline: e.target.value })
                  }
                  placeholder="例：フリーランスデザイナー、コンサルタントなど"
                  className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
                />
                <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                  例：フリーランスWebデザイナー、経営コンサルタント、不動産エージェント、スタートアップ経営者
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="block text-sm font-semibold text-gray-900 sm:text-base">
                    タグライン
                  </label>
                  <HelpTooltip content="あなたの価値観や仕事への想いを一言で表現してください。短く、印象に残るフレーズが理想的です。">
                    <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </HelpTooltip>
                </div>
                <input
                  type="text"
                  value={data.tagline}
                  onChange={(e) =>
                    setData({ ...data, tagline: e.target.value })
                  }
                  placeholder="短いキャッチフレーズ"
                  className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
                />
                <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                  例：「デザインで事業を成長させる」「経営課題を解決するパートナー」「理想の住まいを見つけるお手伝い」
                </p>
              </div>
            </div>
          </div>

          {/* 誰を助けるか */}
          <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-gray-200/20 transition-all hover:shadow-xl hover:shadow-gray-300/30 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                どのような方々をサポートしていますか？
              </h2>
              <HelpTooltip content="あなたのサービスや専門性を必要とする人を具体的に記入してください。例えば「スタートアップ経営者」「個人事業主」「不動産購入を検討している方」など。具体的であればあるほど、見る人が「自分に当てはまるか」を判断しやすくなります。">
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </HelpTooltip>
            </div>
            <textarea
              value={data.whoHelp}
              onChange={(e) => setData({ ...data, whoHelp: e.target.value })}
              placeholder="例：スタートアップ経営者、個人事業主など"
              rows={3}
              className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
            />
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              例：スタートアップ経営者、個人事業主、不動産購入を検討している方、資金調達を考えている経営者
            </p>
          </div>

          {/* どんな状況で頼まれるか */}
          <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                どんな状況で頼まれますか？
              </h2>
              <HelpTooltip content="相手がどのようなタイミングや状況で、あなたに相談や依頼をしてくるかを記入してください。例えば「事業拡大のタイミング」「資金調達を考えている時」「新しいオフィスを探している時」など。具体的な状況を書くことで、見る人が「今まさに自分に必要な人だ」と気づきやすくなります。">
                <svg className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </HelpTooltip>
            </div>
            <textarea
              value={data.situation}
              onChange={(e) => setData({ ...data, situation: e.target.value })}
              placeholder="例：事業拡大のタイミング、資金調達を考えている時など"
              rows={3}
              className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
            />
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              例：事業拡大のタイミング、資金調達を考えている時、新しいオフィスを探している時、組織の課題に直面している時
            </p>
          </div>

          {/* この仕事をしている理由 */}
          <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                今の仕事をしている理由
              </h2>
              <HelpTooltip content="なぜこの仕事を選んだのか、どんな想いで取り組んでいるのかを記入してください。完璧な文章である必要はなく、箇条書きや話し言葉で大丈夫です。あなたの熱意や価値観が伝わることが大切です。">
                <svg className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </HelpTooltip>
            </div>
            <textarea
              value={data.reasonText}
              onChange={(e) =>
                setData({ ...data, reasonText: e.target.value })
              }
              placeholder="箇条書きや話し言葉で大丈夫です"
              rows={5}
              className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
            />
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              例：「経営者の方々が抱える課題を解決したいと思ったから」「デザインの力で事業を成長させることにやりがいを感じる」「人々の理想の住まいを見つけるお手伝いがしたい」
            </p>
          </div>

          {/* 判断で大事にしていること */}
          <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                仕事で何を大切にしていますか？
              </h2>
              <HelpTooltip content="仕事をする上で、あなたが何を基準に判断しているかを記入してください。例えば「プロジェクトを選ぶ時は長期的な関係性を重視する」「意思決定は必ずデータに基づいて行う」「クライアントの本質的な課題を見極めることを優先する」など。具体的な場面（プロジェクト選定、意思決定、優先順位の付け方など）と、その時の判断基準を書くと、見る人が「この人と一緒に仕事をしたい」と感じるかどうかを判断できます。">
                <svg className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </HelpTooltip>
            </div>
            <textarea
              value={data.valueText}
              onChange={(e) => setData({ ...data, valueText: e.target.value })}
              placeholder="箇条書きや話し言葉で大丈夫です"
              rows={5}
              className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
            />
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              例：「プロジェクトを選ぶ時は長期的な関係性を重視する」「意思決定は必ずデータに基づいて行う」「クライアントの本質的な課題を見極めることを優先する」「誠実さと透明性を常に大切にする」
            </p>
          </div>

          {/* 向いていない人 */}
          <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                こういったお客様は、お断りしています
              </h2>
              <HelpTooltip content="正直に、あなたのサービスやアプローチが向いていない人や状況を記入してください。失礼にならない表現で、例えば「即座に結果を求められる方」「短期的な関係性を重視される方」など。この情報があることで、見る人は「自分に合っているか」を判断でき、結果的に信頼性が高まります。">
                <svg className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </HelpTooltip>
            </div>
            <textarea
              value={data.notFitText}
              onChange={(e) =>
                setData({ ...data, notFitText: e.target.value })
              }
              placeholder="失礼にならない表現で記入してください"
              rows={5}
              className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
            />
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              例：「即座に結果を求められる方」「短期的な関係性を重視される方」「長期的な視点での取り組みにご理解いただけない方」
            </p>
          </div>

          {/* 経験・実績タグ（最大3） */}
          <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                  経験・実績タグ（最大3）
                </h2>
                <HelpTooltip content="あなたの経験や実績を簡潔に表現してください。例えば「10年のコンサル経験」「100社以上の支援実績」「IPO支援経験あり」など。具体的な数字や実績があると、信頼性が高まります。">
                  <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </HelpTooltip>
              </div>
              {data.experienceTags && data.experienceTags.length < 3 && (
                <button
                  onClick={addExperienceTag}
                  className="group flex shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-white hover:shadow-md sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-2.5"
                >
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>追加</span>
                </button>
              )}
            </div>
            <div className="space-y-3">
              {data.experienceTags?.map((tag, index) => {
                const placeholders = [
                  "例：10年のコンサル経験",
                  "例：100社以上の支援実績",
                  "例：IPO支援経験あり"
                ];
                return (
                  <div key={index} className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) =>
                        updateExperienceTag(index, e.target.value)
                      }
                      placeholder={placeholders[index] || "例：経験・実績"}
                      className="flex-1 min-w-0 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-4 sm:py-3 sm:text-base md:px-5 md:py-3.5"
                    />
                    <button
                      onClick={() => removeExperienceTag(index)}
                      className="group flex shrink-0 items-center justify-center gap-1 rounded-xl border-2 border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:shadow-sm sm:px-4 sm:py-3 md:px-5 md:py-3.5"
                    >
                      <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="hidden sm:inline">削除</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* よくある質問（最大3） */}
          <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                  よくある質問（最大3）
                </h2>
                <HelpTooltip content="お客様からよく聞かれる質問を記入してください。例えば「どのくらいの期間で結果が出ますか？」「費用はどのくらいかかりますか？」など。事前に回答を用意しておくことで、見る人の不安を解消し、信頼関係を築きやすくなります。">
                  <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </HelpTooltip>
              </div>
              {data.commonQuestions && data.commonQuestions.length < 3 && (
                <button
                  onClick={addCommonQuestion}
                  className="group flex shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-white hover:shadow-md sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-2.5"
                >
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>追加</span>
                </button>
              )}
            </div>
            <div className="space-y-3">
              {data.commonQuestions?.map((question, index) => {
                const placeholders = [
                  "例：どのくらいの期間で結果が出ますか？",
                  "例：費用はどのくらいかかりますか？",
                  "例：どのようなサポート体制ですか？"
                ];
                return (
                  <div key={index} className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) =>
                        updateCommonQuestion(index, e.target.value)
                      }
                      placeholder={placeholders[index] || "例：よくある質問"}
                      className="flex-1 min-w-0 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-4 sm:py-3 sm:text-base md:px-5 md:py-3.5"
                    />
                    <button
                      onClick={() => removeCommonQuestion(index)}
                      className="group flex shrink-0 items-center justify-center gap-1 rounded-xl border-2 border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:shadow-sm sm:px-4 sm:py-3 md:px-5 md:py-3.5"
                    >
                      <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="hidden sm:inline">削除</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 最近考えていること */}
          <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                最近考えていること
              </h2>
              <HelpTooltip content="あなたの人柄や価値観が伝わる、最近考えていることや気づきを記入してください。仕事に関連していなくても構いません。人間らしさや思考の深さが伝わる内容が理想的です。短文で、読みやすい分量にまとめると良いでしょう。">
                <svg className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </HelpTooltip>
            </div>
            <textarea
              value={data.humanText}
              onChange={(e) => setData({ ...data, humanText: e.target.value })}
              placeholder="人柄が伝わる短文で"
              rows={4}
              className="w-full rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
            />
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              例：「最近は、長期的な視点で物事を考えることの重要性を感じています。短期的な成果も大切ですが、10年後を見据えた判断ができるようになりたいと思っています。」
            </p>
          </div>

          {/* リンク集（最大5） */}
          <div className="card-hover animate-fade-in-up rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                  リンク集（最大5）
                </h2>
                <HelpTooltip content="あなたのポートフォリオ、ブログ、SNS、会社のホームページなどのリンクを追加できます。見る人がより詳しく知りたい場合に便利です。ラベルは「ポートフォリオ」「ブログ」「Twitter」など、わかりやすい名前をつけてください。">
                  <svg className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </HelpTooltip>
              </div>
              {data.links && data.links.length < 5 && (
                <button
                  onClick={addLink}
                  className="group flex shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-white hover:shadow-md sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-2.5"
                >
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>追加</span>
                </button>
              )}
            </div>
            <div className="space-y-3">
              {data.links?.map((link, index) => {
                const labelPlaceholders = [
                  "例：ポートフォリオ",
                  "例：ブログ",
                  "例：Twitter",
                  "例：会社HP",
                  "例：LinkedIn"
                ];
                const urlPlaceholders = [
                  "例：https://example.com/portfolio",
                  "例：https://example.com/blog",
                  "例：https://twitter.com/username",
                  "例：https://example.com",
                  "例：https://linkedin.com/in/username"
                ];
                return (
                  <div key={index} className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        updateLink(index, "label", e.target.value)
                      }
                      placeholder={labelPlaceholders[index] || "ラベル"}
                      className="rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:w-32 sm:px-4 sm:py-3 sm:text-base md:px-5 md:py-3.5"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      placeholder={urlPlaceholders[index] || "URL"}
                      className="flex-1 min-w-0 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:px-4 sm:py-3 sm:text-base md:px-5 md:py-3.5"
                    />
                    <button
                      onClick={() => removeLink(index)}
                      className="group flex shrink-0 items-center justify-center gap-1 rounded-xl border-2 border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:shadow-sm sm:px-4 sm:py-3 md:px-5 md:py-3.5"
                    >
                      <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="hidden sm:inline">削除</span>
                    </button>
                  </div>
                );
              })}
            </div>
            {data.links && data.links.length === 0 && (
              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                例：ラベル「ポートフォリオ」URL「https://example.com/portfolio」、ラベル「ブログ」URL「https://example.com/blog」
              </p>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
