'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  MoreHorizontal,
  Shield,
  UserCheck,
  Loader2,
  Users,
  Filter,
  ChevronDown,
  Building2,
  Code2
} from 'lucide-react'
import type { UserRole } from '@/types/database'

interface User {
  id: string
  display_name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (roleFilter !== 'all') params.set('role', roleFilter)

      const res = await fetch(`/api/admin/users?${params}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch(`/api/admin/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      }
    } catch (error) {
      console.error('Failed to update role:', error)
    }
    setOpenDropdown(null)
  }

  const roleConfig = {
    engineer: {
      label: 'エンジニア',
      icon: Code2,
      color: 'text-cyan-bright',
      bg: 'bg-cyan-glow/10',
      border: 'border-cyan-glow/30'
    },
    company: {
      label: '企業',
      icon: Building2,
      color: 'text-gold-bright',
      bg: 'bg-gold-bright/10',
      border: 'border-gold-bright/30'
    },
    admin: {
      label: '管理者',
      icon: Shield,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">ユーザー管理</h1>
          <p className="text-midnight-400 mt-1">登録ユーザーの管理・ロール変更</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">{users.length}人</span>
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
                placeholder="名前またはメールで検索..."
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
              <span className="text-sm">ロール:</span>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="mt-2 w-full md:w-44 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="all">全て</option>
              <option value="engineer">エンジニア</option>
              <option value="company">企業</option>
              <option value="admin">管理者</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">名前</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">メール</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">ロール</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">登録日</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-midnight-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const role = roleConfig[user.role] || roleConfig.engineer
                  const Icon = role.icon
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-midnight-700/30 last:border-0 hover:bg-midnight-800/20 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${role.bg} flex items-center justify-center font-semibold ${role.color}`}>
                            {user.display_name.slice(0, 1)}
                          </div>
                          <span className="font-medium text-white">{user.display_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-midnight-400">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${role.bg} ${role.color} border ${role.border}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {role.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-midnight-400">
                        {new Date(user.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                          className="p-2 rounded-lg hover:bg-midnight-700/50 text-midnight-400 hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {openDropdown === user.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-6 top-full mt-1 z-20 w-48 py-2 rounded-xl bg-midnight-800 border border-midnight-700/50 shadow-xl shadow-black/20 animate-scale-in">
                              <button
                                onClick={() => handleRoleChange(user.id, 'admin')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-midnight-300 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                              >
                                <Shield className="w-4 h-4" />
                                管理者に変更
                              </button>
                              <button
                                onClick={() => handleRoleChange(user.id, 'engineer')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-midnight-300 hover:text-cyan-bright hover:bg-cyan-glow/10 transition-colors"
                              >
                                <Code2 className="w-4 h-4" />
                                エンジニアに変更
                              </button>
                              <button
                                onClick={() => handleRoleChange(user.id, 'company')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-midnight-300 hover:text-gold-bright hover:bg-gold-bright/10 transition-colors"
                              >
                                <Building2 className="w-4 h-4" />
                                企業に変更
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <Users className="w-12 h-12 text-midnight-600 mx-auto mb-3" />
                      <p className="text-midnight-500">ユーザーが見つかりません</p>
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
