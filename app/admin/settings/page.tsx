'use client'

import { useEffect, useState } from 'react'
import {
  Save,
  RefreshCw,
  Settings,
  Percent,
  Scale,
  Info,
  Loader2,
  Sparkles,
  Shield,
  Server
} from 'lucide-react'

interface MatchWeight {
  id: string
  key: string
  weight: number
}

interface SettingsData {
  defaultPlatformFeeRate: number
  matchWeights: MatchWeight[]
}

const weightLabels: Record<string, { label: string; description: string; icon: typeof Scale }> = {
  skill_overlap: { label: 'スキル一致度', description: 'エンジニアのスキルと案件要件の一致度', icon: Sparkles },
  budget_fit: { label: '予算適合度', description: '希望報酬と予算範囲の適合度', icon: Scale },
  availability_fit: { label: '稼働可能時間適合度', description: '週あたり稼働時間の適合度', icon: Scale },
  remote_fit: { label: 'リモート条件適合度', description: 'リモートワーク条件の一致度', icon: Scale },
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feeRate, setFeeRate] = useState('15')
  const [weights, setWeights] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
          setFeeRate(data.defaultPlatformFeeRate.toString())
          const w: Record<string, string> = {}
          data.matchWeights.forEach((mw: MatchWeight) => {
            w[mw.key] = mw.weight.toString()
          })
          setWeights(w)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const matchWeights = Object.entries(weights).map(([key, value]) => ({
        key,
        weight: parseFloat(value),
      }))

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultPlatformFeeRate: parseFloat(feeRate),
          matchWeights,
        }),
      })

      if (res.ok) {
        alert('設定を保存しました')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('設定の保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">システム設定</h1>
          <p className="text-midnight-400 mt-1">プラットフォーム全体の設定管理</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">システム設定</h1>
          <p className="text-midnight-400 mt-1">プラットフォーム全体の設定管理</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20"
        >
          {saving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              設定を保存
            </>
          )}
        </button>
      </div>

      {/* Platform Fee Settings */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-midnight-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-bright/10 flex items-center justify-center">
              <Percent className="w-5 h-5 text-gold-bright" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">手数料設定</h2>
              <p className="text-sm text-midnight-400">プラットフォーム手数料のデフォルト値</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-midnight-200 mb-2">
              デフォルト手数料率
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={feeRate}
                onChange={(e) => setFeeRate(e.target.value)}
                className="w-32 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white text-xl font-bold focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
              />
              <span className="text-2xl font-bold text-gold-bright">%</span>
            </div>
            <p className="text-sm text-midnight-500 mt-3">
              契約時にこの手数料率がデフォルトで適用されます（個別に変更可能）
            </p>
          </div>
        </div>
      </div>

      {/* Match Score Weights */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-midnight-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-cyan-bright" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">マッチスコア重み設定</h2>
              <p className="text-sm text-midnight-400">案件とエンジニアのマッチングスコア計算時の重み係数</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(weights).map(([key, value]) => {
              const config = weightLabels[key] || { label: key, description: '', icon: Scale }
              const Icon = config.icon
              return (
                <div key={key} className="p-4 rounded-xl bg-midnight-800/30 border border-midnight-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white">{config.label}</label>
                      <p className="text-xs text-midnight-500">{config.description}</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={value}
                    onChange={(e) => setWeights({ ...weights, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-midnight-800/50 border border-midnight-600/50 text-white font-medium focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              )
            })}
          </div>

          {/* Formula Display */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-glow/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-purple-400" />
              <h4 className="font-medium text-white text-sm">計算式</h4>
            </div>
            <code className="block text-xs text-midnight-300 font-mono leading-relaxed">
              マッチスコア = (スキル一致度 × <span className="text-cyan-bright">{weights.skill_overlap || '1.5'}</span>) +
              (予算適合度 × <span className="text-cyan-bright">{weights.budget_fit || '1.0'}</span>) +
              (稼働適合度 × <span className="text-cyan-bright">{weights.availability_fit || '1.0'}</span>) +
              (リモート適合度 × <span className="text-cyan-bright">{weights.remote_fit || '0.5'}</span>)
            </code>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-midnight-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">システム情報</h2>
              <p className="text-sm text-midnight-400">プラットフォームの基本情報</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-midnight-800/30 border border-midnight-700/50">
              <p className="text-xs text-midnight-500 mb-1">バージョン</p>
              <p className="font-mono text-lg font-bold text-white">1.0.0</p>
            </div>
            <div className="p-4 rounded-xl bg-midnight-800/30 border border-midnight-700/50">
              <p className="text-xs text-midnight-500 mb-1">環境</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="font-mono text-lg font-bold text-emerald-400">{process.env.NODE_ENV}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-midnight-800/30 border border-midnight-700/50">
              <p className="text-xs text-midnight-500 mb-1">フレームワーク</p>
              <p className="font-mono text-lg font-bold text-white">Next.js 13</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
