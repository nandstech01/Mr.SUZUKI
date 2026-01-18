'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    initiated: { label: '開始前', variant: 'secondary' },
    signed: { label: '契約済み', variant: 'default' },
    active: { label: '稼働中', variant: 'default' },
    completed: { label: '完了', variant: 'outline' },
    cancelled: { label: 'キャンセル', variant: 'destructive' },
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">契約一覧</h1>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              まだ契約がありません。
              <br />
              応募者を承認すると、契約を作成できます。
            </p>
            <Link href="/company/applications">
              <Button>応募者一覧を見る</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={contract.engineer_profiles?.profiles?.avatar_url || undefined}
                      />
                      <AvatarFallback>
                        {contract.engineer_profiles?.profiles?.display_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">
                        {contract.engineer_profiles?.profiles?.display_name}
                      </CardTitle>
                      <CardDescription>
                        {contract.applications?.job_posts?.title || '案件未設定'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={statusLabels[contract.status]?.variant || 'secondary'}>
                    {statusLabels[contract.status]?.label || contract.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {contract.monthly_fee_yen && (
                    <span>
                      月額: <strong>{(contract.monthly_fee_yen / 10000).toFixed(0)}万円</strong>
                    </span>
                  )}
                  {contract.start_date && (
                    <span>
                      開始日: {new Date(contract.start_date).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                  {contract.end_date && (
                    <span>
                      終了日: {new Date(contract.end_date).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                  <span>
                    手数料率: {contract.platform_fee_rate}%
                  </span>
                </div>
                <div className="flex gap-2">
                  {contract.status === 'active' && contract.monthly_fee_yen && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedContract(contract)
                        setShowPaymentDialog(true)
                      }}
                    >
                      支払いを行う
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    詳細を見る
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>支払いを行う</DialogTitle>
            <DialogDescription>
              {selectedContract?.engineer_profiles?.profiles?.display_name}さんへの支払い
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="billingMonth">請求月</Label>
              <Input
                id="billingMonth"
                type="month"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>月額報酬</span>
                <span>
                  {selectedContract?.monthly_fee_yen
                    ? `¥${selectedContract.monthly_fee_yen.toLocaleString()}`
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                <span>プラットフォーム手数料 ({selectedContract?.platform_fee_rate}%)</span>
                <span>
                  {selectedContract?.monthly_fee_yen && selectedContract?.platform_fee_rate
                    ? `¥${Math.round(selectedContract.monthly_fee_yen * selectedContract.platform_fee_rate / 100).toLocaleString()}`
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>合計</span>
                <span>
                  {selectedContract?.monthly_fee_yen && selectedContract?.platform_fee_rate
                    ? `¥${Math.round(selectedContract.monthly_fee_yen * (1 + selectedContract.platform_fee_rate / 100)).toLocaleString()}`
                    : '-'}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handlePayment} disabled={processing}>
              {processing ? '処理中...' : '支払いへ進む'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
