'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Upload,
  Search,
  Loader2,
  Code2,
  Filter,
  X,
  Sparkles
} from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string | null
  created_at: string
}

const categories = [
  { value: 'language', label: 'プログラミング言語', color: 'text-cyan-bright', bg: 'bg-cyan-glow/10', border: 'border-cyan-glow/30' },
  { value: 'framework', label: 'フレームワーク', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { value: 'ml', label: '機械学習', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { value: 'genai', label: '生成AI', color: 'text-gold-bright', bg: 'bg-gold-bright/10', border: 'border-gold-bright/30' },
  { value: 'cloud', label: 'クラウド', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { value: 'database', label: 'データベース', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { value: 'devops', label: 'DevOps', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  { value: 'other', label: 'その他', color: 'text-midnight-400', bg: 'bg-midnight-700/50', border: 'border-midnight-600/50' },
]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: '', category: 'other' })
  const [csvDialogOpen, setCsvDialogOpen] = useState(false)
  const [csvContent, setCsvContent] = useState('')

  const fetchSkills = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (categoryFilter !== 'all') params.set('category', categoryFilter)

      const res = await fetch(`/api/admin/skills?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSkills(data.skills)
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [categoryFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSkills()
  }

  const handleCreate = async () => {
    if (!newSkill.name.trim()) return

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      })

      if (res.ok) {
        const data = await res.json()
        setSkills([data.skill, ...skills])
        setNewSkill({ name: '', category: 'other' })
        setDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to create skill:', error)
    }
  }

  const handleDelete = async (skillId: string) => {
    if (!confirm('このスキルを削除しますか？')) return

    try {
      const res = await fetch(`/api/admin/skills?skillId=${skillId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setSkills(skills.filter(s => s.id !== skillId))
      }
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  const handleCsvImport = async () => {
    if (!csvContent.trim()) return

    try {
      const lines = csvContent.trim().split('\n')
      const skillsToCreate = lines.map(line => {
        const [name, category] = line.split(',').map(s => s.trim())
        return { name, category: category || 'other' }
      })

      const res = await fetch('/api/admin/skills/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsToCreate }),
      })

      if (res.ok) {
        setCsvContent('')
        setCsvDialogOpen(false)
        fetchSkills()
      }
    } catch (error) {
      console.error('Failed to import skills:', error)
    }
  }

  const getCategoryConfig = (category: string | null) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1]
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">スキルマスタ管理</h1>
          <p className="text-midnight-400 mt-1">スキルの追加・削除・カテゴリ管理</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCsvDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-midnight-300 hover:text-white hover:border-midnight-500 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span className="font-medium">CSVインポート</span>
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">スキル追加</span>
          </button>
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
                placeholder="スキル名で検索..."
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
              <span className="text-sm">カテゴリ:</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="mt-2 w-full md:w-52 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="all">全て</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-midnight-700/50">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-cyan-bright" />
            <span className="text-white font-medium">{skills.length}件のスキル</span>
          </div>
        </div>
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
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">スキル名</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">カテゴリ</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-midnight-400">作成日</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-midnight-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => {
                  const cat = getCategoryConfig(skill.category)
                  return (
                    <tr
                      key={skill.id}
                      className="border-b border-midnight-700/30 last:border-0 hover:bg-midnight-800/20 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-medium text-white">{skill.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${cat.bg} ${cat.color} border ${cat.border}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-midnight-400">
                        {new Date(skill.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-2 rounded-lg text-midnight-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {skills.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <Code2 className="w-12 h-12 text-midnight-600 mx-auto mb-3" />
                      <p className="text-midnight-500">スキルが見つかりません</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Skill Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-midnight-900/80 backdrop-blur-sm"
            onClick={() => setDialogOpen(false)}
          />
          <div className="relative glass-card rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <button
              onClick={() => setDialogOpen(false)}
              className="absolute top-4 right-4 p-2 text-midnight-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="font-display text-xl font-bold text-white">新規スキル追加</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  スキル名
                </label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="例: Python"
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  カテゴリ
                </label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-purple-500/50"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreate}
                disabled={!newSkill.name.trim()}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Dialog */}
      {csvDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-midnight-900/80 backdrop-blur-sm"
            onClick={() => setCsvDialogOpen(false)}
          />
          <div className="relative glass-card rounded-2xl max-w-lg w-full p-6 animate-scale-in">
            <button
              onClick={() => setCsvDialogOpen(false)}
              className="absolute top-4 right-4 p-2 text-midnight-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-glow/20 flex items-center justify-center">
                <Upload className="w-5 h-5 text-cyan-bright" />
              </div>
              <h2 className="font-display text-xl font-bold text-white">CSVインポート</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  CSV形式（スキル名,カテゴリ）
                </label>
                <textarea
                  className="w-full h-40 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 font-mono text-sm focus:outline-none focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/20 transition-all resize-none"
                  placeholder={`Python,language
PyTorch,ml
React,framework`}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                />
              </div>
              <div className="p-3 rounded-xl bg-midnight-800/30 border border-midnight-700/50">
                <p className="text-xs text-midnight-400">
                  <span className="text-midnight-300 font-medium">カテゴリ:</span> language, framework, ml, genai, cloud, database, devops, other
                </p>
              </div>
              <button
                onClick={handleCsvImport}
                disabled={!csvContent.trim()}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                インポート
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
