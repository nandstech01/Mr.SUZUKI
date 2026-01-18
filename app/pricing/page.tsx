'use client'

import Link from 'next/link'
import { Check, Zap, Users, Building2, ArrowRight, HelpCircle, CreditCard, Calendar, Wallet, FileText } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-midnight-900 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="orb orb-cyan w-[500px] h-[500px] -top-20 -right-20 opacity-30" />
        <div className="orb orb-gold w-[400px] h-[400px] bottom-40 -left-20 opacity-20" style={{ animationDelay: '7s' }} />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-midnight-700/50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-cyan-gradient flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                  <Zap className="w-5 h-5 text-midnight-900" />
                </div>
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight">
                AIMatch <span className="gradient-text-cyan">Pro</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <button className="px-5 py-2.5 text-midnight-100 hover:text-white font-medium transition-colors duration-200">
                  ログイン
                </button>
              </Link>
              <Link href="/signup">
                <button className="btn-premium px-6 py-2.5 text-sm">
                  <span>新規登録</span>
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 opacity-0 animate-fade-in-up">
              シンプルな
              <span className="gradient-text">料金体系</span>
            </h1>
            <p className="text-xl text-midnight-200 opacity-0 animate-fade-in-up animation-delay-100">
              成約時のみ手数料が発生。登録・掲載は完全無料。
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* エンジニア向け */}
            <div className="relative opacity-0 animate-fade-in-up animation-delay-200">
              <div className="feature-card h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-glow/20 to-cyan-bright/10 flex items-center justify-center border border-cyan-glow/20">
                    <Users className="w-6 h-6 text-cyan-bright" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">エンジニア向け</h2>
                    <p className="text-midnight-400 text-sm">案件を探しているエンジニアの方</p>
                  </div>
                </div>

                <div className="mb-8">
                  <span className="font-display text-5xl font-bold gradient-text-cyan">無料</span>
                </div>

                <ul className="space-y-4 flex-1">
                  {[
                    'プロフィール作成・公開',
                    '案件検索・閲覧',
                    '応募（無制限）',
                    '企業とのメッセージ',
                    'マッチスコア表示',
                    '安心の支払いシステム',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-glow/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-cyan-bright" />
                      </div>
                      <span className="text-midnight-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup?role=engineer" className="block mt-8">
                  <button className="btn-outline-premium w-full group">
                    <span className="flex items-center justify-center gap-2">
                      エンジニアとして登録
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {/* 企業向け */}
            <div className="relative opacity-0 animate-fade-in-up animation-delay-300">
              {/* Recommended Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-glow to-gold-bright text-midnight-900 text-sm font-semibold shadow-glow">
                  おすすめ
                </div>
              </div>

              <div className="feature-card h-full flex flex-col border-cyan-glow/30 relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-glow/5 to-transparent pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-bright/20 to-gold-soft/10 flex items-center justify-center border border-gold-bright/20">
                      <Building2 className="w-6 h-6 text-gold-bright" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white">企業向け</h2>
                      <p className="text-midnight-400 text-sm">エンジニアを探している企業の方</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="font-display text-5xl font-bold text-gold-bright">15%</span>
                    <span className="text-midnight-300 ml-2">/ 成約時</span>
                  </div>

                  <p className="text-sm text-midnight-400 mb-8 leading-relaxed">
                    契約成立時の月額報酬に対してのみ手数料が発生します。
                    <br />
                    登録・案件掲載は完全無料です。
                  </p>

                  <ul className="space-y-4 flex-1">
                    {[
                      '企業プロフィール作成',
                      '案件掲載（無制限）',
                      '応募者の閲覧・管理',
                      'エンジニアとのメッセージ',
                      'マッチスコアによる候補者評価',
                      '契約・請求管理',
                      'Stripe決済による安心の支払い',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold-bright/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-gold-bright" />
                        </div>
                        <span className="text-midnight-200">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup?role=company" className="block mt-8">
                    <button className="btn-premium w-full group">
                      <span className="flex items-center justify-center gap-2">
                        企業として登録
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <HelpCircle className="w-4 h-4 text-cyan-bright" />
                <span className="text-sm font-medium text-midnight-100">FAQ</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white">
                よくある質問
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Calendar,
                  question: '手数料はいつ発生しますか？',
                  answer: '契約が成立し、実際に稼働が始まった時点から手数料が発生します。登録、案件掲載、応募、メッセージのやり取りなどは一切無料です。',
                },
                {
                  icon: CreditCard,
                  question: '支払い方法は？',
                  answer: 'Stripeを利用したクレジットカード決済に対応しています。毎月の請求は自動的に作成され、ダッシュボードから簡単に支払いができます。',
                },
                {
                  icon: Wallet,
                  question: 'エンジニアへの報酬はどうやって支払われますか？',
                  answer: '企業からの支払いを受領後、プラットフォーム手数料を差し引いた金額がエンジニアの登録口座に振り込まれます。',
                },
                {
                  icon: FileText,
                  question: '契約期間に縛りはありますか？',
                  answer: '最低契約期間などの縛りはありません。企業とエンジニアの双方合意のもと、柔軟に契約期間を設定できます。',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="glass-card rounded-2xl p-6 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-midnight-700/50 flex items-center justify-center flex-shrink-0">
                      <faq.icon className="w-5 h-5 text-cyan-bright" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-midnight-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="absolute inset-0 bg-cyan-glow/5 rounded-3xl blur-3xl" />
            <div className="relative glass-card rounded-3xl p-12">
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                準備はできましたか？
              </h2>
              <p className="text-midnight-200 text-lg mb-8">
                今すぐ無料で始めて、最適なマッチングを体験しましょう。
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <button className="btn-premium group w-full sm:w-auto">
                    <span className="flex items-center justify-center gap-2">
                      無料で始める
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
                <Link href="/">
                  <button className="btn-outline-premium w-full sm:w-auto">
                    <span>トップページへ戻る</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-midnight-700">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-gradient flex items-center justify-center">
                <Zap className="w-4 h-4 text-midnight-900" />
              </div>
              <span className="font-display font-bold text-white">AIMatch Pro</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/pricing" className="text-cyan-bright font-medium">
                料金
              </Link>
              <Link href="#" className="text-midnight-300 hover:text-cyan-bright transition-colors duration-200">
                利用規約
              </Link>
              <Link href="#" className="text-midnight-300 hover:text-cyan-bright transition-colors duration-200">
                プライバシーポリシー
              </Link>
            </div>
            <p className="text-midnight-400 text-sm">
              &copy; 2024 AIMatch Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
