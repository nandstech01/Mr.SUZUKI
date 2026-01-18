'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Mail, Lock, ArrowRight, Loader2, Users, Building2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCompany = searchParams.get('role') === 'company'
  const registered = searchParams.get('registered') === 'true'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'ログインに失敗しました')
      }

      router.push('/onboarding')
      router.refresh()
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
        <div className="orb orb-cyan w-[400px] h-[400px] -top-40 -left-40 opacity-15" />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-cyan-gradient flex items-center justify-center shadow-glow">
            <Zap className="w-6 h-6 text-midnight-900" />
          </div>
          <span className="text-3xl font-display font-bold text-white tracking-tight">
            AIMatch <span className="gradient-text-cyan">Pro</span>
          </span>
        </Link>

        <div className="max-w-md">
          <h1 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
            最適なマッチングで、
            <br />
            <span className="gradient-text">キャリアを加速</span>
          </h1>
          <p className="text-midnight-300 text-lg leading-relaxed">
            AIMatch Proは、AIエンジニアと企業を高精度でマッチング。
            副業・フリーランス・正社員、あなたに合った働き方を見つけましょう。
          </p>
        </div>

        <div className="text-midnight-400 text-sm">
          &copy; 2024 AIMatch Pro. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-gradient flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-midnight-900" />
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-tight">
              AIMatch <span className="gradient-text-cyan">Pro</span>
            </span>
          </Link>

          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                isCompany
                  ? 'bg-gold-bright/10 border border-gold-bright/30'
                  : 'bg-cyan-glow/10 border border-cyan-glow/30'
              }`}>
                {isCompany ? (
                  <Building2 className="w-4 h-4 text-gold-bright" />
                ) : (
                  <Users className="w-4 h-4 text-cyan-bright" />
                )}
                <span className={`text-sm font-medium ${
                  isCompany ? 'text-gold-bright' : 'text-cyan-bright'
                }`}>
                  {isCompany ? '企業ログイン' : 'エンジニアログイン'}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                おかえりなさい
              </h2>
              <p className="text-midnight-400">
                アカウントにログインしてください
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {registered && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-400">
                    ✅ 登録が完了しました！ログインしてください。
                  </p>
                </div>
              )}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

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
                    placeholder="••••••••"
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
                      ログイン中...
                    </>
                  ) : (
                    <>
                      ログイン
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 space-y-4 text-center">
              <p className="text-midnight-400 text-sm">
                アカウントをお持ちでない方は{' '}
                <Link
                  href={isCompany ? '/signup?role=company' : '/signup?role=engineer'}
                  className="text-cyan-bright hover:text-cyan-soft transition-colors duration-250 ease-out-expo font-medium link-underline"
                >
                  新規登録
                </Link>
              </p>
              <p className="text-midnight-500 text-sm">
                {isCompany ? (
                  <>
                    エンジニアの方は{' '}
                    <Link href="/login" className="text-cyan-bright hover:text-cyan-soft transition-colors duration-250 ease-out-expo font-medium link-underline">
                      エンジニアログイン
                    </Link>
                  </>
                ) : (
                  <>
                    企業の方は{' '}
                    <Link href="/login?role=company" className="text-gold-bright hover:text-gold-soft transition-colors duration-250 ease-out-expo font-medium link-underline">
                      企業ログイン
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
