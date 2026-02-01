-- photoUrlsフィールドを追加するマイグレーション
-- プロフィールページテーブルに複数の画像URLを保存するための配列フィールドを追加
-- 他のカラム（"photoUrl", "impressionTags"など）と同様に、引用符付きキャメルケースで定義

-- 既存のphoto_urlsカラムがある場合はリネーム（既存データベース用）
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profile_pages' AND column_name = 'photo_urls'
  ) THEN
    ALTER TABLE profile_pages RENAME COLUMN photo_urls TO "photoUrls";
  END IF;
END $$;

-- photoUrlsカラムを追加（引用符付きキャメルケース）
ALTER TABLE profile_pages 
ADD COLUMN IF NOT EXISTS "photoUrls" TEXT[] DEFAULT '{}';

-- 既存のphotoUrlがある場合は、photoUrlsの最初の要素として移行（オプション）
-- UPDATE profile_pages 
-- SET "photoUrls" = ARRAY["photoUrl"] 
-- WHERE "photoUrl" IS NOT NULL AND "photoUrl" != '' AND array_length("photoUrls", 1) IS NULL;
