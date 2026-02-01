# AWS S3 画像アップロード設定ガイド

## 目次
1. [AWS S3バケットの作成](#1-aws-s3バケットの作成)
2. [IAMユーザーの作成とポリシー設定](#2-iamユーザーの作成とポリシー設定)
3. [環境変数の設定](#3-環境変数の設定)
4. [実装コード](#4-実装コード)

---

## 1. AWS S3バケットの作成

### 1.1 AWSコンソールにログイン
1. [AWS Management Console](https://console.aws.amazon.com/) にログイン
2. 検索バーで「S3」を検索してS3サービスを開く

### 1.2 バケットを作成
1. 「バケットを作成」ボタンをクリック
2. バケット名を入力（例: `meishiplus-images`）
   - バケット名は全世界で一意である必要があります
   - 小文字とハイフンのみ使用可能
3. リージョンを選択（例: `ap-northeast-1`（東京））
4. 「パブリックアクセス設定」セクション：
   - **「すべてのパブリックアクセスをブロック」のチェックを外す**
   - 「現在の設定により、このバケットとそのオブジェクトはパブリックになりません」という警告が出ますが、これは問題ありません
   - または、より安全な方法として「パブリックアクセスをブロック」のままにして、CloudFrontを使用することもできます
5. 「バケットのバージョニング」は無効のまま（必要に応じて有効化可能）
6. 「デフォルトの暗号化」は「Amazon S3 マネージドキー (SSE-S3)」を選択
7. 「バケットを作成」をクリック

### 1.3 バケットポリシーを設定（パブリック読み取り用）
1. 作成したバケットを選択
2. 「アクセス許可」タブを開く
3. 「バケットポリシー」セクションで「編集」をクリック
4. 以下のポリシーを貼り付け（`meishiplus-images`を実際のバケット名に置き換え）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::meishiplus-images/*"
    }
  ]
}
```

5. 「変更を保存」をクリック

### 1.4 CORS設定（重要）
1. 「アクセス許可」タブの「Cross-origin resource sharing (CORS)」セクションで「編集」をクリック
2. 以下の設定を追加（`yourdomain.vercel.app`を実際のVercelドメインに置き換え）：

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://*.vercel.app",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

3. `yourdomain.com`を実際のカスタムドメインに置き換え（使用する場合）
4. `*.vercel.app`はVercelのすべてのプレビュードメインを許可します
5. 「変更を保存」をクリック

---

## 2. IAMユーザーの作成とポリシー設定

### 2.1 IAMユーザーを作成
1. AWSコンソールで「IAM」を検索して開く
2. 左メニューから「ユーザー」を選択
3. 「ユーザーを追加」をクリック
4. ユーザー名を入力（例: `meishiplus-s3-uploader`）
5. 「プログラムによるアクセスを提供」にチェック
6. 「次へ」をクリック

### 2.2 ポリシーをアタッチ
1. 「既存のポリシーを直接アタッチ」を選択
2. 「ポリシーの作成」をクリック（新しいポリシーを作成）
3. 「JSON」タブを選択
4. 以下のポリシーを貼り付け（`meishiplus-images`を実際のバケット名に置き換え）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::meishiplus-images/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::meishiplus-images"
    }
  ]
}
```

5. 「次へ」をクリック
6. ポリシー名を入力（例: `MeishiPlusS3UploadPolicy`）
7. 「ポリシーの作成」をクリック
8. ユーザー作成画面に戻り、作成したポリシーを選択
9. 「次へ」をクリック
10. 「ユーザーの作成」をクリック

### 2.3 アクセスキーの取得と保存

#### ステップ1: ユーザー作成後の画面
1. ユーザー作成が完了すると、以下のような画面が表示されます：
   ```
   ✅ ユーザーが正常に作成されました
   
   アクセスキーID: AKIAIOSFODNN7EXAMPLE
   シークレットアクセスキー: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```

#### ステップ2: アクセスキーをコピー
1. **アクセスキーID**をコピー（例: `AKIAIOSFODNN7EXAMPLE`）
   - この値が`AWS_ACCESS_KEY_ID`になります
2. **シークレットアクセスキー**をコピー（例: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`）
   - この値が`AWS_SECRET_ACCESS_KEY`になります

#### ステップ3: 安全に保存
1. **重要**: この画面を閉じると、シークレットアクセスキーは**二度と表示されません**
2. 以下のいずれかの方法で保存：
   - **推奨**: 「.csvファイルをダウンロード」をクリックしてダウンロード
   - または、手動で`.env.local`ファイルにコピー＆ペースト

#### ステップ4: .env.localファイルに設定
プロジェクトの`.env.local`ファイル（存在しない場合は作成）に以下を追加：

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

⚠️ **注意**: 
- 上記の値は例です。実際の値を貼り付けてください
- `.env.local`ファイルは`.gitignore`に含まれていることを確認してください
- このファイルをGitにコミットしないでください

#### もしアクセスキーを失くした場合
1. IAMコンソールで該当ユーザーを選択
2. 「セキュリティ認証情報」タブを開く
3. 「アクセスキーを作成」をクリック
4. 新しいアクセスキーを作成（古いキーは削除することを推奨）

---

## 3. 環境変数の設定

### 3.1 ローカル開発環境（.envファイル）
プロジェクトの`.env.local`ファイル（`.gitignore`に含まれていることを確認）に以下を追加：

```env
# AWS S3設定
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET_NAME=meishiplus-images
```

### 3.2 Vercelでの環境変数設定

#### 方法1: Vercelダッシュボードから設定（推奨）

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. プロジェクトを選択（または新規作成）
3. 「Settings」タブをクリック
4. 左メニューから「Environment Variables」を選択
5. 以下の環境変数を追加：

| 名前 | 値 | 環境 |
|------|-----|------|
| `AWS_REGION` | `ap-northeast-1` | Production, Preview, Development |
| `AWS_ACCESS_KEY_ID` | あなたのアクセスキーID | Production, Preview, Development |
| `AWS_SECRET_ACCESS_KEY` | あなたのシークレットアクセスキー | Production, Preview, Development |
| `AWS_S3_BUCKET_NAME` | `meishiplus-images` | Production, Preview, Development |

6. 各環境変数を追加後、「Save」をクリック
7. デプロイを再実行（または自動で再デプロイされる）

#### 方法2: Vercel CLIから設定

```bash
# Vercel CLIをインストール（まだの場合）
npm i -g vercel

# プロジェクトにログイン
vercel login

# 環境変数を設定
vercel env add AWS_REGION
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add AWS_S3_BUCKET_NAME
```

### 3.3 環境変数の説明
- `AWS_REGION`: S3バケットを作成したリージョン（例: `ap-northeast-1`）
- `AWS_ACCESS_KEY_ID`: IAMユーザーのアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: IAMユーザーのシークレットアクセスキー
- `AWS_S3_BUCKET_NAME`: 作成したS3バケット名

### 3.4 セキュリティのベストプラクティス

⚠️ **重要**: 
- `.env.local`ファイルは絶対にGitにコミットしないでください
- `.gitignore`に`.env*`が含まれていることを確認してください
- Vercelの環境変数は暗号化されて保存されます
- 本番環境と開発環境で異なるアクセスキーを使用することを推奨します

---

## 4. 実装コード

### 4.1 必要なパッケージのインストール

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 4.2 実装の流れ

1. **署名付きURLの生成API** (`/api/upload/photo`)
   - クライアントからリクエストを受ける
   - S3へのアップロード用の署名付きURLを生成
   - クライアントに返す

2. **クライアント側の実装**
   - ファイル選択
   - 署名付きURLを取得
   - S3に直接アップロード
   - アップロード完了後、URLをデータに保存

---

## セキュリティのベストプラクティス

1. **IAMポリシーの最小権限原則**
   - 必要な権限のみを付与
   - バケット全体ではなく、特定のパスへのアクセスのみ許可することも可能

2. **署名付きURLの有効期限**
   - 短い有効期限を設定（例: 5分）
   - 不要になったURLは無効化

3. **ファイルサイズ制限**
   - サーバー側とクライアント側の両方で制限
   - 例: 最大5MB

4. **ファイルタイプの検証**
   - 画像ファイルのみ許可（jpg, png, webp, gifなど）
   - MIMEタイプの検証

5. **パブリックアクセスの制限**
   - 可能であれば、CloudFrontを使用してパブリックアクセスを制限
   - または、署名付きURLでのみアクセス可能にする

---

## トラブルシューティング

### エラー: Access Denied
- IAMポリシーが正しく設定されているか確認
- バケット名が正しいか確認
- リージョンが正しいか確認

### エラー: CORS policy / Failed to fetch
- CORS設定を確認
- 許可されているオリジンに現在のドメインが含まれているか確認
- ブラウザの開発者ツール（F12）のコンソールタブでエラーメッセージを確認
- ネットワークタブでS3へのPUTリクエストのステータスを確認
- S3バケットのCORS設定に以下が含まれているか確認：
  - `http://localhost:3000`
  - `http://localhost:3001`（使用しているポート）
  - `https://*.vercel.app`（Vercelデプロイ時）
  - `AllowedMethods`に`PUT`が含まれているか
  - `AllowedHeaders`に`*`または`Content-Type`が含まれているか

### エラー: Failed to fetch（S3アップロード時）
1. **CORS設定の確認**
   - AWSコンソールでS3バケットを開く
   - 「アクセス許可」タブ → 「Cross-origin resource sharing (CORS)」を確認
   - 現在のドメイン（`http://localhost:3001`など）が`AllowedOrigins`に含まれているか確認
   - `AllowedMethods`に`PUT`が含まれているか確認
   - `AllowedHeaders`に`*`または`Content-Type`が含まれているか確認

2. **ブラウザの開発者ツールで確認**
   - F12キーで開発者ツールを開く
   - 「コンソール」タブでエラーメッセージを確認
   - 「ネットワーク」タブでS3へのPUTリクエストを確認
   - リクエストのステータスコードとレスポンスヘッダーを確認

3. **環境変数の確認**
   - `.env.local`ファイルにAWS認証情報が正しく設定されているか確認
   - `AWS_REGION`、`AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY`、`AWS_S3_BUCKET_NAME`が設定されているか確認

4. **IAMポリシーの確認**
   - IAMユーザーに`PutObject`権限があるか確認
   - バケット名が正しいか確認

### 画像が表示されない
- バケットポリシーでパブリック読み取りが許可されているか確認
- 画像URLが正しいか確認
- CORS設定が正しいか確認

---

## 次のステップ

実装コードは別ファイルで提供します。
