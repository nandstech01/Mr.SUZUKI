import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AIMatch Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">ログイン</Button>
            </Link>
            <Link href="/signup">
              <Button>新規登録</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">シンプルな料金体系</h1>
          <p className="text-xl text-muted-foreground">
            成約時のみ手数料が発生。登録・掲載は完全無料。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* エンジニア向け */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">エンジニア向け</CardTitle>
              <CardDescription>案件を探しているエンジニアの方</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">無料</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>プロフィール作成・公開</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>案件検索・閲覧</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>応募（無制限）</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>企業とのメッセージ</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>マッチスコア表示</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>安心の支払いシステム</span>
                </li>
              </ul>
              <Link href="/signup?role=engineer" className="block mt-8">
                <Button className="w-full" size="lg">
                  エンジニアとして登録
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 企業向け */}
          <Card className="relative border-blue-600 border-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
              おすすめ
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">企業向け</CardTitle>
              <CardDescription>エンジニアを探している企業の方</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">15%</span>
                <span className="text-muted-foreground ml-2">/ 成約時</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                契約成立時の月額報酬に対してのみ手数料が発生します。
                <br />
                登録・案件掲載は完全無料です。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>企業プロフィール作成</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>案件掲載（無制限）</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>応募者の閲覧・管理</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>エンジニアとのメッセージ</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>マッチスコアによる候補者評価</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>契約・請求管理</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Stripe決済による安心の支払い</span>
                </li>
              </ul>
              <Link href="/signup?role=company" className="block mt-8">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  企業として登録
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">手数料はいつ発生しますか？</h3>
              <p className="text-muted-foreground">
                契約が成立し、実際に稼働が始まった時点から手数料が発生します。
                登録、案件掲載、応募、メッセージのやり取りなどは一切無料です。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">支払い方法は？</h3>
              <p className="text-muted-foreground">
                Stripeを利用したクレジットカード決済に対応しています。
                毎月の請求は自動的に作成され、ダッシュボードから簡単に支払いができます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">エンジニアへの報酬はどうやって支払われますか？</h3>
              <p className="text-muted-foreground">
                企業からの支払いを受領後、プラットフォーム手数料を差し引いた金額が
                エンジニアの登録口座に振り込まれます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">契約期間に縛りはありますか？</h3>
              <p className="text-muted-foreground">
                最低契約期間などの縛りはありません。
                企業とエンジニアの双方合意のもと、柔軟に契約期間を設定できます。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400">
              &copy; 2024 AIMatch Pro. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900">
                料金
              </Link>
              <Link href="#" className="text-slate-600 hover:text-slate-900">
                利用規約
              </Link>
              <Link href="#" className="text-slate-600 hover:text-slate-900">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
