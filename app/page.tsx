import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            AIMatch Pro
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-slate-200">
                ログイン
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                新規登録
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6">
            AIエンジニアと企業を
            <br />
            <span className="text-blue-400">高精度マッチング</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10">
            副業・フリーランス・正社員。
            <br />
            契約から支払いまで、すべてをワンプラットフォームで。
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup?role=engineer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                エンジニアとして登録
              </Button>
            </Link>
            <Link href="/signup?role=company">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                企業として登録
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI支援スキル抽出
            </h3>
            <p className="text-slate-400">
              LLMがプロフィールや案件からスキルを自動抽出。
              要件整理をサポートします。
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              高精度マッチスコア
            </h3>
            <p className="text-slate-400">
              スキル・予算・稼働条件を総合評価。
              最適な案件・人材をレコメンド。
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              安心の決済システム
            </h3>
            <p className="text-slate-400">
              Stripeによる安全な決済。
              契約・請求・支払いを一元管理。
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400">500+</div>
            <div className="text-slate-400 mt-2">登録エンジニア</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400">100+</div>
            <div className="text-slate-400 mt-2">掲載企業</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400">85%</div>
            <div className="text-slate-400 mt-2">マッチング率</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400">¥120万</div>
            <div className="text-slate-400 mt-2">平均月収</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 mt-20 border-t border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400">
            &copy; 2024 AIMatch Pro. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-slate-400 hover:text-white">
              料金
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white">
              利用規約
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
