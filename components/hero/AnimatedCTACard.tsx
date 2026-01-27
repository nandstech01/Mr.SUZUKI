'use client'

import { memo } from 'react'
import Link from 'next/link'
import { MessageCircle, LogIn, ShieldCheck, Clock } from 'lucide-react'

const AnimatedCTACard = memo(function AnimatedCTACard() {
  return (
    <div className="relative z-40 w-full max-w-3xl mx-auto px-4 -mt-8 animate-fade-in-up animation-delay-400">
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl text-center transform hover:scale-[1.01] transition-transform duration-300">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-5">
          最短{' '}
          <span className="text-green-500 underline decoration-2 underline-offset-4 decoration-dotted">10秒</span>
          {' '}で応募完了
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/apply"
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            かんたんLINE応募
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-transparent border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            ログイン
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-green-500" />
            最短10秒
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            安全な通信
          </span>
        </div>
      </div>
    </div>
  )
})

export default AnimatedCTACard
