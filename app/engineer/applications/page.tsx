'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Building2,
  ChevronRight,
  Loader2,
  X,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react'

interface Application {
  id: string
  status: string
  match_score: number
  cover_letter: string | null
  created_at: string
  job_posts: {
    id: string
    title: string
    engagement: string
    status: string
    budget_min_monthly_yen: number | null
    budget_max_monthly_yen: number | null
    company_profiles: {
      company_name: string
    }
  }
}

export default function EngineerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/applications')
        if (res.ok) {
          const data = await res.json()
          setApplications(data)
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const handleWithdraw = async (id: string) => {
    if (!confirm('この応募を取り下げますか？')) return

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'withdrawn' }),
      })

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: 'withdrawn' } : app
          )
        )
      }
    } catch (error) {
      console.error('Failed to withdraw application:', error)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    applied: { label: '応募済み', color: 'text-midnight-300', bg: 'bg-midnight-700/50' },
    screening: { label: '選考中', color: 'text-cyan-bright', bg: 'bg-cyan-glow/10' },
    interview: { label: '面談予定', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    offer: { label: 'オファー', color: 'text-gold-bright', bg: 'bg-gold-bright/10' },
    accepted: { label: '承認済み', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    rejected: { label: '不採用', color: 'text-red-400', bg: 'bg-red-500/10' },
    withdrawn: { label: '辞退', color: 'text-midnight-500', bg: 'bg-midnight-800/50' },
  }

  const engagementLabels: Record<string, string> = {
    freelance: 'フリーランス',
    sidejob: '副業',
    fulltime: '正社員',
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return '要相談'
    if (min && max) return `${(min / 10000).toFixed(0)}〜${(max / 10000).toFixed(0)}万円`
    if (min) return `${(min / 10000).toFixed(0)}万円〜`
    if (max) return `〜${(max / 10000).toFixed(0)}万円`
    return '要相談'
  }

  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter((app) => app.status === statusFilter)

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
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            応募一覧
          </h1>
          <p className="text-midnight-400">
            {applications.length}件の応募
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-midnight-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-cyan-glow/50 min-w-[160px]"
          >
            <option value="all">すべて</option>
            <option value="applied">応募済み</option>
            <option value="screening">選考中</option>
            <option value="interview">面談予定</option>
            <option value="offer">オファー</option>
            <option value="accepted">承認済み</option>
            <option value="rejected">不採用</option>
            <option value="withdrawn">辞退</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-midnight-500" />
          </div>
          <p className="text-midnight-400 mb-4">
            {statusFilter === 'all' ? 'まだ応募がありません' : '該当する応募がありません'}
          </p>
          <Link href="/engineer/jobs">
            <button className="btn-premium hover-scale">
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                案件を探す
              </span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const status = statusConfig[application.status] || statusConfig.applied
            return (
              <div
                key={application.id}
                className="glass-card rounded-2xl p-6 hover-lift border-hover"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <Link
                        href={`/engineer/jobs/${application.job_posts.id}`}
                        className="font-display text-xl font-semibold text-white hover:text-cyan-bright transition-colors duration-250 ease-out-expo tracking-tight"
                      >
                        {application.job_posts.title}
                      </Link>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status.bg} ${status.color} flex-shrink-0 transition-colors duration-250`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-midnight-400 mb-4">
                      <Building2 className="w-4 h-4" />
                      <span>{application.job_posts.company_profiles?.company_name}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-midnight-400">
                        {engagementLabels[application.job_posts.engagement]}
                      </span>
                      <span className="text-gold-bright font-medium">
                        {formatBudget(
                          application.job_posts.budget_min_monthly_yen,
                          application.job_posts.budget_max_monthly_yen
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-cyan-bright">
                        <TrendingUp className="w-4 h-4" />
                        マッチ度 {application.match_score}%
                      </span>
                      <span className="text-midnight-500">
                        応募日: {new Date(application.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {['applied', 'screening'].includes(application.status) && (
                      <button
                        onClick={() => handleWithdraw(application.id)}
                        className="px-4 py-2 rounded-xl border border-midnight-600 text-midnight-400 hover:text-red-400 hover:border-red-500/50 transition-all duration-250 ease-out-expo text-sm hover-scale"
                      >
                        取り下げ
                      </button>
                    )}
                    {application.status === 'offer' && (
                      <button className="btn-premium hover-scale text-sm">
                        <span>オファーを確認</span>
                      </button>
                    )}
                    <Link href={`/engineer/jobs/${application.job_posts.id}`}>
                      <button className="p-2 rounded-xl hover:bg-midnight-700/50 text-midnight-400 hover:text-cyan-bright transition-all duration-250 ease-out-expo">
                        <ChevronRight className="w-5 h-5" />
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
