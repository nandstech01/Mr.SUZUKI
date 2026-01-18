'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  interviewScheduled: number
  activeContracts: number
}

export default function EngineerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    interviewScheduled: 0,
    activeContracts: 0,
  })
  const [recentApplications, setRecentApplications] = useState<Array<{
    id: string
    status: string
    job_posts: {
      title: string
      company_profiles: { company_name: string }
    }
    created_at: string
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsRes, contractsRes] = await Promise.all([
          fetch('/api/applications'),
          fetch('/api/contracts'),
        ])

        const applications = await applicationsRes.json()
        const contracts = await contractsRes.json()

        if (Array.isArray(applications)) {
          setStats({
            totalApplications: applications.length,
            pendingApplications: applications.filter((a: { status: string }) =>
              ['applied', 'screening'].includes(a.status)
            ).length,
            interviewScheduled: applications.filter((a: { status: string }) =>
              a.status === 'interview'
            ).length,
            activeContracts: Array.isArray(contracts)
              ? contracts.filter((c: { status: string }) => c.status === 'active').length
              : 0,
          })
          setRecentApplications(applications.slice(0, 5))
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statusLabels: Record<string, string> = {
    applied: '応募済み',
    screening: '選考中',
    interview: '面談予定',
    offer: 'オファー',
    accepted: '承認済み',
    rejected: '不採用',
    withdrawn: '辞退',
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
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <Link href="/engineer/jobs">
          <Button>案件を探す</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>応募総数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>選考中</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.pendingApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>面談予定</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.interviewScheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>契約中</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.activeContracts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>最近の応募</CardTitle>
            <Link href="/engineer/applications">
              <Button variant="ghost" size="sm">すべて見る</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              まだ応募がありません。
              <br />
              <Link href="/engineer/jobs" className="text-blue-600 hover:underline">
                案件を探す
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{application.job_posts?.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {application.job_posts?.company_profiles?.company_name}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="px-2 py-1 bg-slate-100 rounded">
                      {statusLabels[application.status] || application.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
