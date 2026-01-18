'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  MapPin,
  Clock,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  Wifi,
  Save,
  Loader2,
  ArrowLeft
} from 'lucide-react'

export default function EngineerProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    headline: '',
    bio: '',
    years_of_experience: '',
    location: '',
    remote_ok: true,
    availability_hours_per_week: '',
    desired_engagement: '',
    desired_min_monthly_yen: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/engineer')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setForm({
              headline: data.headline || '',
              bio: data.bio || '',
              years_of_experience: data.years_of_experience?.toString() || '',
              location: data.location || '',
              remote_ok: data.remote_ok ?? true,
              availability_hours_per_week: data.availability_hours_per_week?.toString() || '',
              desired_engagement: data.desired_engagement || '',
              desired_min_monthly_yen: data.desired_min_monthly_yen?.toString() || '',
              github_url: data.github_url || '',
              linkedin_url: data.linkedin_url || '',
              portfolio_url: data.portfolio_url || '',
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/profile/engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          years_of_experience: form.years_of_experience ? parseInt(form.years_of_experience) : null,
          availability_hours_per_week: form.availability_hours_per_week ? parseInt(form.availability_hours_per_week) : null,
          desired_min_monthly_yen: form.desired_min_monthly_yen ? parseInt(form.desired_min_monthly_yen) : null,
        }),
      })

      if (!res.ok) {
        throw new Error('保存に失敗しました')
      }

      router.push('/engineer/dashboard')
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-cyan-bright animate-spin" />
            <p className="text-midnight-400">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-midnight-400 hover:text-cyan-bright transition-colors duration-250 ease-out-expo mb-4 link-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </button>
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          プロフィール編集
        </h1>
        <p className="text-midnight-400">
          あなたのスキルや経験をアピールしましょう
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card rounded-2xl p-6 border-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
              <User className="w-5 h-5 text-cyan-bright icon-hover" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">基本情報</h2>
              <p className="text-sm text-midnight-400">プロフィールの基本情報を入力</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                ヘッドライン
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="例: MLエンジニア / 生成AI専門"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                自己紹介
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="あなたのスキル、経験、得意分野を記載してください"
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  経験年数
                </label>
                <input
                  type="number"
                  value={form.years_of_experience}
                  onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })}
                  placeholder="5"
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  所在地
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="東京都"
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card rounded-2xl p-6 border-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-bright/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-gold-bright icon-hover" />
            </div>
            <h2 className="font-display text-lg font-semibold text-white tracking-tight">希望条件</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-midnight-800/30">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-emerald-400" />
                <span className="text-white">リモートワーク可</span>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, remote_ok: !form.remote_ok })}
                className={`w-12 h-6 rounded-full transition-all ${
                  form.remote_ok ? 'bg-cyan-glow' : 'bg-midnight-600'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  form.remote_ok ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  稼働可能時間/週
                </label>
                <input
                  type="number"
                  value={form.availability_hours_per_week}
                  onChange={(e) => setForm({ ...form, availability_hours_per_week: e.target.value })}
                  placeholder="20"
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  希望契約形態
                </label>
                <select
                  value={form.desired_engagement}
                  onChange={(e) => setForm({ ...form, desired_engagement: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-cyan-glow/50"
                >
                  <option value="">選択してください</option>
                  <option value="freelance">フリーランス</option>
                  <option value="sidejob">副業</option>
                  <option value="fulltime">正社員</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                希望月額報酬（円）
              </label>
              <input
                type="number"
                value={form.desired_min_monthly_yen}
                onChange={(e) => setForm({ ...form, desired_min_monthly_yen: e.target.value })}
                placeholder="800000"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="glass-card rounded-2xl p-6 border-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-400 icon-hover" />
            </div>
            <h2 className="font-display text-lg font-semibold text-white tracking-tight">リンク</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                <Github className="w-4 h-4 inline mr-1" />
                GitHub
              </label>
              <input
                type="url"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                <Linkedin className="w-4 h-4 inline mr-1" />
                LinkedIn
              </label>
              <input
                type="url"
                value={form.linkedin_url}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                ポートフォリオ
              </label>
              <input
                type="url"
                value={form.portfolio_url}
                onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                placeholder="https://your-portfolio.com"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 btn-premium hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  保存する
                </>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-midnight-600 text-midnight-300 hover:text-white hover:border-midnight-500 transition-all duration-250 ease-out-expo hover-scale"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
