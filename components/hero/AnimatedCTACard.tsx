'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Mail, LogIn, ShieldCheck } from 'lucide-react'

const AnimatedCTACard = memo(function AnimatedCTACard() {
  return (
    <div className="relative z-40 w-full max-w-3xl mx-auto px-4 -mt-8 animate-fade-in-up animation-delay-400">
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl text-center transform hover:scale-[1.01] transition-transform duration-300">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-5">
          プロフィールを作成して{' '}
          <span className="text-sky-500 underline decoration-2 underline-offset-4 decoration-dotted">非公開求人</span>
          {' '}にアクセス
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            メールで登録
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-transparent border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            ログイン
          </Link>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          2分で完了・安全な暗号化通信
        </p>
      </div>
    </div>
  )
})

export default AnimatedCTACard
