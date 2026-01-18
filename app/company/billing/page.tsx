'use client'

import { useEffect, useState } from 'react'
import {
  Receipt,
  TrendingUp,
  Clock,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

interface Invoice {
  id: string
  amount_yen: number
  status: string
  billing_month: string | null
  stripe_invoice_id: string | null
  created_at: string
  contracts: {
    monthly_fee_yen: number | null
    engineer_profiles: {
      profiles: {
        display_name: string
      }
    }
  }
}

export default function CompanyBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('/api/invoices')
        if (res.ok) {
          const data = await res.json()
          setInvoices(data)
        }
      } catch (error) {
        console.error('Failed to fetch invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
    pending: { label: '未払い', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
    paid: { label: '支払済み', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
    void: { label: '無効', color: 'text-midnight-500', bg: 'bg-midnight-700/50', icon: AlertCircle },
    failed: { label: '失敗', color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertCircle },
  }

  // Calculate summary
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount_yen, 0)

  const totalPending = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount_yen, 0)

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
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          請求・支払い
        </h1>
        <p className="text-midnight-400">
          支払い履歴と請求状況を確認
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="font-display text-2xl font-bold text-emerald-400 mb-1">
            ¥{totalPaid.toLocaleString()}
          </div>
          <div className="text-sm text-midnight-400">支払済み合計</div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div className="font-display text-2xl font-bold text-yellow-400 mb-1">
            ¥{totalPending.toLocaleString()}
          </div>
          <div className="text-sm text-midnight-400">未払い合計</div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gold-bright/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-gold-bright" />
            </div>
          </div>
          <div className="font-display text-2xl font-bold text-white mb-1">
            {invoices.length}件
          </div>
          <div className="text-sm text-midnight-400">請求件数</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-midnight-700/50">
          <h2 className="font-display text-lg font-semibold text-white">請求履歴</h2>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-midnight-500" />
            </div>
            <p className="text-midnight-400">まだ請求がありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-midnight-700/50">
                  <th className="text-left p-4 text-sm font-medium text-midnight-400">請求月</th>
                  <th className="text-left p-4 text-sm font-medium text-midnight-400">エンジニア</th>
                  <th className="text-left p-4 text-sm font-medium text-midnight-400">金額</th>
                  <th className="text-left p-4 text-sm font-medium text-midnight-400">ステータス</th>
                  <th className="text-left p-4 text-sm font-medium text-midnight-400">作成日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-700/50">
                {invoices.map((invoice) => {
                  const status = statusConfig[invoice.status] || statusConfig.pending
                  const StatusIcon = status.icon

                  return (
                    <tr key={invoice.id} className="hover:bg-midnight-800/30 transition-colors">
                      <td className="p-4 text-white">
                        {invoice.billing_month
                          ? new Date(invoice.billing_month).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'long',
                            })
                          : '-'}
                      </td>
                      <td className="p-4 text-midnight-300">
                        {invoice.contracts?.engineer_profiles?.profiles?.display_name || '-'}
                      </td>
                      <td className="p-4">
                        <span className="text-gold-bright font-medium">
                          ¥{invoice.amount_yen.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-midnight-400 text-sm">
                        {new Date(invoice.created_at).toLocaleDateString('ja-JP')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
