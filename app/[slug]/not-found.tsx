import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
      <p className="mb-8 text-lg text-gray-600">
        このページは見つかりませんでした。
      </p>
      <Link
        href="/"
        className="rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
