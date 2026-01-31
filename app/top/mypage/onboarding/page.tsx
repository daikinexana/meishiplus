"use client";

import { useState } from "react";
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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [audience, setAudience] = useState("");
  const [impressionTags, setImpressionTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (impressionTags.includes(tag)) {
      setImpressionTags(impressionTags.filter((t) => t !== tag));
    } else {
      if (impressionTags.length < 3) {
        setImpressionTags([...impressionTags, tag]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!role || !audience || impressionTags.length === 0) {
      alert("すべての項目を入力してください");
      return;
    }

    setLoading(true);

    try {
      // プロフィール作成（存在しない場合）
      const createRes = await fetch("/api/profile/create", {
        method: "POST",
      });

      if (createRes.status === 400) {
        // 既に存在する場合は無視
      } else if (!createRes.ok) {
        throw new Error("Failed to create profile");
      }

      // プロフィール更新
      const updateRes = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          audience,
          impressionTags,
        }),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to update profile";
        console.error("Update error:", errorData);
        throw new Error(errorMessage);
      }

      router.push("/top/mypage/editor");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "エラーが発生しました。もう一度お試しください。";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Meishi+ へようこそ
          </h1>
          <p className="text-gray-600">
            まずは3つの質問に答えて、あなたのプロフィールを作成しましょう
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Role */}
          {step === 1 && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                1. あなたの役割・職業は何ですか？
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                例：フリーランスデザイナー、不動産エージェント、スタートアップ経営者など
              </p>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="役割・職業を入力"
                className="w-full rounded border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
              />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!role.trim()}
                  className="rounded bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Audience */}
          {step === 2 && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                2. 主な対象者は誰ですか？
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                あなたのサービスや活動の主な対象者を選択してください
              </p>
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
                      checked={audience === option}
                      onChange={(e) => setAudience(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="rounded border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  戻る
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!audience}
                  className="rounded bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Impression Tags */}
          {step === 3 && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                3. どんな印象を与えたいですか？（最大3つ）
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                あなたが伝えたい印象を選択してください（{impressionTags.length}/3）
              </p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {IMPRESSION_TAGS_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    disabled={
                      !impressionTags.includes(tag) &&
                      impressionTags.length >= 3
                    }
                    className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${
                      impressionTags.includes(tag)
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="rounded border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  戻る
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={impressionTags.length === 0 || loading}
                  className="rounded bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? "保存中..." : "完了"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
