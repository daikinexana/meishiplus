/**
 * サンプルページ一覧
 * Studio.design風のモダンでミニマルなデザイン
 */

import Link from "next/link";
import { getAllLayoutTemplates } from "@/lib/layout-templates";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SamplesPage() {
  const templates = getAllLayoutTemplates();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:px-8 md:py-32">
          {/* ヘッダー */}
          <div className="mb-20 text-center sm:mb-24 md:mb-32">
            <h1 className="mb-8">
              <div className="text-5xl font-light text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl">
                Layout Templates
              </div>
              <div className="mt-2 text-2xl font-light text-gray-500 sm:text-3xl md:text-4xl lg:text-5xl">
                レイアウトテンプレート
              </div>
            </h1>
            <p className="mx-auto max-w-3xl text-xl font-light text-gray-600 sm:text-2xl md:text-3xl">
              8種類のインタビューページスタイルから、<br className="hidden sm:block" />
              あなたにぴったりのデザインを選べます
            </p>
          </div>

          {/* テンプレート一覧 - Studio風グリッド */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/samples/${template.id}`}
                className="group block h-full"
              >
                {/* カード */}
                <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
                  {/* カードヘッダー */}
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{template.id}</span>
                    </div>
                    <h3 className="text-lg font-light text-gray-900">{template.name}</h3>
                  </div>
                  
                  {/* カード本文 */}
                  <div className="flex flex-1 flex-col px-6 py-4">
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{template.description}</p>
                    
                    {/* 特徴タグ */}
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature, index) => (
                        <span
                          key={index}
                          className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
