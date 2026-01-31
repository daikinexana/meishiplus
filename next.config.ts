import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PrismaクライアントをTurbopackで正しく解決するための設定
  serverExternalPackages: ["@prisma/client", "prisma"],
  // Turbopack設定（空の設定でエラーを回避）
  turbopack: {},
};

export default nextConfig;
