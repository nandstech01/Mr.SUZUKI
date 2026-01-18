'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Users,
  FileText,
  FileSignature,
  Plus,
  ChevronRight,
  Loader2,
  TrendingUp,
  Building2
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DashboardStats {
  totalJobs: number
  openJobs: number
  totalApplications: number
  activeContracts: number
}

export default function CompanyDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
    activeContracts: 0,
  })
  const [recentApplications, setRecentApplications] = useState<Array<{
    id: string
    status: string
    match_score: number
    job_posts: { title: string }
    engineer_profiles: {
      headline: string | null
      profiles: { display_name: string; avatar_url: string | null }
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
          const jobIds = new Set(applications.map((a: { job_posts: { id: string } }) => a.job_posts?.id))

          setStats({
            totalJobs: jobIds.size,
            openJobs: 0,
            totalApplications: applications.length,
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
    screening: { label: '選考中', color: 'text-gold-bright', bg: 'bg-gold-bright/10' },
    interview: { label: '面談予定', color: 'text-cyan-bright', bg: 'bg-cyan-glow/10' },
    offer: { label: 'オファー', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    accepted: { label: '承認済み', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    rejected: { label: '不採用', color: 'text-red-400', bg: 'bg-red-500/10' },
    withdrawn: { label: '辞退', color: 'text-midnight-500', bg: 'bg-midnight-800/50' },
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
            ダッシュボード
          </h1>
          <p className="text-midnight-400">
            採用活動の状況を確認
          </p>
        </div>
        <Link href="/company/jobs/new">
          <button className="btn-premium hover-scale">
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              案件を作成
            </span>
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6 hover-lift border-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gold-bright/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-gold-bright icon-hover" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-white mb-1 tracking-tight">
            {stats.totalJobs}
          </div>
          <div className="text-sm text-midnight-400">掲載案件数</div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift border-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400 icon-hover" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-emerald-400 mb-1 tracking-tight">
            {stats.openJobs}
          </div>
          <div className="text-sm text-midnight-400">募集中</div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift border-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-bright icon-hover" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-cyan-bright mb-1 tracking-tight">
            {stats.totalApplications}
          </div>
          <div className="text-sm text-midnight-400">応募者数</div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift border-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FileSignature className="w-5 h-5 text-purple-400 icon-hover" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-purple-400 mb-1 tracking-tight">
            {stats.activeContracts}
          </div>
          <div className="text-sm text-midnight-400">契約中</div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="glass-card rounded-2xl overflow-hidden border-hover">
        <div className="flex items-center justify-between p-6 border-b border-midnight-700/50">
          <h2 className="font-display text-lg font-semibold text-white tracking-tight">最近の応募</h2>
          <Link
            href="/company/applications"
            className="text-sm text-gold-bright hover:text-gold-pale transition-colors duration-250 ease-out-expo flex items-center gap-1 link-underline"
          >
            すべて見る
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-midnight-500" />
            </div>
            <p className="text-midnight-400 mb-2">
              まだ応募がありません
            </p>
            <p className="text-midnight-500 text-sm mb-6">
              案件を作成してエンジニアからの応募を待ちましょう
            </p>
            <Link href="/company/jobs/new">
              <button className="btn-premium hover-scale">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  案件を作成
                </span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-midnight-700/50">
            {recentApplications.map((application) => {
              const status = statusConfig[application.status] || statusConfig.applied
              return (
                <Link
                  key={application.id}
                  href="/company/applications"
                  className="flex items-center gap-4 p-4 table-row-hover"
                >
                  <Avatar className="h-12 w-12 ring-2 ring-midnight-600">
                    <AvatarImage
                      src={application.engineer_profiles?.profiles?.avatar_url || undefined}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-gold-bright to-gold-pale text-midnight-900 font-semibold">
                      {application.engineer_profiles?.profiles?.display_name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">
                      {application.engineer_profiles?.profiles?.display_name}
                    </div>
                    <div className="text-sm text-midnight-400 truncate">
                      {application.job_posts?.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-cyan-bright">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {application.match_score}%
                      </div>
                      <div className="text-xs text-midnight-500">
                        {new Date(application.created_at).toLocaleDateString('ja-JP')}
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Link href="/company/engineers" className="glass-card rounded-2xl p-6 hover-lift border-hover group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-250 ease-out-expo">
              <Users className="w-6 h-6 text-cyan-bright" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white group-hover:text-gold-bright transition-colors duration-250 ease-out-expo tracking-tight">
                エンジニアを探す
              </h3>
              <p className="text-sm text-midnight-400">スキルで検索</p>
            </div>
          </div>
        </Link>

        <Link href="/company/contracts" className="glass-card rounded-2xl p-6 hover-lift border-hover group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-250 ease-out-expo">
              <FileSignature className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white group-hover:text-gold-bright transition-colors duration-250 ease-out-expo tracking-tight">
                契約を管理
              </h3>
              <p className="text-sm text-midnight-400">支払い処理</p>
            </div>
          </div>
        </Link>

        <Link href="/company/profile" className="glass-card rounded-2xl p-6 hover-lift border-hover group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-bright/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-250 ease-out-expo">
              <Building2 className="w-6 h-6 text-gold-bright" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white group-hover:text-gold-bright transition-colors duration-250 ease-out-expo tracking-tight">
                企業プロフィール
              </h3>
              <p className="text-sm text-midnight-400">情報を編集</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
