'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Plus,
  ChevronRight,
  Loader2,
  Users,
  Edit,
  Eye
} from 'lucide-react'

interface JobPost {
  id: string
  title: string
  engagement: string
  status: string
  budget_min_monthly_yen: number | null
  budget_max_monthly_yen: number | null
  created_at: string
  _count?: {
    applications: number
  }
}

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Note: This would need a dedicated company jobs endpoint
        // For now, we'll use a placeholder
        setJobs([])
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: '下書き', color: 'text-midnight-400', bg: 'bg-midnight-700/50' },
    open: { label: '募集中', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    paused: { label: '停止中', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    closed: { label: '終了', color: 'text-red-400', bg: 'bg-red-500/10' },
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
            <Loader2 className="w-8 h-8 text-gold-bright animate-spin" />
            <p className="text-midnight-400">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            案件管理
          </h1>
          <p className="text-midnight-400">
            {jobs.length}件の案件
          </p>
        </div>
        <Link href="/company/jobs/new">
          <button className="btn-premium hover-scale">
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新規作成
            </span>
          </button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-midnight-500" />
          </div>
          <p className="text-midnight-400 mb-4">
            まだ案件がありません
          </p>
          <Link href="/company/jobs/new">
            <button className="btn-premium hover-scale">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                最初の案件を作成
              </span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const status = statusConfig[job.status] || statusConfig.draft
            const engColor = engagementColors[job.engagement] || engagementColors.freelance

            return (
              <div
                key={job.id}
                className="glass-card rounded-2xl p-6 hover-lift border-hover"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <Link
                        href={`/company/jobs/${job.id}`}
                        className="font-display text-xl font-semibold text-white hover:text-gold-bright transition-colors duration-250 ease-out-expo tracking-tight"
                      >
                        {job.title}
                      </Link>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status.bg} ${status.color} flex-shrink-0 transition-colors duration-250`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs ${engColor.bg} ${engColor.text}`}>
                        {engagementLabels[job.engagement]}
                      </span>
                      <span className="text-gold-bright font-medium">
                        {formatBudget(job.budget_min_monthly_yen, job.budget_max_monthly_yen)}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-midnight-400">
                        <Users className="w-4 h-4" />
                        応募者: {job._count?.applications || 0}名
                      </span>
                      <span className="text-sm text-midnight-500">
                        作成日: {new Date(job.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/company/jobs/${job.id}/edit`}>
                      <button className="px-4 py-2 rounded-xl border border-midnight-600 text-midnight-300 hover:text-gold-bright hover:border-gold-bright/50 transition-all duration-250 ease-out-expo text-sm flex items-center gap-2 hover-scale">
                        <Edit className="w-4 h-4" />
                        編集
                      </button>
                    </Link>
                    <Link href={`/company/jobs/${job.id}`}>
                      <button className="px-4 py-2 rounded-xl border border-midnight-600 text-midnight-300 hover:text-gold-bright hover:border-gold-bright/50 transition-all duration-250 ease-out-expo text-sm flex items-center gap-2 hover-scale">
                        <Eye className="w-4 h-4" />
                        詳細
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
