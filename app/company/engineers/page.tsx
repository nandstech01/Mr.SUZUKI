'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Star,
  Wifi,
  Filter,
  ChevronRight,
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
  display_name: string
  skills: { name: string; level: number }[]
  avg_rating: number | null
}

interface Skill {
  id: string
  name: string
  category: string | null
}

export default function EngineersPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minYears: '',
    maxBudget: '',
    minHours: '',
    engagement: 'all',
    remoteOnly: false,
  })

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      if (res.ok) {
        const data = await res.json()
        setSkills(data.skills)
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    }
  }

  const fetchEngineers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedSkills.length > 0) {
        params.set('skills', selectedSkills.join(','))
      }
      if (filters.minYears) params.set('minYears', filters.minYears)
      if (filters.maxBudget) params.set('maxBudget', filters.maxBudget)
      if (filters.minHours) params.set('minHours', filters.minHours)
      if (filters.engagement !== 'all') params.set('engagement', filters.engagement)
      if (filters.remoteOnly) params.set('remoteOnly', 'true')

      const res = await fetch(`/api/engineers?${params}`)
      if (res.ok) {
        const data = await res.json()
        setEngineers(data.engineers)
      }
    } catch (error) {
      console.error('Failed to fetch engineers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
    fetchEngineers()
  }, [])

  const handleSearch = () => {
    fetchEngineers()
  }

  const toggleSkill = (skillName: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillName)
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    )
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setFilters({
      minYears: '',
      maxBudget: '',
      minHours: '',
      engagement: 'all',
      remoteOnly: false,
    })
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

  const hasActiveFilters = selectedSkills.length > 0 ||
    filters.minYears ||
    filters.maxBudget ||
    filters.minHours ||
    filters.engagement !== 'all' ||
    filters.remoteOnly

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          エンジニアを探す
        </h1>
        <p className="text-midnight-400">
          スキルや条件でエンジニアを検索
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-gold-bright" />
                検索条件
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-midnight-400 hover:text-gold-bright transition-colors"
                >
                  クリア
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-3">
                  スキル
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {skills.slice(0, 20).map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.name)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                        selectedSkills.includes(skill.name)
                          ? 'bg-gold-bright/10 text-gold-bright border-gold-bright/30'
                          : 'bg-midnight-800/50 text-midnight-300 border-midnight-600/50 hover:border-gold-bright/30'
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  経験年数（年以上）
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="例: 3"
                  value={filters.minYears}
                  onChange={(e) => setFilters({ ...filters, minYears: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  希望単価上限（万円/月）
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="例: 100"
                  value={filters.maxBudget}
                  onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
                />
              </div>

              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  稼働時間（時間/週以上）
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="例: 20"
                  value={filters.minHours}
                  onChange={(e) => setFilters({ ...filters, minHours: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
                />
              </div>

              {/* Engagement */}
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  稼働形態
                </label>
                <select
                  value={filters.engagement}
                  onChange={(e) => setFilters({ ...filters, engagement: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-gold-bright/50"
                >
                  <option value="all">全て</option>
                  <option value="freelance">フリーランス</option>
                  <option value="sidejob">副業</option>
                  <option value="fulltime">正社員</option>
                </select>
              </div>

              {/* Remote Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-midnight-800/30">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-emerald-400" />
                  <span className="text-white">リモートOKのみ</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, remoteOnly: !filters.remoteOnly })}
                  className={`w-12 h-6 rounded-full transition-all ${
                    filters.remoteOnly ? 'bg-gold-bright' : 'bg-midnight-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    filters.remoteOnly ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <button onClick={handleSearch} className="btn-premium w-full">
                <span className="flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  検索
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-bright/10 text-gold-bright text-sm"
                >
                  {skill}
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
              {filters.remoteOnly && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
                  リモートOK
                </span>
              )}
              {filters.engagement !== 'all' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-glow/10 text-cyan-bright text-sm">
                  {engagementLabels[filters.engagement]}
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-gold-bright animate-spin" />
                <p className="text-midnight-400">エンジニアを検索中...</p>
              </div>
            </div>
          ) : engineers.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-midnight-500" />
              </div>
              <p className="text-midnight-400 mb-2">条件に合うエンジニアが見つかりませんでした</p>
              <p className="text-midnight-500 text-sm">検索条件を変更してお試しください</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-midnight-400 mb-4">
                {engineers.length}件のエンジニア
              </p>

              {engineers.map((engineer) => {
                const engColor = engineer.desired_engagement
                  ? engagementColors[engineer.desired_engagement]
                  : engagementColors.freelance

                return (
                  <Link
                    key={engineer.id}
                    href={`/company/engineers/${engineer.id}`}
                    className="block glass-card rounded-2xl p-6 hover:border-gold-bright/30 transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-xl font-semibold text-white group-hover:text-gold-bright transition-colors">
                            {engineer.display_name}
                          </h3>
                          {engineer.avg_rating && (
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm">{engineer.avg_rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {engineer.headline && (
                          <p className="text-midnight-400 mb-3">{engineer.headline}</p>
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
                              週{engineer.availability_hours_per_week}時間
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {engineer.remote_ok && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">
                              <Wifi className="w-3 h-3" />
                              リモートOK
                            </span>
                          )}
                          {engineer.desired_engagement && (
                            <span className={`px-2.5 py-1 rounded-lg text-xs ${engColor.bg} ${engColor.text}`}>
                              {engagementLabels[engineer.desired_engagement]}
                            </span>
                          )}
                          {engineer.skills.slice(0, 6).map((skill) => (
                            <span
                              key={skill.name}
                              className="px-2.5 py-1 rounded-lg bg-midnight-700/50 text-midnight-300 text-xs"
                            >
                              {skill.name}
                            </span>
                          ))}
                          {engineer.skills.length > 6 && (
                            <span className="text-xs text-midnight-500">
                              +{engineer.skills.length - 6}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                        <div className="text-right">
                          {engineer.desired_min_monthly_yen && (
                            <div className="font-display text-xl font-bold text-gold-bright">
                              ¥{(engineer.desired_min_monthly_yen / 10000).toFixed(0)}万〜
                            </div>
                          )}
                          <div className="text-xs text-midnight-500">/月</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-midnight-500 group-hover:text-gold-bright group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
