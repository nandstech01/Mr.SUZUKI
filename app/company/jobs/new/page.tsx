'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Wifi,
  Save,
  Send,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function NewJobPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    engagement: '',
    location: '',
    remote_ok: true,
    weekly_hours_min: '',
    weekly_hours_max: '',
    duration_months: '',
    budget_min_monthly_yen: '',
    budget_max_monthly_yen: '',
    must_have: '',
    nice_to_have: '',
  })

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Create job
      const createRes = await fetch('/api/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          weekly_hours_min: form.weekly_hours_min ? parseInt(form.weekly_hours_min) : null,
          weekly_hours_max: form.weekly_hours_max ? parseInt(form.weekly_hours_max) : null,
          duration_months: form.duration_months ? parseInt(form.duration_months) : null,
          budget_min_monthly_yen: form.budget_min_monthly_yen ? parseInt(form.budget_min_monthly_yen) : null,
          budget_max_monthly_yen: form.budget_max_monthly_yen ? parseInt(form.budget_max_monthly_yen) : null,
        }),
      })

      if (!createRes.ok) {
        const data = await createRes.json()
        throw new Error(data.error || '案件の作成に失敗しました')
      }

      const job = await createRes.json()

      // Publish if requested
      if (publish) {
        const publishRes = await fetch(`/api/job/${job.id}/publish`, {
          method: 'POST',
        })

        if (!publishRes.ok) {
          alert('案件は作成されましたが、公開に失敗しました')
        }
      }

      router.push('/company/jobs')
    } catch (error) {
      alert(error instanceof Error ? error.message : '案件の作成に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-2 text-midnight-400 hover:text-gold-bright transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          案件一覧に戻る
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          案件を作成
        </h1>
        <p className="text-midnight-400">
          新しい案件を作成してエンジニアを募集しましょう
        </p>
      </div>

      <form className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-bright/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-gold-bright" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">基本情報</h2>
              <p className="text-sm text-midnight-400">案件の基本情報を入力</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                タイトル <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="例: 生成AIを活用したチャットボット開発"
                required
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                案件詳細 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="案件の詳細、求める役割、チーム構成などを記載してください"
                rows={6}
                required
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  契約形態 <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.engagement}
                  onChange={(e) => setForm({ ...form, engagement: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-gold-bright/50"
                >
                  <option value="">選択してください</option>
                  <option value="freelance">フリーランス</option>
                  <option value="sidejob">副業</option>
                  <option value="fulltime">正社員</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  勤務地
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="東京都渋谷区"
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-midnight-800/30">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-emerald-400" />
                <span className="text-white">リモートワーク可</span>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, remote_ok: !form.remote_ok })}
                className={`w-12 h-6 rounded-full transition-all ${
                  form.remote_ok ? 'bg-gold-bright' : 'bg-midnight-600'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  form.remote_ok ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Working Conditions */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-bright" />
            </div>
            <h2 className="font-display text-lg font-semibold text-white">稼働条件</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  最低稼働時間/週
                </label>
                <input
                  type="number"
                  value={form.weekly_hours_min}
                  onChange={(e) => setForm({ ...form, weekly_hours_min: e.target.value })}
                  placeholder="10"
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  最大稼働時間/週
                </label>
                <input
                  type="number"
                  value={form.weekly_hours_max}
                  onChange={(e) => setForm({ ...form, weekly_hours_max: e.target.value })}
                  placeholder="40"
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                契約期間（月）
              </label>
              <input
                type="number"
                value={form.duration_months}
                onChange={(e) => setForm({ ...form, duration_months: e.target.value })}
                placeholder="6"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="font-display text-lg font-semibold text-white">報酬</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                月額下限（円）
              </label>
              <input
                type="number"
                value={form.budget_min_monthly_yen}
                onChange={(e) => setForm({ ...form, budget_min_monthly_yen: e.target.value })}
                placeholder="600000"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                月額上限（円）
              </label>
              <input
                type="number"
                value={form.budget_max_monthly_yen}
                onChange={(e) => setForm({ ...form, budget_max_monthly_yen: e.target.value })}
                placeholder="1200000"
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="font-display text-lg font-semibold text-white">スキル要件</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                必須スキル・条件
              </label>
              <textarea
                value={form.must_have}
                onChange={(e) => setForm({ ...form, must_have: e.target.value })}
                placeholder="- Python 3年以上&#10;- 機械学習の実務経験&#10;- LLMを使った開発経験"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                歓迎スキル・条件
              </label>
              <textarea
                value={form.nice_to_have}
                onChange={(e) => setForm({ ...form, nice_to_have: e.target.value })}
                placeholder="- MLOps経験&#10;- AWS/GCPでのデプロイ経験&#10;- チームリード経験"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="flex-1 px-6 py-3 rounded-xl border border-midnight-600 text-midnight-300 hover:text-white hover:border-midnight-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              下書き保存
            </span>
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
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
                  <Send className="w-5 h-5" />
                  公開する
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
