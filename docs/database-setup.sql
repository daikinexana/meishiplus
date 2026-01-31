-- Meishi+ データベースセットアップSQL
-- Neon PostgreSQLで実行してください

-- 1. usersテーブル
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clerkId" TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastLoginAt" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users("clerkId");

-- 2. profile_pagesテーブル
CREATE TABLE IF NOT EXISTS profile_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  
  -- オンボーディング
  role TEXT,
  audience TEXT,
  "impressionTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- 基本情報
  name TEXT,
  "photoUrl" TEXT,
  headline TEXT,
  tagline TEXT,
  
  -- 詳細情報
  "whoHelp" TEXT,
  situation TEXT,
  "reasonText" TEXT,
  "valueText" TEXT,
  "notFitText" TEXT,
  "experienceTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "commonQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "humanText" TEXT,
  
  -- AI生成関連
  tone TEXT,
  "themeId" TEXT,
  "generatedJson" JSONB,
  
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_pages_user_id ON profile_pages("userId");
CREATE INDEX IF NOT EXISTS idx_profile_pages_slug ON profile_pages(slug);
CREATE INDEX IF NOT EXISTS idx_profile_pages_published ON profile_pages("isPublished") WHERE "isPublished" = true;

-- 3. link_itemsテーブル
CREATE TABLE IF NOT EXISTS link_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "pageId" TEXT NOT NULL REFERENCES profile_pages(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("pageId", "order")
);

CREATE INDEX IF NOT EXISTS idx_link_items_page_id ON link_items("pageId");
-- orderでのソートを高速化するための複合インデックス（既にUNIQUE制約があるが、明示的に追加）
CREATE INDEX IF NOT EXISTS idx_link_items_page_order ON link_items("pageId", "order");

-- 確認用クエリ
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
