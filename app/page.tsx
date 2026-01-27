'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles, Zap, ArrowRight, Database, Star,
  Menu, Twitter, Linkedin, TrendingUp, Building2, ChevronRight,
  Rocket, Code, BarChart3
} from 'lucide-react'
import { AnimatedBackground, AnimatedHeroContent, AnimatedCTACard } from '@/components/hero'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white antialiased selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md px-4 py-3 lg:px-10 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="キャリアブリッジ"
              width={220}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex gap-6">
            <Link className="text-slate-600 dark:text-slate-300 hover:text-[#3CC8E8] text-sm font-medium transition-colors" href="/jobs">
              求人を探す
            </Link>
            <Link className="text-slate-600 dark:text-slate-300 hover:text-[#3CC8E8] text-sm font-medium transition-colors" href="/for-recruiters">
              採用担当者の方へ
            </Link>
          </nav>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <Link
              href="/login"
              className="flex items-center justify-center rounded-lg h-9 px-4 bg-transparent border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center rounded-lg h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              無料登録
            </Link>
          </div>
        </div>
        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <Menu className="w-7 h-7 text-slate-700 dark:text-white" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-6 pb-8 overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
          {/* Animated Background */}
          <AnimatedBackground />

          {/* Animated Hero Content */}
          <AnimatedHeroContent />

          {/* Animated CTA Card */}
          <AnimatedCTACard />
        </section>

        {/* Trusted Companies */}
        <section className="py-14 bg-slate-100 dark:bg-[#080d17] border-b border-slate-200 dark:border-white/5">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs font-bold text-[#3CC8E8] dark:text-[#3CC8E8]/70 uppercase tracking-[0.2em] mb-10">業界をリードする企業が信頼</p>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 opacity-70 hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white hover:text-[#3CC8E8] transition-colors"><Zap className="w-6 h-6" /> TechFlow</div>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white hover:text-[#3CC8E8] transition-colors"><Database className="w-6 h-6" /> GlobalSystems</div>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white hover:text-[#3CC8E8] transition-colors"><Building2 className="w-6 h-6" /> CubeSoft</div>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white hover:text-[#3CC8E8] transition-colors"><Sparkles className="w-6 h-6" /> InfinityCorp</div>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white hover:text-[#3CC8E8] transition-colors"><Star className="w-6 h-6" /> PrimeAsset</div>
            </div>
          </div>
        </section>

        {/* Proven Results Section */}
        <section className="py-24 bg-white dark:bg-[#0b1120] relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 opacity-20 dark:opacity-20" style={{
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, rgba(60, 200, 232, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(60, 200, 232, 0.1) 1px, transparent 1px)'
          }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block relative mb-4">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white relative z-10">実績紹介</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">プロフェッショナルがキャリアと年収をレベルアップした実例をご覧ください。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Result Card 1 */}
              <div className="bg-white dark:bg-[#131c2a] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden group hover:border-[#3CC8E8]/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(60,200,232,0.15)] transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-[#3CC8E8] to-blue-600"></div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-[#3CC8E8] -rotate-45" />
                  </div>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-[#3CC8E8]/10 border border-[#3CC8E8]/30 text-[#3CC8E8] text-xs font-bold rounded-md uppercase tracking-wide mb-4">
                      +150万円 アップ
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">前</span>
                        <span className="text-lg font-bold text-slate-500 line-through decoration-red-500/50 decoration-2">700万円</span>
                      </div>
                      <div className="mb-2 text-[#3CC8E8]">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#3CC8E8] uppercase font-bold mb-1">後</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">850万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent mb-4"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">マーケティング</span>
                    <span className="text-slate-500">30代</span>
                  </div>
                </div>
              </div>

              {/* Result Card 2 */}
              <div className="bg-white dark:bg-[#131c2a] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-orange-400 to-red-600"></div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-orange-500 -rotate-45" />
                  </div>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold rounded-md uppercase tracking-wide mb-4">
                      +280万円 アップ
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">前</span>
                        <span className="text-lg font-bold text-slate-500 line-through decoration-red-500/50 decoration-2">920万円</span>
                      </div>
                      <div className="mb-2 text-orange-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-orange-500 uppercase font-bold mb-1">後</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">1200万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent mb-4"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">シニアエンジニア</span>
                    <span className="text-slate-500">20代</span>
                  </div>
                </div>
              </div>

              {/* Result Card 3 */}
              <div className="bg-white dark:bg-[#131c2a] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden group hover:border-[#3CC8E8]/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(60,200,232,0.15)] transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-[#3CC8E8] to-blue-600"></div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-[#3CC8E8] -rotate-45" />
                  </div>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-[#3CC8E8]/10 border border-[#3CC8E8]/30 text-[#3CC8E8] text-xs font-bold rounded-md uppercase tracking-wide mb-4">
                      +120万円 アップ
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">前</span>
                        <span className="text-lg font-bold text-slate-500 line-through decoration-red-500/50 decoration-2">650万円</span>
                      </div>
                      <div className="mb-2 text-[#3CC8E8]">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#3CC8E8] uppercase font-bold mb-1">後</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">770万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent mb-4"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">プロジェクトリード</span>
                    <span className="text-slate-500">40代</span>
                  </div>
                </div>
              </div>

              {/* Result Card 4 */}
              <div className="bg-white dark:bg-[#131c2a] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-orange-400 to-red-600"></div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-orange-500 -rotate-45" />
                  </div>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold rounded-md uppercase tracking-wide mb-4">
                      +200万円 アップ
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">前</span>
                        <span className="text-lg font-bold text-slate-500 line-through decoration-red-500/50 decoration-2">550万円</span>
                      </div>
                      <div className="mb-2 text-orange-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-orange-500 uppercase font-bold mb-1">後</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">750万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent mb-4"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">データアナリスト</span>
                    <span className="text-slate-500">20代</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <button className="group bg-transparent hover:bg-[#3CC8E8]/10 text-slate-900 dark:text-white font-bold py-3 px-10 rounded-full border border-[#3CC8E8]/50 shadow-sm hover:shadow-md dark:shadow-[0_0_15px_rgba(60,200,232,0.2)] dark:hover:shadow-[0_0_25px_rgba(60,200,232,0.4)] transition-all flex items-center gap-3 mx-auto">
                もっと見る
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0b1120] dark:to-[#05080f]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-16">
              <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-3">500,000+ 件の求人</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white text-center">注目の成長企業求人</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Job Card 1 */}
              <div className="bg-white dark:bg-[#131c2a] border border-slate-200 dark:border-white/10 rounded-xl p-8 hover:translate-y-[-6px] transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3CC8E8] to-blue-500 dark:from-white dark:to-slate-300 rounded-xl flex items-center justify-center text-white dark:text-[#0b1120] font-bold shadow-lg">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-xl group-hover:text-[#3CC8E8] transition-colors">プロダクトデザイナー</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">FinTech Corp • リモート</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-medium">正社員</span>
                  <span className="px-3 py-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-medium">シニア</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-white/10">
                  <span className="text-[#3CC8E8] font-bold text-lg">900万円 - 1400万円</span>
                  <button className="text-slate-700 dark:text-white hover:text-orange-500 transition-colors text-sm font-bold flex items-center gap-1">
                    詳細 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Job Card 2 */}
              <div className="bg-white dark:bg-[#131c2a] border border-slate-200 dark:border-white/10 rounded-xl p-8 hover:translate-y-[-6px] transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3CC8E8] to-blue-500 dark:from-white dark:to-slate-300 rounded-xl flex items-center justify-center text-white dark:text-[#0b1120] font-bold shadow-lg">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-xl group-hover:text-[#3CC8E8] transition-colors">バックエンドエンジニア</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">CloudSystems • 東京</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-medium">業務委託</span>
                  <span className="px-3 py-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-medium">Golang</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-white/10">
                  <span className="text-[#3CC8E8] font-bold text-lg">1000万円 - 1500万円</span>
                  <button className="text-slate-700 dark:text-white hover:text-orange-500 transition-colors text-sm font-bold flex items-center gap-1">
                    詳細 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Job Card 3 */}
              <div className="bg-white dark:bg-[#131c2a] border border-slate-200 dark:border-white/10 rounded-xl p-8 hover:translate-y-[-6px] transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3CC8E8] to-blue-500 dark:from-white dark:to-slate-300 rounded-xl flex items-center justify-center text-white dark:text-[#0b1120] font-bold shadow-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-xl group-hover:text-[#3CC8E8] transition-colors">グロースマネージャー</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">StartupInc • ハイブリッド</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-medium">正社員</span>
                  <span className="px-3 py-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-medium">B2B</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-white/10">
                  <span className="text-[#3CC8E8] font-bold text-lg">800万円 - 1200万円</span>
                  <button className="text-slate-700 dark:text-white hover:text-orange-500 transition-colors text-sm font-bold flex items-center gap-1">
                    詳細 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Jobs Counter */}
            <div className="mt-16 bg-white dark:bg-[#131c2a] border border-[#3CC8E8]/30 rounded-2xl p-8 text-center max-w-4xl mx-auto shadow-lg dark:shadow-[0_0_40px_rgba(60,200,232,0.1)]">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">現在の求人数: <span className="text-[#3CC8E8] text-3xl font-black mx-2">524,301</span>件</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex justify-center items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                更新: 本日
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-[#3CC8E8] to-blue-600 dark:from-[#0a365c] dark:to-[#0b1120]">
          <div className="absolute inset-0 bg-white/10 dark:bg-[#0b1120] dark:opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 dark:from-sky-900/20 to-transparent"></div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-500/30 dark:bg-orange-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/30 dark:bg-[#3CC8E8]/20 rounded-full blur-[100px]"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-8">
              検索をやめて。<span className="text-white/90 dark:text-[#3CC8E8]">見つけよう。</span>
            </h2>
            <p className="text-white/80 dark:text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              プロフェッショナルのキャリア管理を変えるプラットフォームに参加しましょう。データ駆動、透明性、求職者は完全無料。
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
              <Link
                href="/signup?role=engineer"
                className="px-10 h-14 bg-white text-[#3CC8E8] dark:text-[#0a365c] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all flex items-center justify-center"
              >
                無料で始める
              </Link>
              <Link
                href="/signup?role=company"
                className="px-10 h-14 bg-transparent border-2 border-white/40 hover:border-white/70 hover:bg-white/10 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center"
              >
                求人を掲載する
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-[#05080f] border-t border-slate-200 dark:border-white/5 py-16 px-4 lg:px-40">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="キャリアブリッジ"
                  width={160}
                  height={36}
                  className="h-8 w-auto dark:brightness-0 dark:invert"
                />
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">インテリジェントなデータマッチングとAIインサイトで、才能と機会をつなぐ。</p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 dark:text-white font-bold mb-2">求職者向け</h4>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="/jobs">求人を探す</Link>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="#">給与ツール</Link>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="#">キャリアアドバイス</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 dark:text-white font-bold mb-2">採用担当者向け</h4>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="/signup?role=company">求人を掲載</Link>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="#">採用ソリューション</Link>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="/pricing">料金プラン</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 dark:text-white font-bold mb-2">サポート</h4>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="#">ヘルプセンター</Link>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="#">利用規約</Link>
              <Link className="text-slate-500 hover:text-[#3CC8E8] text-sm transition-colors" href="#">プライバシーポリシー</Link>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 dark:text-slate-600 text-sm">© 2024 CareerBridge Inc. 無断転載を禁じます。</p>
            <div className="flex gap-6">
              <a className="text-slate-400 dark:text-slate-500 hover:text-[#3CC8E8] transition-colors" href="#">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-5 h-5" />
              </a>
              <a className="text-slate-400 dark:text-slate-500 hover:text-[#3CC8E8] transition-colors" href="#">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
