'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  Loader2,
  Briefcase,
  Filter,
  Building2,
  AlertTriangle
} from 'lucide-react'
import type { JobStatus } from '@/types/database'

interface Job {
  id: string
  title: string
  company_name: string
  status: JobStatus
  engagement: string
  budget_min_monthly_yen: number | null
  budget_max_monthly_yen: number | null
  created_at: string
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const res = await fetch(`/api/admin/jobs?${params}`)
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      const res = await fetch(`/api/admin/jobs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status: newStatus }),
      })

      if (res.ok) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j))
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
    setOpenDropdown(null)
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm('この案件を削除しますか？')) return

    try {
      const res = await fetch(`/api/admin/jobs?jobId=${jobId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== jobId))
      }
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
    setOpenDropdown(null)
  }

  const statusConfig: Record<JobStatus, { label: string; color: string; bg: string; border: string }> = {
    draft: { label: '下書き', color: 'text-midnight-400', bg: 'bg-midnight-700/50', border: 'border-midnight-600/50' },
    open: { label: '公開中', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    paused: { label: '一時停止', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    closed: { label: '終了', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  }

  const engagementLabels: Record<string, string> = {
    freelance: 'フリーランス',
    sidejob: '副業',
    fulltime: '正社員',
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return '-'
    if (min && max) return `¥${(min / 10000).toFixed(0)}〜${(max / 10000).toFixed(0)}万`
    if (min) return `¥${(min / 10000).toFixed(0)}万〜`
    return `〜¥${(max! / 10000).toFixed(0)}万`
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">案件管理</h1>
          <p className="text-midnight-400 mt-1">掲載案件の管理・ステータス変更</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">{jobs.length}件</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
              <input
                type="text"
                placeholder="案件タイトルで検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all font-medium"
            >
              検索
            </button>
          </form>
          <div className="relative">
            <div className="flex items-center gap-2 text-midnight-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm">ステータス:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-2 w-full md:w-44 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="all">全て</option>
              <option value="draft">下書き</option>
              <option value="open">公開中</option>
              <option value="paused">一時停止</option>
              <option value="closed">終了</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
            <p className="text-midnight-400">読み込み中...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-midnight-700/50 bg-midnight-800/30">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">タイトル</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">企業</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">ステータス</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">予算</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">作成日</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-midnight-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const status = statusConfig[job.status]
                  return (
                    <tr
                      key={job.id}
                      className="border-b border-midnight-700/30 last:border-0 hover:bg-midnight-800/20 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-white mb-1">{job.title}</p>
                          <p className="text-xs text-midnight-500">
                            {engagementLabels[job.engagement] || job.engagement}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gold-bright/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-gold-bright" />
                          </div>
                          <span className="text-sm text-midnight-300">{job.company_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gold-bright font-medium">
                          {formatBudget(job.budget_min_monthly_yen, job.budget_max_monthly_yen)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-midnight-400">
                        {new Date(job.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === job.id ? null : job.id)}
                          className="p-2 rounded-lg hover:bg-midnight-700/50 text-midnight-400 hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {openDropdown === job.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-6 top-full mt-1 z-20 w-44 py-2 rounded-xl bg-midnight-800 border border-midnight-700/50 shadow-xl shadow-black/20 animate-scale-in">
                              <button
                                onClick={() => handleStatusChange(job.id, 'open')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-midnight-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                公開する
                              </button>
                              <button
                                onClick={() => handleStatusChange(job.id, 'paused')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-midnight-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                              >
                                <EyeOff className="w-4 h-4" />
                                一時停止
                              </button>
                              <button
                                onClick={() => handleStatusChange(job.id, 'closed')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-midnight-300 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                終了
                              </button>
                              <div className="my-2 border-t border-midnight-700/50" />
                              <button
                                onClick={() => handleDelete(job.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                削除
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <Briefcase className="w-12 h-12 text-midnight-600 mx-auto mb-3" />
                      <p className="text-midnight-500">案件が見つかりません</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
