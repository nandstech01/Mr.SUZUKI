'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Briefcase,
  Wifi,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react'
import type { JobPostWithCompany } from '@/types'

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPostWithCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [engagement, setEngagement] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (engagement) params.set('engagement', engagement)
      if (remoteOnly) params.set('remote', 'true')

      const res = await fetch(`/api/jobs?${params.toString()}`)
      const data = await res.json()
      setJobs(data.data || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [engagement, remoteOnly])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
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

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          案件を探す
        </h1>
        <p className="text-midnight-400">
          あなたにぴったりの案件を見つけましょう
        </p>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-2xl p-4 md:p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードで検索..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all duration-250 ease-out-expo input-focus"
            />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-midnight-300"
          >
            <Filter className="w-5 h-5" />
            フィルター
          </button>

          {/* Filters (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Engagement Select */}
            <select
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
              className="px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-cyan-glow/50 min-w-[160px]"
            >
              <option value="">契約形態</option>
              <option value="freelance">フリーランス</option>
              <option value="sidejob">副業</option>
              <option value="fulltime">正社員</option>
            </select>

            {/* Remote Toggle */}
            <label className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-midnight-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                remoteOnly
                  ? 'bg-cyan-glow border-cyan-glow'
                  : 'border-midnight-500'
              }`}>
                {remoteOnly && <Wifi className="w-3 h-3 text-midnight-900" />}
              </div>
              <span className="text-sm whitespace-nowrap">リモート可</span>
            </label>

            {/* Search Button */}
            <button type="submit" className="btn-premium hover-scale px-6 py-3">
              <span>検索</span>
            </button>
          </div>
        </form>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="md:hidden mt-4 pt-4 border-t border-midnight-700/50 space-y-4">
            <select
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-cyan-glow/50"
            >
              <option value="">契約形態</option>
              <option value="freelance">フリーランス</option>
              <option value="sidejob">副業</option>
              <option value="fulltime">正社員</option>
            </select>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                remoteOnly
                  ? 'bg-cyan-glow border-cyan-glow'
                  : 'border-midnight-500'
              }`}>
                {remoteOnly && <Wifi className="w-3 h-3 text-midnight-900" />}
              </div>
              <span className="text-midnight-300">リモート可のみ</span>
            </label>

            <button type="submit" onClick={handleSearch} className="btn-premium hover-scale w-full">
              <span>検索</span>
            </button>
          </div>
        )}

        {/* Active Filters */}
        {(engagement || remoteOnly) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-midnight-700/50">
            {engagement && (
              <button
                onClick={() => setEngagement('')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-glow/10 text-cyan-bright text-sm"
              >
                {engagementLabels[engagement]}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {remoteOnly && (
              <button
                onClick={() => setRemoteOnly(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm"
              >
                リモート可
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-cyan-bright animate-spin" />
            <p className="text-midnight-400">案件を検索中...</p>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-midnight-500" />
          </div>
          <p className="text-midnight-400 mb-2">該当する案件が見つかりませんでした</p>
          <p className="text-midnight-500 text-sm">検索条件を変更してお試しください</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-midnight-400 text-sm mb-4">
            {jobs.length}件の案件が見つかりました
          </p>

          {jobs.map((job) => {
            const engColor = engagementColors[job.engagement] || engagementColors.freelance
            return (
              <Link
                key={job.id}
                href={`/engineer/jobs/${job.id}`}
                className="block glass-card rounded-2xl p-6 hover-lift border-hover group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title & Company */}
                    <h3 className="font-display text-xl font-semibold text-white group-hover:text-cyan-bright transition-colors duration-250 ease-out-expo mb-2 tracking-tight">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-midnight-400 mb-4">
                      <Building2 className="w-4 h-4" />
                      <span>{job.company_profiles?.company_name}</span>
                    </div>

                    {/* Description */}
                    <p className="text-midnight-400 text-sm line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {job.remote_ok && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">
                          <Wifi className="w-3 h-3" />
                          リモート可
                        </span>
                      )}
                      {job.job_skill_links?.slice(0, 4).map((link) => (
                        <span
                          key={link.skill_id}
                          className="px-2.5 py-1 rounded-lg bg-midnight-700/50 text-midnight-300 text-xs transition-colors duration-250"
                        >
                          {link.skills?.name}
                        </span>
                      ))}
                      {(job.job_skill_links?.length || 0) > 4 && (
                        <span className="text-xs text-midnight-500">
                          +{(job.job_skill_links?.length || 0) - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side Info */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-2 md:text-right flex-shrink-0">
                    <div>
                      <div className="font-display text-xl font-bold text-gold-bright tracking-tight">
                        {formatBudget(job.budget_min_monthly_yen, job.budget_max_monthly_yen)}
                      </div>
                      <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium mt-1 ${engColor.bg} ${engColor.text}`}>
                        {engagementLabels[job.engagement]}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-midnight-500 group-hover:text-cyan-bright group-hover:translate-x-1 transition-all duration-250 ease-out-expo" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
