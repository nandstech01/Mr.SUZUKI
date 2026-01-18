'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  Briefcase,
  Wifi,
  MapPin,
  Clock,
  Calendar,
  ArrowLeft,
  Send,
  Loader2,
  X,
  Check
} from 'lucide-react'
import type { JobPostWithCompany } from '@/types'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobPostWithCompany | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`)
        if (!res.ok) {
          throw new Error('Job not found')
        }
        const data = await res.json()
        setJob(data)
      } catch (error) {
        console.error('Failed to fetch job:', error)
        router.push('/engineer/jobs')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id, router])

  const handleApply = async () => {
    setApplying(true)
    try {
      const res = await fetch(`/api/jobs/${params.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cover_letter: coverLetter }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '応募に失敗しました')
      }

      alert('応募が完了しました')
      router.push('/engineer/applications')
    } catch (error) {
      alert(error instanceof Error ? error.message : '応募に失敗しました')
    } finally {
      setApplying(false)
      setShowApplyDialog(false)
    }
  }

  const engagementLabels: Record<string, string> = {
    freelance: 'フリーランス',
    sidejob: '副業',
    fulltime: '正社員',
  }

  const engagementColors: Record<string, { bg: string; text: string }> = {
    freelance: { bg: 'bg-cyan-glow/10', text: 'text-cyan-bright' },
    sidejob: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    fulltime: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return '要相談'
    if (min && max) return `${(min / 10000).toFixed(0)}〜${(max / 10000).toFixed(0)}万円/月`
    if (min) return `${(min / 10000).toFixed(0)}万円〜/月`
    if (max) return `〜${(max / 10000).toFixed(0)}万円/月`
    return '要相談'
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

  if (!job) {
    return null
  }

  const engColor = engagementColors[job.engagement] || engagementColors.freelance

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/engineer/jobs"
          className="inline-flex items-center gap-2 text-midnight-400 hover:text-cyan-bright transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          案件一覧に戻る
        </Link>

        {/* Main Card */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-midnight-700/50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-midnight-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company_profiles?.company_name}</span>
                  </div>
                  {job.company_profiles?.industry && (
                    <span className="text-midnight-600">|</span>
                  )}
                  {job.company_profiles?.industry && (
                    <span>{job.company_profiles.industry}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowApplyDialog(true)}
                className="btn-premium group flex-shrink-0"
              >
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  この案件に応募
                </span>
              </button>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 border-b border-midnight-700/50">
            <div className="p-6 border-r border-midnight-700/50">
              <div className="text-sm text-midnight-500 mb-1">月額報酬</div>
              <div className="font-display text-xl font-bold text-gold-bright">
                {formatBudget(job.budget_min_monthly_yen, job.budget_max_monthly_yen)}
              </div>
            </div>
            <div className="p-6 md:border-r border-midnight-700/50">
              <div className="text-sm text-midnight-500 mb-1">契約形態</div>
              <div className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${engColor.bg} ${engColor.text}`}>
                {engagementLabels[job.engagement]}
              </div>
            </div>
            <div className="p-6 col-span-2 md:col-span-1 border-t md:border-t-0 border-midnight-700/50">
              <div className="text-sm text-midnight-500 mb-1">勤務形態</div>
              <div className="flex items-center gap-2">
                {job.remote_ok ? (
                  <>
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">リモート可</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 text-midnight-400" />
                    <span className="text-white">オンサイト</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Description */}
            <div>
              <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-bright" />
                案件詳細
              </h2>
              <p className="text-midnight-300 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Must Have */}
            {job.must_have && (
              <div>
                <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  必須スキル・条件
                </h2>
                <p className="text-midnight-300 whitespace-pre-wrap leading-relaxed">
                  {job.must_have}
                </p>
              </div>
            )}

            {/* Nice to Have */}
            {job.nice_to_have && (
              <div>
                <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center text-gold-bright">+</span>
                  歓迎スキル・条件
                </h2>
                <p className="text-midnight-300 whitespace-pre-wrap leading-relaxed">
                  {job.nice_to_have}
                </p>
              </div>
            )}

            {/* Skills */}
            {job.job_skill_links && job.job_skill_links.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold text-white mb-4">
                  求めるスキル
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.job_skill_links.map((link) => (
                    <span
                      key={link.skill_id}
                      className="px-4 py-2 rounded-xl bg-cyan-glow/10 text-cyan-bright text-sm font-medium"
                    >
                      {link.skills?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-midnight-700/50">
              {(job.weekly_hours_min || job.weekly_hours_max) && (
                <div className="flex items-center gap-3 text-midnight-400">
                  <Clock className="w-5 h-5 text-midnight-500" />
                  <span className="text-midnight-500">稼働時間:</span>
                  <span className="text-white">
                    {job.weekly_hours_min && job.weekly_hours_max
                      ? `${job.weekly_hours_min}〜${job.weekly_hours_max}時間/週`
                      : job.weekly_hours_min
                      ? `${job.weekly_hours_min}時間〜/週`
                      : `〜${job.weekly_hours_max}時間/週`}
                  </span>
                </div>
              )}
              {job.duration_months && (
                <div className="flex items-center gap-3 text-midnight-400">
                  <Calendar className="w-5 h-5 text-midnight-500" />
                  <span className="text-midnight-500">契約期間:</span>
                  <span className="text-white">{job.duration_months}ヶ月</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-3 text-midnight-400">
                  <MapPin className="w-5 h-5 text-midnight-500" />
                  <span className="text-midnight-500">勤務地:</span>
                  <span className="text-white">{job.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 glass-card rounded-2xl p-6 text-center">
          <p className="text-midnight-400 mb-4">
            この案件に興味がありますか？
          </p>
          <button
            onClick={() => setShowApplyDialog(true)}
            className="btn-premium"
          >
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              この案件に応募する
            </span>
          </button>
        </div>
      </div>

      {/* Apply Dialog */}
      {showApplyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-midnight-900/80 backdrop-blur-sm"
            onClick={() => setShowApplyDialog(false)}
          />
          <div className="relative glass-card rounded-2xl max-w-lg w-full p-6 md:p-8 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setShowApplyDialog(false)}
              className="absolute top-4 right-4 p-2 text-midnight-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="font-display text-xl font-bold text-white mb-2">
              この案件に応募する
            </h2>
            <p className="text-midnight-400 text-sm mb-6">
              {job.title} - {job.company_profiles?.company_name}
            </p>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  カバーレター（任意）
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="自己PRやこの案件への意気込みを記載してください"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApplyDialog(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-midnight-600 text-midnight-300 hover:text-white hover:border-midnight-500 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {applying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      応募中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      応募する
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
