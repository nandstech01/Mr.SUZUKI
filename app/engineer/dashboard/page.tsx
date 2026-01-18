'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Clock,
  Calendar,
  Briefcase,
  ArrowRight,
  Search,
  Building2,
  TrendingUp,
  Loader2
} from 'lucide-react'

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  interviewScheduled: number
  activeContracts: number
}

export default function EngineerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    interviewScheduled: 0,
    activeContracts: 0,
  })
  const [recentApplications, setRecentApplications] = useState<Array<{
    id: string
    status: string
    job_posts: {
      title: string
      company_profiles: { company_name: string }
    }
    created_at: string
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsRes, contractsRes] = await Promise.all([
          fetch('/api/applications'),
          fetch('/api/contracts'),
        ])

        const applications = await applicationsRes.json()
        const contracts = await contractsRes.json()

        if (Array.isArray(applications)) {
          setStats({
            totalApplications: applications.length,
            pendingApplications: applications.filter((a: { status: string }) =>
              ['applied', 'screening'].includes(a.status)
            ).length,
            interviewScheduled: applications.filter((a: { status: string }) =>
              a.status === 'interview'
            ).length,
            activeContracts: Array.isArray(contracts)
              ? contracts.filter((c: { status: string }) => c.status === 'active').length
              : 0,
          })
          setRecentApplications(applications.slice(0, 5))
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    applied: { label: '応募済み', color: 'text-midnight-300', bg: 'bg-midnight-700/50' },
    screening: { label: '選考中', color: 'text-cyan-bright', bg: 'bg-cyan-glow/10' },
    interview: { label: '面談予定', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    offer: { label: 'オファー', color: 'text-gold-bright', bg: 'bg-gold-bright/10' },
    accepted: { label: '承認済み', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    rejected: { label: '不採用', color: 'text-red-400', bg: 'bg-red-500/10' },
    withdrawn: { label: '辞退', color: 'text-midnight-400', bg: 'bg-midnight-700/50' },
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
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            ダッシュボード
          </h1>
          <p className="text-midnight-400">
            あなたの活動状況をひと目で確認
          </p>
        </div>
        <Link href="/engineer/jobs">
          <button className="btn-premium hover-scale group">
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              案件を探す
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-250 ease-out-expo" />
            </span>
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Applications */}
        <div className="glass-card rounded-2xl p-6 hover-lift border-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-midnight-700/50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-midnight-300 icon-hover" />
            </div>
            <TrendingUp className="w-5 h-5 text-cyan-bright" />
          </div>
          <div className="font-display text-3xl font-bold text-white mb-1 tracking-tight">
            {stats.totalApplications}
          </div>
          <p className="text-sm text-midnight-400">応募総数</p>
        </div>

        {/* Pending */}
        <div className="glass-card rounded-2xl p-6 hover-lift border-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-cyan-bright icon-hover" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-cyan-bright mb-1 tracking-tight">
            {stats.pendingApplications}
          </div>
          <p className="text-sm text-midnight-400">選考中</p>
        </div>

        {/* Interview */}
        <div className="glass-card rounded-2xl p-6 hover-lift border-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-400 icon-hover" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-emerald-400 mb-1 tracking-tight">
            {stats.interviewScheduled}
          </div>
          <p className="text-sm text-midnight-400">面談予定</p>
        </div>

        {/* Active Contracts */}
        <div className="glass-card rounded-2xl p-6 hover-lift border-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-400 icon-hover" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-purple-400 mb-1 tracking-tight">
            {stats.activeContracts}
          </div>
          <p className="text-sm text-midnight-400">契約中</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="glass-card rounded-2xl overflow-hidden border-hover">
        <div className="p-6 border-b border-midnight-700/50">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-white tracking-tight">
              最近の応募
            </h2>
            <Link
              href="/engineer/applications"
              className="text-sm text-cyan-bright hover:text-cyan-soft transition-colors duration-250 ease-out-expo flex items-center gap-1 link-underline"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-midnight-700/50">
          {recentApplications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-midnight-500" />
              </div>
              <p className="text-midnight-400 mb-4">
                まだ応募がありません
              </p>
              <Link href="/engineer/jobs">
                <button className="btn-outline-premium hover-scale text-sm">
                  <span className="flex items-center gap-2">
                    案件を探す
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </Link>
            </div>
          ) : (
            recentApplications.map((application) => {
              const status = statusConfig[application.status] || statusConfig.applied
              return (
                <div
                  key={application.id}
                  className="p-4 table-row-hover"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-midnight-700/50 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-midnight-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate">
                          {application.job_posts?.title}
                        </div>
                        <div className="text-sm text-midnight-400 truncate">
                          {application.job_posts?.company_profiles?.company_name}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status.bg} ${status.color} flex-shrink-0 transition-colors duration-250`}>
                      {status.label}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
