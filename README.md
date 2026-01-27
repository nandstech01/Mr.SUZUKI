# CareerBridge（キャリアブリッジ）

全国50万件の求人データから、あなたにぴったりの仕事が見つかる求人マッチングプラットフォーム。

## 概要

### サービス概要
人材紹介会社と提携し、全国50万件以上の求人データを集約。求職者が希望条件に合った求人を簡単に検索・応募できるプラットフォームです。

### ターゲットユーザー
- **求職者**: 転職・就職を考えている全ての方（正社員・契約社員・派遣・アルバイト）
- **管理者**: 求人データ管理、応募状況の確認、紹介会社への連携

### ビジネスモデル
- 人材紹介会社との提携（応募単価: 15,000円/件）
- 求人データはCSVで一括インポート
- 応募情報を紹介会社へ連携

### 解決する課題
- **求職者**: 複数サイトを見る手間、希望条件に合う求人が見つからない
- **紹介会社**: 集客コスト、求職者へのリーチ不足

### 差別化ポイント
- 全国50万件の豊富な求人データ
- 職種・勤務地・給与・雇用形態など多彩な検索条件
- シンプルで使いやすいUI/UX
- AIによる求人レコメンデーション（将来）

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **Hosting**: Vercel
- **Language**: TypeScript (strict mode)

## 開発ルール

- TypeScript strict mode必須
- コミットは日本語、`feat:/fix:/docs:`プレフィックス
- any型禁止
- console.log本番残し禁止

## ディレクトリ構造

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (engineer)/
│   ├── dashboard/page.tsx
│   ├── profile/page.tsx
│   ├── jobs/page.tsx
│   ├── applications/page.tsx
│   └── messages/page.tsx
├── (company)/
│   ├── dashboard/page.tsx
│   ├── profile/page.tsx
│   ├── jobs/page.tsx
│   ├── applications/page.tsx
│   ├── contracts/page.tsx
│   └── billing/page.tsx
├── api/
│   ├── auth/
│   ├── profile/
│   ├── jobs/
│   ├── applications/
│   ├── conversations/
│   ├── contracts/
│   ├── stripe/
│   └── match/
├── onboarding/page.tsx
└── page.tsx (LP)
lib/
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   ├── admin.ts
│   └── middleware.ts
├── stripe/
│   ├── client.ts
│   └── server.ts
└── utils/
    └── match-score.ts
types/
├── database.ts
└── index.ts
supabase/
└── migrations/
    ├── 001_initial_schema.sql
    └── 002_rls_policies.sql
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Supabaseセットアップ

1. [Supabase](https://supabase.com)でプロジェクト作成
2. `supabase/migrations/001_initial_schema.sql`を実行
3. `supabase/migrations/002_rls_policies.sql`を実行

### 4. Stripeセットアップ

1. [Stripe Dashboard](https://dashboard.stripe.com)でアカウント作成
2. Webhook URL設定: `https://your-domain.com/api/stripe/webhook`
3. Webhook eventsを設定:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `invoice.paid`
   - `invoice.payment_failed`

### 5. 開発サーバー起動

```bash
npm run dev
```

## API一覧

### 認証
- `POST /api/auth/signup` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/me` - ログインユーザー情報取得

### プロフィール
- `GET/POST /api/profile/engineer` - エンジニアプロフィール
- `GET/POST /api/profile/company` - 企業プロフィール

### 案件
- `POST /api/job` - 案件作成
- `GET/PATCH /api/job/:id` - 案件詳細・更新
- `POST /api/job/:id/publish` - 案件公開
- `POST /api/job/:id/pause` - 案件停止
- `POST /api/job/:id/close` - 案件終了
- `GET /api/jobs` - 案件検索
- `GET /api/jobs/:id` - 案件詳細
- `POST /api/jobs/:id/apply` - 応募

### 応募・メッセージ
- `GET /api/applications` - 応募一覧
- `PATCH /api/applications/:id` - 応募ステータス更新
- `GET/POST /api/conversations` - 会話一覧・作成
- `GET/POST /api/conversations/:id/messages` - メッセージ取得・送信

### 契約・決済
- `GET/POST /api/contracts` - 契約一覧・作成
- `GET /api/invoices` - 請求一覧
- `POST /api/stripe/customer` - Stripe顧客作成
- `POST /api/stripe/checkout` - 決済セッション作成
- `POST /api/stripe/webhook` - Webhook受信

### マッチング
- `POST /api/match/score` - マッチスコア計算

## 開発タスク

### フェーズ1: MVP（求人サイト基盤）
- [x] 認証（Supabase Auth）- signup/login/logout、role分岐
- [x] ロール別オンボーディング - 求職者/管理者選択→profiles作成
- [x] プロフィール管理 - 求職者プロフィール CRUD
- [ ] 求人データCSVインポート機能（管理者用）
- [x] 求人検索・閲覧 - 職種/勤務地/給与/雇用形態でフィルタ
- [x] 応募管理 - 応募作成、応募一覧、ステータス更新
- [ ] 応募情報の外部連携（紹介会社へ送信）
- [x] マッチスコア（簡易）- 希望条件との適合度計算

### フェーズ2: 初期リリース
- [ ] 50万件対応の検索最適化（インデックス設計）
- [ ] 求人レコメンデーション機能
- [ ] 通知（メール/アプリ内）
- [ ] お気に入り・閲覧履歴機能
- [ ] 応募トラッキングダッシュボード（管理者用）

### フェーズ3: 成長期
- [ ] AIによる求人マッチング（Embedding/RAG）
- [ ] 履歴書・職務経歴書のAI解析
- [ ] 分析ダッシュボード
- [ ] スマホアプリ対応

## ライセンス

Private - All rights reserved
