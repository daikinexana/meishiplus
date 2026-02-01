import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Header() {
  const { userId } = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-medium text-gray-900 sm:text-2xl">Meishi+</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {userId ? (
              <Link
                href="/top"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                ダッシュボード
              </Link>
            ) : (
              <>
                <SignInButton mode="modal" fallbackRedirectUrl="/top">
                  <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                    ログイン
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/top">
                  <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                    新規登録
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
