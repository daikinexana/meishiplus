import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://meishi.plus"),
  title: "Meishi+｜名刺以上、Web未満の個人紹介ページ",
  description:
    "Meishi+（メイシプラス）は、名刺以上Web未満の個人紹介ページを10分で作れるサービスです。第三者が安心して紹介できるプロフィールを簡単に作成できます。",
};

const clerkAppearance = {
  elements: {
    rootBox: "mx-auto",
    card: "shadow-lg border border-gray-200",
    headerTitle: "text-gray-900 font-light",
    headerSubtitle: "text-gray-600",
    socialButtonsBlockButton:
      "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors",
    socialButtonsBlockButtonText: "text-gray-900 font-medium",
    formButtonPrimary:
      "bg-gray-900 text-white hover:bg-gray-800 transition-colors",
    footerActionLink: "text-gray-900 hover:text-gray-700",
    formFieldInput:
      "border-gray-300 focus:border-gray-900 focus:ring-gray-900",
    formFieldLabel: "text-gray-700",
    identityPreviewText: "text-gray-900",
    identityPreviewEditButton: "text-gray-600 hover:text-gray-900",
  },
  variables: {
    colorPrimary: "#171717",
    colorText: "#171717",
    colorTextSecondary: "#6b7280",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#171717",
    borderRadius: "0.375rem",
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      localization={jaJP}
    >
      <html lang="ja" suppressHydrationWarning className="overflow-x-hidden">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
          suppressHydrationWarning
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
