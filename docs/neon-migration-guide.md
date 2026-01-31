# Prisma → Neon直接接続 移行ガイド

## 概要

Prismaのエラーが続いているため、シンプルで確実なNeon直接接続に移行します。

## ステップ1: 依存関係のインストール

```bash
npm install pg @types/pg --save
```

## ステップ2: 既存ファイルの確認

以下のファイルが作成されました：

- `lib/db.ts` - Neon接続プールと基本クエリ関数
- `lib/types.ts` - 型定義（Prismaスキーマから移行）
- `lib/db-helpers.ts` - 便利なクエリヘルパー関数

## ステップ3: 既存コードの置き換え

### 例: `app/top/page.tsx`

**変更前（Prisma）:**
```typescript
import { prisma } from "@/lib/prisma";

const profile = await prisma.profilePage.findUnique({
  where: { userId },
  include: {
    links: {
      orderBy: { order: "asc" },
    },
  },
});
```

**変更後（Neon直接接続）:**
```typescript
import { profileQueries } from "@/lib/db-helpers";

const profile = await profileQueries.findByUserId(userId);
```

## ステップ4: Prismaの削除（オプション）

移行が完了したら、以下を削除できます：

```bash
npm uninstall @prisma/client prisma
rm -rf prisma/
```

## メリット

- ✅ シンプルで軽量
- ✅ セットアップエラーなし
- ✅ SQLを直接制御可能
- ✅ バンドルサイズが小さい

## 注意点

- ⚠️ 型安全性は手動で管理（`lib/types.ts`で定義）
- ⚠️ マイグレーションは手動でSQLを実行
- ⚠️ リレーションは手動でJOINまたは複数クエリ

## 次のステップ

1. `pg`と`@types/pg`をインストール
2. 既存のPrisma使用箇所を`lib/db-helpers.ts`の関数に置き換え
3. 動作確認
4. Prismaを削除
