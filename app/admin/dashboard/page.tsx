'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  Briefcase,
  FileText,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  UserPlus
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

interface Stats {
  totalUsers: number
  totalEngineers: number
  totalCompanies: number
  totalJobs: number
  openJobs: number
  totalContracts: number
  activeContracts: number
  totalRevenue: number
  monthlyRevenue: { month: string; revenue: number }[]
  recentUsers: { id: string; display_name: string; role: string; created_at: string }[]
  jobsByStatus: { status: string; count: number }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statusLabels: Record<string, string> = {
    open: '公開中',
    closed: '終了',
    draft: '下書き',
    paused: '一時停止',
  }

  const barColors = ['#22d3ee', '#a855f7', '#f59e0b', '#ef4444']

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">ダッシュボード</h1>
            <p className="text-midnight-400 mt-1">プラットフォーム全体の状況</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-24 bg-midnight-700/50 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: '総ユーザー数',
      value: stats?.totalUsers || 0,
      icon: Users,
      description: `エンジニア: ${stats?.totalEngineers || 0} / 企業: ${stats?.totalCompanies || 0}`,
      color: 'text-cyan-bright',
      bgColor: 'bg-cyan-glow/10',
      borderColor: 'border-cyan-glow/30',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: '案件数',
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      description: `公開中: ${stats?.openJobs || 0}件`,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: '契約数',
      value: stats?.totalContracts || 0,
      icon: FileText,
      description: `アクティブ: ${stats?.activeContracts || 0}件`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      trend: '+23%',
      trendUp: true,
    },
    {
      title: '総売上',
      value: `¥${((stats?.totalRevenue || 0) / 10000).toFixed(0)}万`,
      icon: CreditCard,
      description: '手数料収入',
      color: 'text-gold-bright',
      bgColor: 'bg-gold-bright/10',
      borderColor: 'border-gold-bright/30',
      trend: '+15%',
      trendUp: true,
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">ダッシュボード</h1>
          <p className="text-midnight-400 mt-1">プラットフォーム全体の状況</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">システム正常</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className={`glass-card rounded-2xl p-6 border ${stat.borderColor} hover-lift border-hover transition-all duration-350 ease-out-expo`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color} icon-hover`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">{stat.trend}</span>
                </div>
              </div>
              <p className="text-sm text-midnight-400 mb-1">{stat.title}</p>
              <p className="font-display text-3xl font-bold text-white mb-2 tracking-tight">{stat.value}</p>
              <p className="text-xs text-midnight-500">{stat.description}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card rounded-2xl p-6 border-hover">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-semibold text-white tracking-tight">月次売上推移</h2>
              <p className="text-sm text-midnight-400">過去6ヶ月の売上推移</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">+15%</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value: number) => [`¥${value.toLocaleString()}`, '売上']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#purpleGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 2, stroke: '#1e1b4b', r: 5 }}
                  activeDot={{ fill: '#a855f7', strokeWidth: 2, stroke: '#fff', r: 7 }}
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs by Status */}
        <div className="glass-card rounded-2xl p-6 border-hover">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-semibold text-white tracking-tight">案件ステータス分布</h2>
              <p className="text-sm text-midnight-400">現在の案件状況</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.jobsByStatus?.map(item => ({
                ...item,
                status: statusLabels[item.status] || item.status
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis
                  dataKey="status"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value: number) => [value, '件数']}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {(stats?.jobsByStatus || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="glass-card rounded-2xl overflow-hidden border-hover">
        <div className="p-6 border-b border-midnight-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-white tracking-tight">最近の登録ユーザー</h2>
              <p className="text-sm text-midnight-400">直近の新規登録</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-400">
              <UserPlus className="w-4 h-4" />
              <span>新規</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-midnight-700/50 bg-midnight-800/30">
                <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">名前</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">ロール</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">登録日</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentUsers?.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-midnight-700/30 last:border-0 table-row-hover"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm ${
                        user.role === 'engineer'
                          ? 'bg-cyan-glow/10 text-cyan-bright'
                          : user.role === 'company'
                          ? 'bg-gold-bright/10 text-gold-bright'
                          : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {user.display_name.slice(0, 1)}
                      </div>
                      <span className="font-medium text-white">{user.display_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      user.role === 'engineer'
                        ? 'bg-cyan-glow/10 text-cyan-bright border border-cyan-glow/30'
                        : user.role === 'company'
                        ? 'bg-gold-bright/10 text-gold-bright border border-gold-bright/30'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    }`}>
                      {user.role === 'engineer' ? 'エンジニア' : user.role === 'company' ? '企業' : '管理者'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-midnight-400">
                    {new Date(user.created_at).toLocaleDateString('ja-JP')}
                  </td>
                </tr>
              ))}
              {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-midnight-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    ユーザーがいません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
