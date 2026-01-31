"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
}

export default function EditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showGitHubForm, setShowGitHubForm] = useState(false);
  const [gitHubUsername, setGitHubUsername] = useState("");
  const [data, setData] = useState<ProfileData>({
    role: "",
    audience: "",
    impressionTags: [],
    name: "",
    headline: "",
    tagline: "",
    whoHelp: "",
    situation: "",
    reasonText: "",
    valueText: "",
    notFitText: "",
    experienceTags: [],
    commonQuestions: [],
    humanText: "",
    links: [],
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
            headline: result.profile.headline || "",
            tagline: result.profile.tagline || "",
            whoHelp: result.profile.whoHelp || "",
            situation: result.profile.situation || "",
            reasonText: result.profile.reasonText || "",
            valueText: result.profile.valueText || "",
            notFitText: result.profile.notFitText || "",
            experienceTags: result.profile.experienceTags || [],
            commonQuestions: result.profile.commonQuestions || [],
            humanText: result.profile.humanText || "",
            links: result.profile.links || [],
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-3xl font-bold text-gray-900">エディター</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/top/mypage/preview")}
              className="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              プレビュー
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 rounded bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>保存中...</span>
                </>
              ) : (
                <>
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  保存して生成
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* 最初の3つの質問 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              基本設定
            </h2>
            <div className="space-y-4">
              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  役割・職業
                </label>
                <input
                  type="text"
                  value={data.role}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                  placeholder="例：フリーランスデザイナー、不動産エージェント、スタートアップ経営者など"
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                />
              </div>

              {/* Audience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  主な対象者
                </label>
                <div className="space-y-2">
                  {AUDIENCE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center rounded border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="audience"
                        value={option}
                        checked={data.audience === option}
                        onChange={(e) => setData({ ...data, audience: e.target.value })}
                        className="mr-3"
                      />
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Impression Tags */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  どんな印象を与えたいですか？（最大3つ）
                </label>
                <p className="mb-3 text-sm text-gray-500">
                  選択中: {data.impressionTags?.length || 0}/3
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
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
                        className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* 基本情報 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              基本情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  名前
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="あなたの名前"
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  見出し
                </label>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) =>
                    setData({ ...data, headline: e.target.value })
                  }
                  placeholder="例：フリーランスデザイナー、コンサルタントなど"
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  タグライン
                </label>
                <input
                  type="text"
                  value={data.tagline}
                  onChange={(e) =>
                    setData({ ...data, tagline: e.target.value })
                  }
                  placeholder="短いキャッチフレーズ"
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 誰を助けるか */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              誰を助けますか？
            </h2>
            <textarea
              value={data.whoHelp}
              onChange={(e) => setData({ ...data, whoHelp: e.target.value })}
              placeholder="例：スタートアップ経営者、個人事業主など"
              rows={3}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
            />
          </div>

          {/* どんな状況で頼まれるか */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              どんな状況で頼まれますか？
            </h2>
            <textarea
              value={data.situation}
              onChange={(e) => setData({ ...data, situation: e.target.value })}
              placeholder="例：事業拡大のタイミング、資金調達を考えている時など"
              rows={3}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
            />
          </div>

          {/* この仕事をしている理由 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              この仕事をしている理由
            </h2>
            <textarea
              value={data.reasonText}
              onChange={(e) =>
                setData({ ...data, reasonText: e.target.value })
              }
              placeholder="箇条書きや話し言葉で大丈夫です"
              rows={5}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
            />
          </div>

          {/* 判断で大事にしていること */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              判断で大事にしていること
            </h2>
            <textarea
              value={data.valueText}
              onChange={(e) => setData({ ...data, valueText: e.target.value })}
              placeholder="箇条書きや話し言葉で大丈夫です"
              rows={5}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
            />
          </div>

          {/* 向いていない人 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              こんな方には向いていません
            </h2>
            <textarea
              value={data.notFitText}
              onChange={(e) =>
                setData({ ...data, notFitText: e.target.value })
              }
              placeholder="失礼にならない表現で記入してください"
              rows={5}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
            />
          </div>

          {/* 経験・実績タグ（最大3） */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                経験・実績タグ（最大3）
              </h2>
              {data.experienceTags && data.experienceTags.length < 3 && (
                <button
                  onClick={addExperienceTag}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  + 追加
                </button>
              )}
            </div>
            <div className="space-y-2">
              {data.experienceTags?.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) =>
                      updateExperienceTag(index, e.target.value)
                    }
                    placeholder="例：10年のコンサル経験"
                    className="flex-1 rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                  />
                  <button
                    onClick={() => removeExperienceTag(index)}
                    className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* よくある質問（最大3） */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                よくある質問（最大3）
              </h2>
              {data.commonQuestions && data.commonQuestions.length < 3 && (
                <button
                  onClick={addCommonQuestion}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  + 追加
                </button>
              )}
            </div>
            <div className="space-y-2">
              {data.commonQuestions?.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) =>
                      updateCommonQuestion(index, e.target.value)
                    }
                    placeholder="例：どのくらいの期間で結果が出ますか？"
                    className="flex-1 rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                  />
                  <button
                    onClick={() => removeCommonQuestion(index)}
                    className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 最近考えていること */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              最近考えていること
            </h2>
            <textarea
              value={data.humanText}
              onChange={(e) => setData({ ...data, humanText: e.target.value })}
              placeholder="人柄が伝わる短文で"
              rows={4}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
            />
          </div>

          {/* リンク集（最大5） */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                リンク集（最大5）
              </h2>
              {data.links && data.links.length < 5 && (
                <button
                  onClick={addLink}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  + 追加
                </button>
              )}
            </div>
            <div className="space-y-2">
              {data.links?.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      updateLink(index, "label", e.target.value)
                    }
                    placeholder="ラベル"
                    className="w-32 rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    placeholder="URL"
                    className="flex-1 rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                  />
                  <button
                    onClick={() => removeLink(index)}
                    className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
