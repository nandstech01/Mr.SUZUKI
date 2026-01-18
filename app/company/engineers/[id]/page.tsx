'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  Briefcase,
  Star,
  Github,
  Linkedin,
  Globe,
  Send,
  ArrowLeft,
  Wifi,
  Loader2,
  X
} from 'lucide-react'
import type { EngagementType } from '@/types/database'

interface Engineer {
  id: string
  owner_id: string
  headline: string | null
  bio: string | null
  years_of_experience: number | null
  location: string | null
  remote_ok: boolean
  availability_hours_per_week: number | null
  desired_engagement: EngagementType | null
  desired_min_monthly_yen: number | null
  github_url: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  display_name: string
  skills: { name: string; level: number; years: number | null }[]
  avg_rating: number | null
  review_count: number
}

interface Job {
  id: string
  title: string
}

export default function EngineerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const engineerId = params.id as string

  const [engineer, setEngineer] = useState<Engineer | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [scoutDialogOpen, setScoutDialogOpen] = useState(false)
  const [scoutMessage, setScoutMessage] = useState('')
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [engineerRes, jobsRes] = await Promise.all([
          fetch(`/api/engineers/${engineerId}`),
          fetch('/api/job?status=open'),
        ])

        if (engineerRes.ok) {
          const data = await engineerRes.json()
          setEngineer(data.engineer)
        }

        if (jobsRes.ok) {
          const data = await jobsRes.json()
          setJobs(data.jobs || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [engineerId])

  const handleScout = async () => {
    if (!scoutMessage.trim()) return

    setSending(true)
    try {
      const res = await fetch('/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engineerProfileId: engineerId,
          jobPostId: selectedJobId || null,
          message: scoutMessage,
        }),
      })

      if (res.ok) {
        alert('スカウトを送信しました')
        setScoutDialogOpen(false)
        setScoutMessage('')
        setSelectedJobId('')
      } else {
        const data = await res.json()
        alert(data.error || 'スカウトの送信に失敗しました')
      }
    } catch (error) {
      console.error('Failed to send scout:', error)
      alert('スカウトの送信に失敗しました')
    } finally {
      setSending(false)
    }
  }

  const engagementLabels: Record<string, string> = {
    freelance: 'フリーランス',
    sidejob: '副業',
    fulltime: '正社員',
  }

  const skillLevelLabels = ['', '初級', '中級', '上級', 'エキスパート', 'マスター']

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

  if (!engineer) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-midnight-400">エンジニアが見つかりません</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Back Link */}
        <Link
          href="/company/engineers"
          className="inline-flex items-center gap-2 text-midnight-400 hover:text-gold-bright transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          エンジニア一覧に戻る
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                      {engineer.display_name}
                    </h1>
                    {engineer.avg_rating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-medium">{engineer.avg_rating.toFixed(1)}</span>
                        <span className="text-sm text-midnight-400">
                          ({engineer.review_count}件)
                        </span>
                      </div>
                    )}
                  </div>

                  {engineer.headline && (
                    <p className="text-lg text-midnight-400 mb-4">{engineer.headline}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-midnight-400 mb-4">
                    {engineer.years_of_experience && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-midnight-500" />
                        経験{engineer.years_of_experience}年
                      </span>
                    )}
                    {engineer.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-midnight-500" />
                        {engineer.location}
                      </span>
                    )}
                    {engineer.availability_hours_per_week && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-midnight-500" />
                        週{engineer.availability_hours_per_week}時間稼働可能
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {engineer.remote_ok && (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
                        <Wifi className="w-4 h-4" />
                        リモートOK
                      </span>
                    )}
                    {engineer.desired_engagement && (
                      <span className="px-3 py-1.5 rounded-lg bg-cyan-glow/10 text-cyan-bright text-sm">
                        {engagementLabels[engineer.desired_engagement]}希望
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {engineer.github_url && (
                      <a
                        href={engineer.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-midnight-400 hover:text-gold-bright transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {engineer.linkedin_url && (
                      <a
                        href={engineer.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-midnight-400 hover:text-gold-bright transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {engineer.portfolio_url && (
                      <a
                        href={engineer.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-midnight-400 hover:text-gold-bright transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setScoutDialogOpen(true)}
                  className="btn-premium flex-shrink-0"
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    スカウトする
                  </span>
                </button>
              </div>
            </div>

            {/* Bio */}
            {engineer.bio && (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-white mb-4">自己紹介</h2>
                <p className="text-midnight-300 whitespace-pre-wrap leading-relaxed">
                  {engineer.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-4">スキル</h2>
              {engineer.skills.length === 0 ? (
                <p className="text-midnight-400">スキルが登録されていません</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {engineer.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between p-3 rounded-xl bg-midnight-800/30"
                    >
                      <span className="font-medium text-white">{skill.name}</span>
                      <div className="text-sm text-midnight-400">
                        {skillLevelLabels[skill.level] || `Lv.${skill.level}`}
                        {skill.years && ` / ${skill.years}年`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="font-display text-lg font-semibold text-white mb-6">希望条件</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-midnight-500 mb-1">希望単価</p>
                  <p className="font-display text-2xl font-bold text-gold-bright">
                    {engineer.desired_min_monthly_yen
                      ? `¥${(engineer.desired_min_monthly_yen / 10000).toFixed(0)}万〜`
                      : '応相談'}
                  </p>
                  <p className="text-xs text-midnight-500">/月</p>
                </div>

                <div>
                  <p className="text-sm text-midnight-500 mb-1">稼働可能時間</p>
                  <p className="text-lg font-medium text-white">
                    {engineer.availability_hours_per_week
                      ? `週${engineer.availability_hours_per_week}時間`
                      : '応相談'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-midnight-500 mb-1">希望稼働形態</p>
                  <p className="text-lg font-medium text-white">
                    {engineer.desired_engagement
                      ? engagementLabels[engineer.desired_engagement]
                      : '応相談'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-midnight-500 mb-1">リモートワーク</p>
                  <p className="text-lg font-medium text-white">
                    {engineer.remote_ok ? '可能' : '要相談'}
                  </p>
                </div>

                <button
                  onClick={() => setScoutDialogOpen(true)}
                  className="btn-premium w-full mt-4"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    スカウトする
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scout Dialog */}
      {scoutDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-midnight-900/80 backdrop-blur-sm"
            onClick={() => setScoutDialogOpen(false)}
          />
          <div className="relative glass-card rounded-2xl max-w-lg w-full p-6 md:p-8 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setScoutDialogOpen(false)}
              className="absolute top-4 right-4 p-2 text-midnight-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="font-display text-xl font-bold text-white mb-6">
              スカウトを送信
            </h2>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  紐付ける案件（任意）
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-gold-bright/50"
                >
                  <option value="">案件なし</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  メッセージ
                </label>
                <textarea
                  value={scoutMessage}
                  onChange={(e) => setScoutMessage(e.target.value)}
                  placeholder="スカウトメッセージを入力してください..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all resize-none"
                />
              </div>

              <button
                onClick={handleScout}
                disabled={sending || !scoutMessage.trim()}
                className="btn-premium w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      スカウトを送信
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
