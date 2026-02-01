# AWS S3 画像アップロード実装ガイド

## 必要なパッケージのインストール

以下のコマンドで必要なパッケージをインストールしてください：

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner uuid
npm install --save-dev @types/uuid
```

## .envファイルの設定

`.env`または`.env.local`ファイルに以下を追加：

```env
# AWS S3設定
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET_NAME=meishiplus-images
```

## 実装の流れ

1. **ユーザーがファイルを選択**
   - エディターページで「ファイルを選択」ボタンをクリック
   - 画像ファイルを選択

2. **署名付きURLの取得**
   - フロントエンドから`/api/upload/photo`にリクエスト
   - サーバーがS3へのアップロード用の署名付きURLを生成
   - 署名付きURLと公開URLを返す

3. **S3への直接アップロード**
   - フロントエンドが署名付きURLを使ってS3に直接アップロード
   - サーバーを経由しないため、高速で効率的

4. **URLの保存**
   - アップロード成功後、公開URLをデータに保存
   - プロフィール更新時にデータベースに保存

## セキュリティ

- ファイルサイズ制限: 5MB
- ファイルタイプ制限: 画像ファイルのみ（jpg, png, webp, gif）
- 認証: Clerk認証が必要
- 署名付きURLの有効期限: 5分

## トラブルシューティング

### エラー: "AWS S3 configuration is missing"
- `.env`ファイルに必要な環境変数が設定されているか確認

### エラー: "Access Denied"
- IAMユーザーのポリシーが正しく設定されているか確認
- バケット名が正しいか確認

### 画像が表示されない
- バケットポリシーでパブリック読み取りが許可されているか確認
- CORS設定が正しいか確認
