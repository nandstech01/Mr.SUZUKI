'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileSignature,
  CreditCard,
  Calendar,
  Loader2,
  X,
  ChevronRight,
  Briefcase
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Contract {
  id: string
  status: string
  start_date: string | null
  end_date: string | null
  monthly_fee_yen: number | null
  platform_fee_rate: number
  created_at: string
  engineer_profiles: {
    headline: string | null
    profiles: {
      display_name: string
      avatar_url: string | null
    }
  }
  applications: {
    job_posts: {
      title: string
    }
  } | null
}

export default function CompanyContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [billingMonth, setBillingMonth] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch('/api/contracts')
        if (res.ok) {
          const data = await res.json()
          setContracts(data)
        }
      } catch (error) {
        console.error('Failed to fetch contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

  const handlePayment = async () => {
    if (!selectedContract || !selectedContract.monthly_fee_yen) return

    setProcessing(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: selectedContract.id,
          amount_yen: selectedContract.monthly_fee_yen,
          billing_month: billingMonth || new Date().toISOString().slice(0, 7) + '-01',
        }),
      })

      if (res.ok) {
        const data = await res.json()
        window.location.href = data.checkout_url
      } else {
        alert('支払い処理の開始に失敗しました')
      }
    } catch (error) {
      console.error('Failed to initiate payment:', error)
      alert('エラーが発生しました')
    } finally {
      setProcessing(false)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    initiated: { label: '開始前', color: 'text-midnight-400', bg: 'bg-midnight-700/50' },
    signed: { label: '契約済み', color: 'text-gold-bright', bg: 'bg-gold-bright/10' },
    active: { label: '稼働中', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    completed: { label: '完了', color: 'text-cyan-bright', bg: 'bg-cyan-glow/10' },
    cancelled: { label: 'キャンセル', color: 'text-red-400', bg: 'bg-red-500/10' },
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
    <>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            契約一覧
          </h1>
          <p className="text-midnight-400">
            エンジニアとの契約を管理
          </p>
        </div>

        {/* Contracts List */}
        {contracts.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
              <FileSignature className="w-8 h-8 text-midnight-500" />
            </div>
            <p className="text-midnight-400 mb-2">
              まだ契約がありません
            </p>
            <p className="text-midnight-500 text-sm mb-6">
              応募者を承認すると、契約を作成できます
            </p>
            <Link href="/company/applications">
              <button className="btn-premium">
                <span>応募者一覧を見る</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => {
              const status = statusConfig[contract.status] || statusConfig.initiated

              return (
                <div
                  key={contract.id}
                  className="glass-card rounded-2xl p-6 hover:border-gold-bright/30 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 ring-2 ring-midnight-600">
                        <AvatarImage
                          src={contract.engineer_profiles?.profiles?.avatar_url || undefined}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-glow to-cyan-bright text-midnight-900 font-semibold">
                          {contract.engineer_profiles?.profiles?.display_name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display text-lg font-semibold text-white">
                            {contract.engineer_profiles?.profiles?.display_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-midnight-400 text-sm mb-2">
                          {contract.applications?.job_posts?.title || '案件未設定'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-midnight-500">
                          {contract.monthly_fee_yen && (
                            <span className="text-gold-bright font-medium">
                              月額: {(contract.monthly_fee_yen / 10000).toFixed(0)}万円
                            </span>
                          )}
                          {contract.start_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              開始: {new Date(contract.start_date).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                          {contract.end_date && (
                            <span>
                              終了: {new Date(contract.end_date).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                          <span>
                            手数料: {contract.platform_fee_rate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {contract.status === 'active' && contract.monthly_fee_yen && (
                        <button
                          onClick={() => {
                            setSelectedContract(contract)
                            setShowPaymentDialog(true)
                          }}
                          className="btn-premium"
                        >
                          <span className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            支払い
                          </span>
                        </button>
                      )}
                      <button className="px-4 py-2 rounded-xl border border-midnight-600 text-midnight-300 hover:text-gold-bright hover:border-gold-bright/50 transition-all text-sm">
                        詳細を見る
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-midnight-900/80 backdrop-blur-sm"
            onClick={() => setShowPaymentDialog(false)}
          />
          <div className="relative glass-card rounded-2xl max-w-md w-full p-6 md:p-8 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setShowPaymentDialog(false)}
              className="absolute top-4 right-4 p-2 text-midnight-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="font-display text-xl font-bold text-white mb-2">
              支払いを行う
            </h2>
            <p className="text-midnight-400 text-sm mb-6">
              {selectedContract.engineer_profiles?.profiles?.display_name}さんへの支払い
            </p>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  請求月
                </label>
                <input
                  type="month"
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all"
                />
              </div>

              <div className="p-4 rounded-xl bg-midnight-800/30 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-midnight-400">月額報酬</span>
                  <span className="text-white font-medium">
                    ¥{selectedContract.monthly_fee_yen?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-midnight-400">
                    プラットフォーム手数料 ({selectedContract.platform_fee_rate}%)
                  </span>
                  <span className="text-midnight-300">
                    ¥{Math.round((selectedContract.monthly_fee_yen || 0) * selectedContract.platform_fee_rate / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-midnight-700/50">
                  <span className="text-white font-semibold">合計</span>
                  <span className="text-gold-bright font-bold">
                    ¥{Math.round((selectedContract.monthly_fee_yen || 0) * (1 + selectedContract.platform_fee_rate / 100)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentDialog(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-midnight-600 text-midnight-300 hover:text-white hover:border-midnight-500 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="flex-1 btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      処理中...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      支払いへ進む
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
