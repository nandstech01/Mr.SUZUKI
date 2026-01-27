'use client'

import Link from 'next/link'
import { Sparkles, BarChart3, CreditCard, Users, Building2, TrendingUp, Zap, ArrowRight, CheckCircle2, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] overflow-hidden">
      {/* Refined Background - Sophisticated Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Primary gradient - deep blue to navy */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1424] via-[#0a0f1a] to-[#060a12]" />

        {/* Subtle radial glow - top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)]" />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

        {/* Horizontal line accents */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />
      </div>

      {/* Header - Refined */}
      <header className="relative z-50">
        <nav className="container mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            {/* Logo - Minimal */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105">
                <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-semibold text-white tracking-[-0.02em]">
                Career<span className="text-cyan-400">Bridge</span>
              </span>
            </Link>

            {/* Navigation - Clean */}
            <div className="hidden md:flex items-center gap-10">
              <Link href="/pricing" className="text-[15px] text-white/60 hover:text-white transition-colors duration-200 tracking-[-0.01em]">
                料金
              </Link>
              <Link href="#features" className="text-[15px] text-white/60 hover:text-white transition-colors duration-200 tracking-[-0.01em]">
                機能
              </Link>
              <Link href="#stats" className="text-[15px] text-white/60 hover:text-white transition-colors duration-200 tracking-[-0.01em]">
                実績
              </Link>
            </div>

            {/* Auth - Refined */}
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-[14px] text-white/70 hover:text-white transition-colors duration-200"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-[14px] font-medium text-white bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] rounded-lg transition-all duration-200"
              >
                無料登録
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Ultra Refined */}
      <main className="relative z-10">
        <section className="container mx-auto px-6 lg:px-12 pt-24 md:pt-32 pb-24 md:pb-40">
          <div className="max-w-4xl mx-auto">
            {/* Badge - Subtle */}
            <div
              className="flex justify-center mb-8 opacity-0 animate-[fadeIn_0.8s_ease-out_0.1s_forwards]"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[13px] text-white/50 tracking-[-0.01em]">
                  AIが最適なマッチングを実現
                </span>
              </div>
            </div>

            {/* Main Heading - Editorial Typography */}
            <h1
              className="text-center opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]"
            >
              <span className="block text-[clamp(2.5rem,6vw,4.5rem)] font-semibold text-white leading-[1.1] tracking-[-0.03em] mb-2">
                AIエンジニアと企業を
              </span>
              <span className="block text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  高精度マッチング
                </span>
              </span>
            </h1>

            {/* Subtitle - Refined Spacing */}
            <p
              className="text-center text-[17px] md:text-[19px] text-white/40 mt-8 mb-14 max-w-2xl mx-auto leading-[1.7] tracking-[-0.01em] opacity-0 animate-[fadeIn_0.8s_ease-out_0.35s_forwards]"
            >
              副業・フリーランス・正社員。
              <br className="hidden sm:block" />
              契約から支払いまで、すべてをワンプラットフォームで。
            </p>

            {/* CTA Buttons - Premium Feel */}
            <div
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-16 opacity-0 animate-[fadeIn_0.8s_ease-out_0.5s_forwards]"
            >
              <Link
                href="/signup?role=engineer"
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-[15px] font-medium text-white overflow-hidden rounded-xl transition-all duration-300"
              >
                {/* Button gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Users className="relative w-4.5 h-4.5" strokeWidth={2} />
                <span className="relative">エンジニアとして登録</span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2} />
              </Link>
              <Link
                href="/signup?role=company"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-[15px] font-medium text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.12] rounded-xl transition-all duration-300"
              >
                <Building2 className="w-4.5 h-4.5" strokeWidth={2} />
                <span>企業として登録</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2} />
              </Link>
            </div>

            {/* Trust Indicators - Minimal */}
            <div
              className="flex flex-wrap justify-center gap-x-8 gap-y-3 opacity-0 animate-[fadeIn_0.8s_ease-out_0.65s_forwards]"
            >
              <div className="flex items-center gap-2 text-[13px] text-white/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400/60" strokeWidth={2} />
                <span>無料で始められる</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-white/30">
                <Shield className="w-3.5 h-3.5 text-cyan-400/60" strokeWidth={2} />
                <span>安全な決済システム</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-white/30">
                <Zap className="w-3.5 h-3.5 text-cyan-400/60" strokeWidth={2} />
                <span>即日マッチング可能</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Refined */}
        <section id="features" className="container mx-auto px-6 lg:px-12 py-24 md:py-32">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <p className="text-[13px] uppercase tracking-[0.2em] text-cyan-400/70 mb-4">
              Features
            </p>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-white tracking-[-0.02em] mb-4">
              プラットフォームの特長
            </h2>
            <p className="text-[16px] text-white/40 max-w-xl mx-auto leading-[1.7]">
              最先端のAI技術と安心のシステムで、最適なマッチングを実現
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group p-6 lg:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mb-6">
                <Sparkles className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-[18px] font-semibold text-white mb-3 tracking-[-0.01em]">
                AI支援スキル抽出
              </h3>
              <p className="text-[15px] text-white/40 leading-[1.7]">
                LLMがプロフィールや案件からスキルを自動抽出。要件整理をサポートします。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 lg:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center mb-6">
                <BarChart3 className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-[18px] font-semibold text-white mb-3 tracking-[-0.01em]">
                高精度マッチスコア
              </h3>
              <p className="text-[15px] text-white/40 leading-[1.7]">
                スキル・予算・稼働条件を総合評価。最適な案件・人材をレコメンド。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 lg:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mb-6">
                <CreditCard className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-[18px] font-semibold text-white mb-3 tracking-[-0.01em]">
                安心の決済システム
              </h3>
              <p className="text-[15px] text-white/40 leading-[1.7]">
                Stripeによる安全な決済。契約・請求・支払いを一元管理。
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section - Refined */}
        <section id="stats" className="container mx-auto px-6 lg:px-12 py-24 md:py-32">
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] p-8 md:p-12 lg:p-16">
            {/* Subtle glow */}
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.03)_0%,transparent_70%)]" />

            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {/* Stat 1 */}
              <div className="text-center">
                <p className="text-[clamp(2rem,5vw,3rem)] font-semibold text-white tracking-[-0.02em] mb-1">
                  500<span className="text-cyan-400">+</span>
                </p>
                <p className="text-[13px] text-white/40 tracking-wide">登録エンジニア</p>
              </div>

              {/* Stat 2 */}
              <div className="text-center">
                <p className="text-[clamp(2rem,5vw,3rem)] font-semibold text-white tracking-[-0.02em] mb-1">
                  100<span className="text-amber-400">+</span>
                </p>
                <p className="text-[13px] text-white/40 tracking-wide">掲載企業</p>
              </div>

              {/* Stat 3 */}
              <div className="text-center">
                <p className="text-[clamp(2rem,5vw,3rem)] font-semibold text-white tracking-[-0.02em] mb-1">
                  85<span className="text-emerald-400">%</span>
                </p>
                <p className="text-[13px] text-white/40 tracking-wide">マッチング率</p>
              </div>

              {/* Stat 4 */}
              <div className="text-center">
                <p className="text-[clamp(2rem,5vw,3rem)] font-semibold text-white tracking-[-0.02em] mb-1">
                  ¥120<span className="text-purple-400">万</span>
                </p>
                <p className="text-[13px] text-white/40 tracking-wide">平均月収</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Refined */}
        <section className="container mx-auto px-6 lg:px-12 py-24 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-white tracking-[-0.02em] mb-5">
              今すぐ始めましょう
            </h2>
            <p className="text-[16px] text-white/40 mb-10 leading-[1.7]">
              登録は無料。最適なマッチングで、あなたのキャリアを加速させます。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="/signup?role=engineer"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-medium text-white overflow-hidden rounded-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">エンジニア登録</span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2} />
              </Link>
              <Link
                href="/signup?role=company"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-medium text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.12] rounded-xl transition-all duration-300"
              >
                <span>企業登録</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Refined */}
      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="container mx-auto px-6 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] font-semibold text-white tracking-[-0.01em]">
                Career<span className="text-cyan-400">Bridge</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/pricing" className="text-[14px] text-white/40 hover:text-white transition-colors duration-200">
                料金
              </Link>
              <Link href="#" className="text-[14px] text-white/40 hover:text-white transition-colors duration-200">
                利用規約
              </Link>
              <Link href="#" className="text-[14px] text-white/40 hover:text-white transition-colors duration-200">
                プライバシーポリシー
              </Link>
              <Link href="#" className="text-[14px] text-white/40 hover:text-white transition-colors duration-200">
                お問い合わせ
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-[13px] text-white/30">
              &copy; 2024 CareerBridge
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
