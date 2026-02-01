import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
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
