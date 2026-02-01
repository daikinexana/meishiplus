-- layoutTemplateIdカラムを追加するSQL
-- NeonのSQLエディタで実行してください

-- profile_pagesテーブルにlayoutTemplateIdカラムを追加
ALTER TABLE profile_pages 
ADD COLUMN IF NOT EXISTS "layoutTemplateId" TEXT;

-- 既存のレコードにデフォルト値を設定（オプション）
-- UPDATE profile_pages SET "layoutTemplateId" = 'L01' WHERE "layoutTemplateId" IS NULL;

-- 確認用クエリ
-- SELECT "layoutTemplateId", COUNT(*) FROM profile_pages GROUP BY "layoutTemplateId";
