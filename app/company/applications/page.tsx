'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Filter,
  ChevronRight,
  Loader2,
  TrendingUp,
  X,
  User,
  Briefcase,
  Plus
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Application {
  id: string
  status: string
  match_score: number
  cover_letter: string | null
  created_at: string
  job_posts: {
    id: string
    title: string
  }
  engineer_profiles: {
    id: string
    headline: string | null
    years_of_experience: number | null
    desired_min_monthly_yen: number | null
    profiles: {
      display_name: string
      avatar_url: string | null
    }
  }
}

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [updating, setUpdating] = useState(false)

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

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: newStatus } : app
          )
        )
        setShowDetailDialog(false)
      }
    } catch (error) {
      console.error('Failed to update application:', error)
    } finally {
      setUpdating(false)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    applied: { label: '応募済み', color: 'text-midnight-300', bg: 'bg-midnight-700/50' },
    screening: { label: '選考中', color: 'text-gold-bright', bg: 'bg-gold-bright/10' },
    interview: { label: '面談予定', color: 'text-cyan-bright', bg: 'bg-cyan-glow/10' },
    offer: { label: 'オファー', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    accepted: { label: '承認済み', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    rejected: { label: '不採用', color: 'text-red-400', bg: 'bg-red-500/10' },
    withdrawn: { label: '辞退', color: 'text-midnight-500', bg: 'bg-midnight-800/50' },
  }

  const nextStatusOptions: Record<string, string[]> = {
    applied: ['screening', 'rejected'],
    screening: ['interview', 'rejected'],
    interview: ['offer', 'rejected'],
    offer: ['accepted', 'rejected'],
  }

  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter((app) => app.status === statusFilter)

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
    <>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              応募者一覧
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
              className="px-4 py-2.5 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-gold-bright/50 min-w-[160px]"
            >
              <option value="all">すべて</option>
              <option value="applied">応募済み</option>
              <option value="screening">選考中</option>
              <option value="interview">面談予定</option>
              <option value="offer">オファー</option>
              <option value="accepted">承認済み</option>
              <option value="rejected">不採用</option>
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
            <Link href="/company/jobs/new">
              <button className="btn-premium">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  案件を作成
                </span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const status = statusConfig[application.status] || statusConfig.applied
              const nextOptions = nextStatusOptions[application.status] || []

              return (
                <div
                  key={application.id}
                  className="glass-card rounded-2xl p-6 hover:border-gold-bright/30 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 ring-2 ring-midnight-600">
                        <AvatarImage
                          src={application.engineer_profiles?.profiles?.avatar_url || undefined}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-gold-bright to-gold-pale text-midnight-900 font-semibold">
                          {application.engineer_profiles?.profiles?.display_name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display text-lg font-semibold text-white">
                            {application.engineer_profiles?.profiles?.display_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-midnight-400 text-sm mb-2">
                          {application.engineer_profiles?.headline || '未設定'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-midnight-500">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {application.job_posts?.title}
                          </span>
                          {application.engineer_profiles?.years_of_experience && (
                            <span>経験: {application.engineer_profiles.years_of_experience}年</span>
                          )}
                          <span className="flex items-center gap-1 text-cyan-bright">
                            <TrendingUp className="w-4 h-4" />
                            マッチ度 {application.match_score}%
                          </span>
                          <span>
                            応募日: {new Date(application.created_at).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedApp(application)
                          setShowDetailDialog(true)
                        }}
                        className="px-4 py-2 rounded-xl border border-midnight-600 text-midnight-300 hover:text-gold-bright hover:border-gold-bright/50 transition-all text-sm"
                      >
                        詳細を見る
                      </button>
                      {nextOptions.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          onClick={() => updateStatus(application.id, nextStatus)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            nextStatus === 'rejected'
                              ? 'border border-red-500/50 text-red-400 hover:bg-red-500/10'
                              : 'bg-gold-bright/10 text-gold-bright hover:bg-gold-bright/20'
                          }`}
                        >
                          {statusConfig[nextStatus]?.label}にする
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      {showDetailDialog && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-midnight-900/80 backdrop-blur-sm"
            onClick={() => setShowDetailDialog(false)}
          />
          <div className="relative glass-card rounded-2xl max-w-2xl w-full p-6 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowDetailDialog(false)}
              className="absolute top-4 right-4 p-2 text-midnight-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="font-display text-xl font-bold text-white mb-2">
              応募者詳細
            </h2>
            <p className="text-midnight-400 text-sm mb-6">
              {selectedApp.job_posts?.title}への応募
            </p>

            {/* Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-midnight-600">
                  <AvatarImage
                    src={selectedApp.engineer_profiles?.profiles?.avatar_url || undefined}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-gold-bright to-gold-pale text-midnight-900 font-semibold text-lg">
                    {selectedApp.engineer_profiles?.profiles?.display_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {selectedApp.engineer_profiles?.profiles?.display_name}
                  </h3>
                  <p className="text-midnight-400">
                    {selectedApp.engineer_profiles?.headline}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-midnight-800/30">
                  <p className="text-sm text-midnight-500 mb-1">経験年数</p>
                  <p className="text-white font-medium">
                    {selectedApp.engineer_profiles?.years_of_experience || '-'}年
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-midnight-800/30">
                  <p className="text-sm text-midnight-500 mb-1">希望月額</p>
                  <p className="text-gold-bright font-medium">
                    {selectedApp.engineer_profiles?.desired_min_monthly_yen
                      ? `${(selectedApp.engineer_profiles.desired_min_monthly_yen / 10000).toFixed(0)}万円〜`
                      : '-'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-midnight-800/30">
                  <p className="text-sm text-midnight-500 mb-1">マッチ度</p>
                  <p className="text-cyan-bright font-semibold">{selectedApp.match_score}%</p>
                </div>
                <div className="p-4 rounded-xl bg-midnight-800/30">
                  <p className="text-sm text-midnight-500 mb-1">ステータス</p>
                  <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${statusConfig[selectedApp.status]?.bg} ${statusConfig[selectedApp.status]?.color}`}>
                    {statusConfig[selectedApp.status]?.label}
                  </span>
                </div>
              </div>

              {selectedApp.cover_letter && (
                <div>
                  <h4 className="font-medium text-white mb-2">カバーレター</h4>
                  <p className="text-midnight-300 whitespace-pre-wrap bg-midnight-800/30 p-4 rounded-xl text-sm leading-relaxed">
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-midnight-700/50">
              <button
                onClick={() => setShowDetailDialog(false)}
                className="px-6 py-3 rounded-xl border border-midnight-600 text-midnight-300 hover:text-white hover:border-midnight-500 transition-all"
              >
                閉じる
              </button>
              {nextStatusOptions[selectedApp.status]?.map((nextStatus) => (
                <button
                  key={nextStatus}
                  disabled={updating}
                  onClick={() => updateStatus(selectedApp.id, nextStatus)}
                  className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                    nextStatus === 'rejected'
                      ? 'border border-red-500/50 text-red-400 hover:bg-red-500/10'
                      : 'btn-premium'
                  }`}
                >
                  {updating ? '処理中...' : `${statusConfig[nextStatus]?.label}にする`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
