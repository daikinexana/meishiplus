import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:gap-12">
          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">プロダクト</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#sample"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  サンプル
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">リソース</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/samples"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  テンプレート一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">会社情報</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Meishi+. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
