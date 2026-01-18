'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface JobPost {
  id: string
  title: string
  engagement: string
  status: string
  budget_min_monthly_yen: number | null
  budget_max_monthly_yen: number | null
  created_at: string
  _count?: {
    applications: number
  }
}

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Note: This would need a dedicated company jobs endpoint
        // For now, we'll use a placeholder
        setJobs([])
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: '下書き', variant: 'secondary' },
    open: { label: '募集中', variant: 'default' },
    paused: { label: '停止中', variant: 'outline' },
    closed: { label: '終了', variant: 'destructive' },
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
        <h1 className="text-3xl font-bold">案件管理</h1>
        <Link href="/company/jobs/new">
          <Button>新規作成</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              まだ案件がありません
            </p>
            <Link href="/company/jobs/new">
              <Button>最初の案件を作成</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      <Link href={`/company/jobs/${job.id}`} className="hover:text-blue-600">
                        {job.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {engagementLabels[job.engagement]} ・ {formatBudget(job.budget_min_monthly_yen, job.budget_max_monthly_yen)}
                    </CardDescription>
                  </div>
                  <Badge variant={statusLabels[job.status]?.variant || 'secondary'}>
                    {statusLabels[job.status]?.label || job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    応募者: {job._count?.applications || 0}名
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/company/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm">編集</Button>
                    </Link>
                    <Link href={`/company/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">詳細</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
