'use client'

import { memo } from 'react'

const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B1120]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-40"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(14, 165, 233, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Map SVG */}
      <svg
        className="absolute inset-0 w-full h-full min-w-[1000px] opacity-50 dark:opacity-100"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background areas */}
        <path
          d="M-100 600 C 200 550 500 700 800 650 S 1600 500 1600 500 V 900 H -100 Z"
          className="fill-slate-200/40 dark:fill-slate-800/40"
        />
        <path
          d="M-100 0 H 600 C 500 200 300 150 0 250 Z"
          className="fill-slate-200/30 dark:fill-slate-800/30"
        />

        {/* Main roads */}
        <path
          d="M-100 350 C 200 350 400 320 600 400 C 800 480 1100 420 1600 450"
          fill="none"
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeLinecap="round"
          strokeWidth="12"
        />
        <path
          d="M800 -100 L 800 1000"
          fill="none"
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="14"
        />
        <path
          d="M300 -100 L 450 1000"
          fill="none"
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="8"
        />
        <path
          d="M1250 -100 L 1100 1000"
          fill="none"
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="8"
        />
        <path
          d="M-100 200 Q 500 250 1600 150"
          fill="none"
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="8"
        />

        {/* Secondary roads */}
        <path d="M600 400 L 800 100" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="4" />
        <path d="M600 400 L 400 800" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="4" />
        <path d="M1100 420 L 1300 100" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="4" />
        <path d="M1100 420 L 1400 800" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="4" />

        {/* Glowing route lines */}
        <path
          d="M-100 350 C 200 350 400 320 600 400 C 800 480 1100 420 1600 450"
          fill="none"
          stroke="#0ea5e9"
          strokeDasharray="8 12"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
        <path
          d="M800 -100 L 800 1000"
          fill="none"
          stroke="#0ea5e9"
          strokeDasharray="20 40"
          strokeOpacity="0.2"
          strokeWidth="2"
        />

        {/* Glow circles */}
        <circle cx="800" cy="480" r="150" fill="#0ea5e9" fillOpacity="0.04" />
        <circle cx="300" cy="200" r="100" fill="#0ea5e9" fillOpacity="0.03" />
        <circle cx="1300" cy="600" r="120" fill="#0ea5e9" fillOpacity="0.03" />

        {/* Intersection points */}
        <circle cx="800" cy="480" r="4" fill="#38bdf8" className="animate-pulse" />
        <circle cx="600" cy="400" r="3" fill="#38bdf8" className="animate-pulse" />
        <circle cx="1100" cy="420" r="3" fill="#38bdf8" className="animate-pulse" />
      </svg>

      {/* Floating job markers */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Marker 1 - Top Left */}
        <div className="absolute top-[22%] left-[12%] flex items-center gap-2 animate-float-slow">
          <div className="relative">
            <div className="w-3.5 h-3.5 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)] animate-pulse-dot text-sky-500/30" />
            <div className="absolute -inset-3 border border-sky-500/20 rounded-full animate-ping-slow" />
          </div>
          <div className="hidden lg:block bg-white/95 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-[10px] text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded shadow-md">
            テック拠点: 204件
          </div>
        </div>

        {/* Marker 2 - Bottom Left */}
        <div className="absolute top-[55%] left-[6%] flex items-center gap-2 animate-float-slow-reverse">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.4)] animate-pulse" />
          <div className="hidden lg:block bg-white/95 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-[10px] text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded shadow-md">
            リモート
          </div>
        </div>

        {/* Marker 3 - Top Right */}
        <div className="absolute top-[30%] right-[10%] flex items-center flex-row-reverse gap-2 animate-float-delayed">
          <div className="relative">
            <div className="w-4 h-4 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <div className="hidden lg:block bg-white/95 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-white px-2 py-0.5 rounded text-right shadow-md">
            新着<br /><span className="text-xs font-bold text-sky-600 dark:text-sky-400">シニアエンジニア</span>
          </div>
        </div>

        {/* Marker 4 - Middle Right - small dots */}
        <div className="absolute top-[42%] right-[22%] flex items-center gap-1 opacity-50">
          <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
          <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
          <div className="w-2 h-2 bg-sky-500/40 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.3)]" />
        </div>
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(248,250,252,0.9) 85%)'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          background: 'radial-gradient(circle at center, transparent 25%, rgba(11,17,32,0.95) 80%)'
        }}
      />
    </div>
  )
})

export default AnimatedBackground
