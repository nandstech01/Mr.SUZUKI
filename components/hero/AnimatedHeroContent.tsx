'use client'

import { memo } from 'react'
import Image from 'next/image'
import { TrendingUp, Building2 } from 'lucide-react'

const AnimatedHeroContent = memo(function AnimatedHeroContent() {
  return (
    <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center animate-fade-in">
      {/* Badge */}
      <div className="mb-4 inline-flex items-center px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg animate-float-slow">
        <svg className="w-4 h-4 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-sky-200">グローバル求人マップ</span>
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 drop-shadow-sm dark:drop-shadow-2xl animate-fade-in-up animation-delay-100">
        <span>Career</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400">Bridge</span>
      </h1>

      {/* Subtitle with stats */}
      <div className="inline-block relative mb-6 animate-fade-in-up animation-delay-200">
        <span className="absolute -inset-4 bg-sky-500/10 blur-xl rounded-full" />
        <p className="relative text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300">
          <span className="bg-sky-500/10 dark:bg-sky-500/20 px-3 py-1 rounded text-sky-600 dark:text-sky-400 border border-sky-500/30">500,000+</span>
          <span className="ml-2 text-slate-500 dark:text-slate-400">件の求人</span>
        </p>
      </div>

      {/* Hero Visual with Floating Cards */}
      <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[520px] flex justify-center items-end animate-fade-in-up animation-delay-300">

        {/* Left Card - Market Signal */}
        <div className="absolute left-0 lg:left-4 top-[28%] z-30 animate-float-slow hidden md:block hover:scale-105 transition-transform duration-300">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-sky-500/30 border-l-4 border-l-sky-500 p-4 rounded-xl shadow-xl dark:shadow-[0_4px_30px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(14,165,233,0.05)] max-w-[220px]">
            <div className="flex items-center gap-3 mb-2 border-b border-slate-200 dark:border-slate-700/50 pb-2">
              <div className="p-1.5 bg-sky-500/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-sky-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wide">市場トレンド</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              +124% <span className="text-xs font-normal text-slate-500 dark:text-slate-400 align-middle">需要増</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-3">IT・AI分野が急成長中</div>
            <div className="flex items-end gap-1 h-8 w-full">
              <div className="w-1/6 bg-slate-200 dark:bg-slate-700 h-[30%] rounded-sm" />
              <div className="w-1/6 bg-slate-300 dark:bg-slate-600 h-[50%] rounded-sm" />
              <div className="w-1/6 bg-sky-200 dark:bg-sky-900 h-[40%] rounded-sm" />
              <div className="w-1/6 bg-sky-300 dark:bg-sky-700 h-[70%] rounded-sm" />
              <div className="w-1/6 bg-sky-400 dark:bg-sky-500 h-[85%] rounded-sm" />
              <div className="w-1/6 bg-sky-500 h-[100%] rounded-sm shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
            </div>
          </div>
        </div>

        {/* Right Card - Top Employers */}
        <div className="absolute right-0 lg:right-4 top-[22%] z-30 animate-float-slow-reverse hidden md:block hover:scale-105 transition-transform duration-300">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-orange-500/30 border-l-4 border-l-orange-500 p-4 rounded-xl shadow-xl dark:shadow-[0_4px_30px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(249,115,22,0.05)] max-w-[200px]">
            <div className="flex items-center gap-3 mb-3 border-b border-slate-200 dark:border-slate-700/50 pb-2">
              <div className="p-1.5 bg-orange-500/20 rounded-lg">
                <Building2 className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wide">提携企業</span>
            </div>
            <div className="flex -space-x-3 overflow-hidden mb-3 pl-1 py-1">
              <div className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-white">A</div>
              <div className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-white">G</div>
              <div className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-400 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">M</div>
              <div className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-orange-500 flex items-center justify-center text-[9px] text-white font-bold shadow-[0_0_12px_rgba(249,115,22,0.4)]">+2k</div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              <span>採用率</span>
              <span className="text-orange-500 font-bold">非常に高い</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1">
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-1 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]" style={{ width: '92%' }} />
            </div>
          </div>
        </div>

        {/* Floating status badge */}
        <div className="absolute bottom-[32%] left-[26%] z-40 animate-float-delayed opacity-0 lg:opacity-100 hidden lg:block">
          <div className="bg-slate-900/90 dark:bg-black/70 backdrop-blur-md border border-slate-700/50 dark:border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 transform -rotate-6 shadow-lg hover:scale-110 transition-transform">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-white font-mono">内定獲得</span>
          </div>
        </div>

        {/* Center Visual - Hero Image */}
        <div className="relative z-20 h-full w-auto flex items-end justify-center pointer-events-none select-none">
          {/* Glow effect */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-sky-500/10 dark:bg-sky-500/15 blur-3xl animate-glow-pulse" />

          <Image
            src="/hero-woman.png"
            alt="キャリアアドバイザー"
            width={480}
            height={600}
            className="h-full max-h-[400px] md:max-h-[520px] w-auto object-contain object-bottom brightness-105 drop-shadow-xl dark:drop-shadow-[0_0_30px_rgba(14,165,233,0.15)]"
            style={{
              maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
            }}
            priority
          />

          {/* Bottom fade overlay */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-1/3 bg-gradient-to-t from-slate-50 dark:from-[#0B1120] via-slate-50/90 dark:via-[#0B1120]/90 to-transparent z-30" />
        </div>
      </div>
    </div>
  )
})

export default AnimatedHeroContent
