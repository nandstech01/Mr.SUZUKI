'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Application {
  id: string
  status: string
  match_score: number
  cover_letter: string | null
  created_at: string
  job_posts: {
    id: string
    title: string
    engagement: string
    status: string
    budget_min_monthly_yen: number | null
    budget_max_monthly_yen: number | null
    company_profiles: {
      company_name: string
    }
  }
}

export default function EngineerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

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

  const handleWithdraw = async (id: string) => {
    if (!confirm('この応募を取り下げますか？')) return

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'withdrawn' }),
      })

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: 'withdrawn' } : app
          )
        )
      }
    } catch (error) {
      console.error('Failed to withdraw application:', error)
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

  const engagementLabels: Record<string, string> = {
    freelance: 'フリーランス',
    sidejob: '副業',
    fulltime: '正社員',
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return '要相談'
    if (min && max) return `${(min / 10000).toFixed(0)}〜${(max / 10000).toFixed(0)}万円/月`
    if (min) return `${(min / 10000).toFixed(0)}万円〜/月`
    if (max) return `〜${(max / 10000).toFixed(0)}万円/月`
    return '要相談'
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
        <h1 className="text-3xl font-bold">応募一覧</h1>
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
            <SelectItem value="withdrawn">辞退</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'all' ? 'まだ応募がありません' : '該当する応募がありません'}
            </p>
            <Link href="/engineer/jobs">
              <Button>案件を探す</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      <Link
                        href={`/engineer/jobs/${application.job_posts.id}`}
                        className="hover:text-blue-600"
                      >
                        {application.job_posts.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {application.job_posts.company_profiles?.company_name}
                    </CardDescription>
                  </div>
                  <Badge variant={statusLabels[application.status]?.variant || 'secondary'}>
                    {statusLabels[application.status]?.label || application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span>{engagementLabels[application.job_posts.engagement]}</span>
                  <span>
                    {formatBudget(
                      application.job_posts.budget_min_monthly_yen,
                      application.job_posts.budget_max_monthly_yen
                    )}
                  </span>
                  <span>マッチ度: {application.match_score}%</span>
                  <span>
                    応募日: {new Date(application.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <div className="flex gap-2">
                  {['applied', 'screening'].includes(application.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWithdraw(application.id)}
                    >
                      応募を取り下げ
                    </Button>
                  )}
                  {application.status === 'offer' && (
                    <Button size="sm">オファーを確認</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
