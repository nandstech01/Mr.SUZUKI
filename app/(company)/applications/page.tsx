'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    applied: { label: '応募済み', variant: 'secondary' },
    screening: { label: '選考中', variant: 'default' },
    interview: { label: '面談予定', variant: 'default' },
    offer: { label: 'オファー', variant: 'default' },
    accepted: { label: '承認済み', variant: 'default' },
    rejected: { label: '不採用', variant: 'destructive' },
    withdrawn: { label: '辞退', variant: 'outline' },
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">応募者一覧</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="applied">応募済み</SelectItem>
            <SelectItem value="screening">選考中</SelectItem>
            <SelectItem value="interview">面談予定</SelectItem>
            <SelectItem value="offer">オファー</SelectItem>
            <SelectItem value="accepted">承認済み</SelectItem>
            <SelectItem value="rejected">不採用</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'all' ? 'まだ応募がありません' : '該当する応募がありません'}
            </p>
            <Link href="/company/jobs/new">
              <Button>案件を作成</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={application.engineer_profiles?.profiles?.avatar_url || undefined}
                        alt={application.engineer_profiles?.profiles?.display_name}
                      />
                      <AvatarFallback>
                        {application.engineer_profiles?.profiles?.display_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">
                        {application.engineer_profiles?.profiles?.display_name}
                      </CardTitle>
                      <CardDescription>
                        {application.engineer_profiles?.headline || '未設定'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={statusLabels[application.status]?.variant || 'secondary'}>
                    {statusLabels[application.status]?.label || application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span>応募案件: {application.job_posts?.title}</span>
                  {application.engineer_profiles?.years_of_experience && (
                    <span>経験: {application.engineer_profiles.years_of_experience}年</span>
                  )}
                  <span>マッチ度: <strong className="text-blue-600">{application.match_score}%</strong></span>
                  <span>
                    応募日: {new Date(application.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedApp(application)
                      setShowDetailDialog(true)
                    }}
                  >
                    詳細を見る
                  </Button>
                  {nextStatusOptions[application.status]?.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={status === 'rejected' ? 'destructive' : 'default'}
                      onClick={() => updateStatus(application.id, status)}
                    >
                      {statusLabels[status]?.label}にする
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>応募者詳細</DialogTitle>
            <DialogDescription>
              {selectedApp?.job_posts?.title}への応募
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedApp.engineer_profiles?.profiles?.avatar_url || undefined}
                  />
                  <AvatarFallback>
                    {selectedApp.engineer_profiles?.profiles?.display_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedApp.engineer_profiles?.profiles?.display_name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedApp.engineer_profiles?.headline}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">経験年数:</span>
                  <span className="ml-2">{selectedApp.engineer_profiles?.years_of_experience || '-'}年</span>
                </div>
                <div>
                  <span className="text-muted-foreground">希望月額:</span>
                  <span className="ml-2">
                    {selectedApp.engineer_profiles?.desired_min_monthly_yen
                      ? `${(selectedApp.engineer_profiles.desired_min_monthly_yen / 10000).toFixed(0)}万円〜`
                      : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">マッチ度:</span>
                  <span className="ml-2 text-blue-600 font-semibold">{selectedApp.match_score}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ステータス:</span>
                  <span className="ml-2">
                    <Badge variant={statusLabels[selectedApp.status]?.variant}>
                      {statusLabels[selectedApp.status]?.label}
                    </Badge>
                  </span>
                </div>
              </div>
              {selectedApp.cover_letter && (
                <div>
                  <h4 className="font-medium mb-2">カバーレター</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              閉じる
            </Button>
            {selectedApp && nextStatusOptions[selectedApp.status]?.map((status) => (
              <Button
                key={status}
                variant={status === 'rejected' ? 'destructive' : 'default'}
                disabled={updating}
                onClick={() => updateStatus(selectedApp.id, status)}
              >
                {statusLabels[status]?.label}にする
              </Button>
            ))}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
