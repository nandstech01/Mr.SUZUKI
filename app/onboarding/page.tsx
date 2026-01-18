'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  ArrowRight,
  User,
  Briefcase,
  FileSearch,
  Loader2,
  CheckCircle,
  Rocket
} from 'lucide-react'
import type { ProfileWithDetails } from '@/types'

export default function OnboardingPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/me')
        if (!res.ok) {
          router.push('/login')
          return
        }
        const data = await res.json()
        setProfile(data)

        // If profile already complete, redirect to dashboard
        if (data.role === 'engineer' && data.engineer_profile) {
          router.push('/engineer/dashboard')
        } else if (data.role === 'company' && data.company_profile) {
          router.push('/company/dashboard')
        }
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-bright animate-spin" />
          <p className="text-midnight-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const handleContinue = () => {
    if (profile.role === 'engineer') {
      router.push('/engineer/profile')
    } else {
      router.push('/company/profile')
    }
  }

  const isEngineer = profile.role === 'engineer'
  const accentColor = isEngineer ? 'cyan' : 'gold'

  const steps = isEngineer
    ? [
        { label: 'プロフィールを作成', description: '基本情報とスキルを登録', active: true },
        { label: 'スキルを登録', description: '得意な技術をアピール', active: false },
        { label: '案件に応募', description: 'あなたに合った仕事を探す', active: false },
      ]
    : [
        { label: '企業プロフィールを作成', description: '会社情報を登録', active: true },
        { label: '案件を投稿', description: '求めるスキルを明確に', active: false },
        { label: '応募者を確認', description: 'AIがマッチング', active: false },
      ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,${isEngineer ? 'rgba(34,211,238,0.1)' : 'rgba(212,175,55,0.1)'},transparent_50%)]`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.08),transparent_50%)]" />
      </div>

      <div className="relative w-full max-w-lg animate-fade-in-up">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${isEngineer ? 'bg-cyan-glow/20' : 'bg-gold-bright/20'}`}>
              <Rocket className={`w-8 h-8 ${isEngineer ? 'text-cyan-bright' : 'text-gold-bright'}`} />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-3">
              ようこそ、{profile.display_name}さん!
            </h1>
            <p className="text-midnight-400">
              {isEngineer
                ? 'エンジニアプロフィールを設定して、案件を探しましょう'
                : '企業プロフィールを設定して、エンジニアを探しましょう'}
            </p>
          </div>

          {/* Steps */}
          <div className="mb-8">
            <div className={`rounded-2xl p-6 ${isEngineer ? 'bg-cyan-glow/5 border border-cyan-glow/20' : 'bg-gold-bright/5 border border-gold-bright/20'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={`w-5 h-5 ${isEngineer ? 'text-cyan-bright' : 'text-gold-bright'}`} />
                <h3 className="font-semibold text-white">次のステップ</h3>
              </div>
              <ul className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm ${
                      step.active
                        ? isEngineer
                          ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-gradient-to-br from-gold-bright to-yellow-600 text-midnight-900 shadow-lg shadow-gold-bright/30'
                        : 'bg-midnight-700/50 text-midnight-400'
                    }`}>
                      {step.active ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.active ? 'text-white' : 'text-midnight-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-midnight-500">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleContinue}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 group ${
              isEngineer
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40'
                : 'bg-gradient-to-r from-gold-bright to-yellow-500 text-midnight-900 hover:from-yellow-400 hover:to-gold-bright shadow-lg shadow-gold-bright/30 hover:shadow-xl hover:shadow-gold-bright/40'
            }`}
          >
            プロフィールを設定する
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-midnight-500 text-sm mt-6">
          プロフィール設定は後からいつでも変更できます
        </p>
      </div>
    </div>
  )
}
