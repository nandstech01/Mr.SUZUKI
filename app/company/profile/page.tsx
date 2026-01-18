'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  Globe,
  Users,
  FileText,
  Save,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function CompanyProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    company_name: '',
    website_url: '',
    industry: '',
    company_size: '',
    description: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/company')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setForm({
              company_name: data.company_name || '',
              website_url: data.website_url || '',
              industry: data.industry || '',
              company_size: data.company_size || '',
              description: data.description || '',
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
      const res = await fetch('/api/profile/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('保存に失敗しました')
      }

      router.push('/company/dashboard')
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
            <Loader2 className="w-8 h-8 text-gold-bright animate-spin" />
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
        <Link
          href="/company/dashboard"
          className="inline-flex items-center gap-2 text-midnight-400 hover:text-gold-bright transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          企業プロフィール編集
        </h1>
        <p className="text-midnight-400">
          企業情報を入力してエンジニアにアピールしましょう
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-bright/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gold-bright" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">基本情報</h2>
              <p className="text-sm text-midnight-400">企業の基本情報を入力</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                会社名 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                placeholder="株式会社○○"
                required
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                WebサイトURL
              </label>
              <input
                type="url"
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  業種
                </label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-gold-bright/50"
                >
                  <option value="">選択してください</option>
                  <option value="IT・通信">IT・通信</option>
                  <option value="金融">金融</option>
                  <option value="製造">製造</option>
                  <option value="小売">小売</option>
                  <option value="医療・ヘルスケア">医療・ヘルスケア</option>
                  <option value="教育">教育</option>
                  <option value="メディア・エンタメ">メディア・エンタメ</option>
                  <option value="その他">その他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  会社規模
                </label>
                <select
                  value={form.company_size}
                  onChange={(e) => setForm({ ...form, company_size: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-gold-bright/50"
                >
                  <option value="">選択してください</option>
                  <option value="1-10">1-10名</option>
                  <option value="11-50">11-50名</option>
                  <option value="51-200">51-200名</option>
                  <option value="201-500">201-500名</option>
                  <option value="501-1000">501-1000名</option>
                  <option value="1001+">1001名以上</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-bright" />
            </div>
            <h2 className="font-display text-lg font-semibold text-white">会社紹介</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight-200 mb-2">
              会社紹介文
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="会社の事業内容、ミッション、カルチャーなどを記載してください"
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-6 py-3 rounded-xl border border-midnight-600 text-midnight-300 hover:text-white hover:border-midnight-500 transition-all"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
