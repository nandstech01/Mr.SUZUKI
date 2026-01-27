# CareerBridge（キャリアブリッジ）

求職者と企業案件をマッチングする求人プラットフォーム。

## 概要

### ターゲットユーザー
- **企業**: AI/データ活用を推進したいスタートアップ〜中堅・大企業
- **人材**: AIエンジニア、MLエンジニア、データサイエンティスト、MLOps、生成AIエンジニア

### 解決する課題
- **企業**: AI人材不足、スキル評価の難しさ、採用コスト高、スピード不足
- **人材**: 高単価案件の継続獲得、営業/契約事務の負担、報酬未払いリスク

### 差別化ポイント
- AI支援のスキル抽出・要件整理（LLM補助）
- 案件×人材の適合度スコア（初期はルール+検索、後にML/Embeddingへ拡張）
- Stripe + Supabaseで契約/支払い/請求を標準化
- 週2〜/フルリモート等の柔軟条件に最適化した検索体験

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

## 未完了タスク

### フェーズ1: MVP
- [x] 認証（Supabase Auth）- signup/login/logout、role分岐
- [x] ロール別オンボーディング - engineer/company選択→profiles作成
- [x] プロフィール管理 - engineer_profiles/company_profiles CRUD
- [x] 案件CRUD - 企業が案件作成/編集/公開/停止/終了
- [x] 案件検索・閲覧 - engagement/remote/budget/skillでフィルタ
- [x] 応募管理 - 応募作成、応募一覧、ステータス更新
- [x] メッセージ - 企業↔エンジニアの会話/送受信
- [x] マッチスコア（簡易）- skill_overlap + budget_fit + availability_fit
- [x] Stripe決済（企業側）- Customer作成、Checkout、Webhookで請求状態更新
- [x] 契約管理（簡易）- accepted→contract作成、請求紐付け

### フェーズ2: 初期リリース
- [ ] スキル抽出支援（LLM補助）
- [ ] 評価機能（簡易）
- [ ] 通知（メール/アプリ内）
- [ ] 企業向け検索（スカウト）
- [ ] マージン/手数料設定UI（admin）

### フェーズ3: 成長期
- [ ] Embedding/RAGマッチング
- [ ] スキルテスト
- [ ] 分析ダッシュボード
- [ ] コミュニティ機能

## ライセンス

Private - All rights reserved
