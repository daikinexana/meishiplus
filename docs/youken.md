## 0. プロダクトの思想（最重要）

### コンセプト
**名刺以上、ホームページ未満**

### 目的
- 10分で作れる
- 第三者が「この人です」と安心して紹介できる
- 営業臭・自慢臭を排除した **信頼形成用の1ページ**

### これは何ではないか
- ❌ LPではない
- ❌ 営業ページではない
- ❌ SNSプロフィールでもない

👉  
**「自己紹介を、信頼される形に翻訳する装置」**

---

## 1. MVPスコープ（確定）

### 1.1 MVPでできること
- Clerkログイン
- **1ユーザー = 1公開ページ**
- 質問に答えるだけで、AIが紹介記事を生成
- 公開URL `/:slug` を発行
- URLコピー & QRコード表示
- **リンク集（最大5）** を追加・編集・並び替え
- デザイン（theme_id）は自動決定

### 1.2 MVPでやらないこと
- 複数ページ
- 自由レイアウト編集
- 色・フォントの手動選択
- 決済 / EC（リンク誘導はOK）
- SNS連携、レビュー、実績証明
- アクセス解析

---

## 2. 技術スタック（前提）

- Next.js（App Router）
- Neon Postgres
- Prisma ORM
- Clerk（認証）
- Vercel（デプロイ）
- AWS S3（プロフィール写真）
- OpenAI API（文章整形・構造化）
- npm `qrcode`（QR生成）

---

## 3. ユーザーフロー

1. Clerkでログイン
2. 3問（役割 / 見せる相手 / 印象）
3. インタビュー入力
4. リンク集入力（最大5）
5. OpenAIで紹介記事生成
6. プレビュー
7. 公開
8. URL / QRで共有

---

## 4. データ設計（Prisma / Neon）

### 4.1 原則
- **DBは固定構造**
- 質問文・見出しは保存しない
- 表現はAIが生成
- ユーザーが保存するのは「答え」だけ


data イメージ

  id              String   @id @default(cuid())
  userId          String   @unique
  slug            String   @unique
  isPublished     Boolean  @default(false)

  // onboarding
  role            String?
  audience        String?
  impressionTags  String[] @default([])

  // basic
  name            String?
  photoUrl        String?

  // raw answers
  headline        String?
  tagline         String?
  whoHelp         String?
  situation       String?
  reasonText      String?
  valueText       String?
  notFitText      String?
  experienceTags  String[] @default([])
  commonQuestions String[] @default([])
  humanText       String?

  // AI generated
  tone            String?   // logical | soft | flat
  themeId         String?   // T01 ~ T10
  generatedJson   Json?

  // links
  links           LinkItem[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model LinkItem {
  id        String      @id @default(cuid())
  pageId    String
  page      ProfilePage @relation(fields: [pageId], references: [id], onDelete: Cascade)

  label     String      // 表示名（必須）
  url       String      // URL（必須）
  order     Int         @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([pageId])
  @@unique([pageId, order])
}
制約：

links は最大5件（アプリ側で制御）

slug は短いランダム文字列（衝突時リトライ）


1. 公開ページUI（表示順固定）
Hero（写真 / 名前 / 肩書き / キャッチ）

Quick Profile（30秒理解）

Reason（なぜこの仕事をしているか）

Values（判断軸）

Not Fit（向いていない人・特別デザイン）

Proof（経験・よくある相談）

Human（人となり）

Links（最大5）

Share（URLコピー / QR）

ルール：

Reason / Values / NotFit は折りたたまない

Proof / Human は「続きを読む」可

7. 入力仕様
7.1 最初の3問（必須）
role（自由入力）

audience（選択）

見込み顧客 / 既存顧客 / 紹介者 / 採用・協業 / 投資家・起業家

impressionTags（最大3）

誠実 / 論理的 / 落ち着き / 親しみ / 丁寧 / 知的 / 温かい / 情熱 / フラット / クール

7.2 Editor入力項目
name

photo（S3）

tagline

whoHelp

situation

reasonText

valueText

notFitText

experienceTags（最大3）

commonQuestions（最大3）

humanText

links（最大5：label + url）

8. OpenAI仕様（最重要）
8.1 OpenAIの役割
営業臭を消す

インタビュー形式を「紹介記事」に変換

見出し・要約・本文を生成

tone / themeId を決定

8.2 絶対ルール
Q/A形式は出力しない

見出しは疑問形にしない

誇張・断定を避ける

notFit は失礼禁止（期待値のズレ / 進め方 / 守備範囲）

8.3 themeId（固定10種）
T01: クリーン・誠実

T02: ロジカル・整然

T03: やわらか・親近

T04: ミニマル・信頼

T05: モダン・知的

T06: クリエイティブ

T07: 落ち着き・安心

T08: シャープ・決断

T09: ストーリー重視

T10: パーソナル強調

8.4 OpenAI 出力JSON（厳守）
json
コードをコピーする
{
  "tone": "logical",
  "themeId": "T01",
  "themeReason": "経営者向け × 誠実・論理的",
  "sections": {
    "quick": { "body": "..." },
    "reason": { "heading": "...", "summary": "...", "body": "..." },
    "values": { "heading": "...", "summary": "...", "body": "..." },
    "notFit": { "heading": "...", "summary": "...", "body": "..." },
    "proof": { "heading": "...", "body": "..." },
    "human": { "heading": "...", "summary": "...", "body": "..." }
  }
}
※ links は生成しない（DBの links をそのまま表示）

9. API仕様（Route Handlers）
認証必須
POST /api/profile/create

PATCH /api/profile/update

POST /api/profile/generate

POST /api/profile/publish

POST /api/upload/photo（S3署名URL）

links CRUD
POST /api/profile/links

PATCH /api/profile/links/:id

DELETE /api/profile/links/:id

公開
GET /api/public/:slug

10. Share機能
「この人を紹介する」ボタン

URLコピー

QRコード生成・表示

11. Definition of Done（MVP完了条件）
10分で作成完了

営業臭のない紹介文が生成される

notFit が自然に表示される

公開URL /:slug が共有できる

QRが表示できる

リンク集（最大5）が編集できる

12. Cursorへの進め方（重要）
Step 1
このMDを 最初に全部読み込ませる

Step 2
次にこう指示する：

「この仕様書に基づいて Phase 1（Next.js + Clerk + Prisma + Neon の初期構築）を実装してください」

Step 3
Phaseごとに進める：

Phase 1: 基盤

Phase 2: API

Phase 3: UI

Phase 4: OpenAI

Phase 5: 公開 & Share