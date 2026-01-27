'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Mail, Lock, User, ArrowRight, Loader2, Users, Building2, Check } from 'lucide-react'

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'engineer'

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'engineer' | 'company'>(
    defaultRole === 'company' ? 'company' : 'engineer'
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '登録に失敗しました')
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-midnight-900 flex overflow-hidden">
      {/* Background Effects - Minimized */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="orb orb-cyan w-[400px] h-[400px] top-1/4 -right-40 opacity-15" />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-cyan-gradient flex items-center justify-center shadow-glow">
            <Zap className="w-6 h-6 text-midnight-900" />
          </div>
          <span className="text-3xl font-display font-bold text-white tracking-tight">
            Career<span className="gradient-text-cyan">Bridge</span>
          </span>
        </Link>

        <div className="max-w-md">
          <h1 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
            今すぐ始めて、
            <br />
            <span className="gradient-text">理想の出会いを</span>
          </h1>
          <p className="text-midnight-300 text-lg leading-relaxed mb-8">
            CareerBridgeは、AIエンジニアと企業を高精度でマッチング。
            契約から支払いまで、すべてをワンプラットフォームで。
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              'AI支援によるスキル抽出',
              '高精度マッチスコア',
              '安心の決済システム',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-glow/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-cyan-bright" />
                </div>
                <span className="text-midnight-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-midnight-400 text-sm">
          &copy; 2024 CareerBridge. All rights reserved.
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-gradient flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-midnight-900" />
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-tight">
              Career<span className="gradient-text-cyan">Bridge</span>
            </span>
          </Link>

          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                アカウント作成
              </h2>
              <p className="text-midnight-400">
                CareerBridgeに登録して始めましょう
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-midnight-200">
                  登録タイプ
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('engineer')}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-250 ease-out-expo hover-scale ${
                      role === 'engineer'
                        ? 'border-cyan-glow bg-cyan-glow/10'
                        : 'border-midnight-600/50 bg-midnight-800/30 hover:border-midnight-500'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-250 ${
                        role === 'engineer'
                          ? 'bg-cyan-glow/20'
                          : 'bg-midnight-700/50'
                      }`}>
                        <Users className={`w-5 h-5 transition-colors duration-250 ${
                          role === 'engineer' ? 'text-cyan-bright' : 'text-midnight-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium transition-colors duration-250 ${
                          role === 'engineer' ? 'text-white' : 'text-midnight-300'
                        }`}>
                          エンジニア
                        </div>
                        <div className="text-xs text-midnight-500">案件を探す</div>
                      </div>
                    </div>
                    {role === 'engineer' && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-glow flex items-center justify-center">
                        <Check className="w-3 h-3 text-midnight-900" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('company')}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-250 ease-out-expo hover-scale ${
                      role === 'company'
                        ? 'border-gold-bright bg-gold-bright/10'
                        : 'border-midnight-600/50 bg-midnight-800/30 hover:border-midnight-500'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-250 ${
                        role === 'company'
                          ? 'bg-gold-bright/20'
                          : 'bg-midnight-700/50'
                      }`}>
                        <Building2 className={`w-5 h-5 transition-colors duration-250 ${
                          role === 'company' ? 'text-gold-bright' : 'text-midnight-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium transition-colors duration-250 ${
                          role === 'company' ? 'text-white' : 'text-midnight-300'
                        }`}>
                          企業
                        </div>
                        <div className="text-xs text-midnight-500">人材を探す</div>
                      </div>
                    </div>
                    {role === 'company' && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold-bright flex items-center justify-center">
                        <Check className="w-3 h-3 text-midnight-900" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="displayName" className="block text-sm font-medium text-midnight-200">
                  表示名
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={role === 'company' ? '株式会社○○' : '山田 太郎'}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all duration-250 ease-out-expo input-focus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-midnight-200">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all duration-250 ease-out-expo input-focus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-midnight-200">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8文字以上"
                    minLength={8}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all duration-250 ease-out-expo input-focus"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-premium hover-scale w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      登録中...
                    </>
                  ) : (
                    <>
                      登録する
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-midnight-400 text-sm">
                既にアカウントをお持ちの方は{' '}
                <Link href="/login" className="text-cyan-bright hover:text-cyan-soft transition-colors duration-250 ease-out-expo font-medium link-underline">
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-midnight-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-bright animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
