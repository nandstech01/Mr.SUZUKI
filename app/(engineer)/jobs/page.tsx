'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { JobPostWithCompany } from '@/types'

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPostWithCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [engagement, setEngagement] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (engagement) params.set('engagement', engagement)
      if (remoteOnly) params.set('remote', 'true')

      const res = await fetch(`/api/jobs?${params.toString()}`)
      const data = await res.json()
      setJobs(data.data || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [engagement, remoteOnly])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">案件を探す</h1>

      {/* Search & Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キーワードで検索..."
              />
            </div>
            <Select value={engagement} onValueChange={setEngagement}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="契約形態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">すべて</SelectItem>
                <SelectItem value="freelance">フリーランス</SelectItem>
                <SelectItem value="sidejob">副業</SelectItem>
                <SelectItem value="fulltime">正社員</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remoteOnly"
                checked={remoteOnly}
                onCheckedChange={(checked) => setRemoteOnly(checked === true)}
              />
              <label htmlFor="remoteOnly" className="text-sm">リモート可のみ</label>
            </div>
            <Button type="submit">検索</Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          該当する案件が見つかりませんでした
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      <Link href={`/engineer/jobs/${job.id}`} className="hover:text-blue-600">
                        {job.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {job.company_profiles?.company_name}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatBudget(job.budget_min_monthly_yen, job.budget_max_monthly_yen)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {engagementLabels[job.engagement]}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  {job.remote_ok && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      リモート可
                    </span>
                  )}
                  {job.job_skill_links?.slice(0, 5).map((link) => (
                    <span
                      key={link.skill_id}
                      className="px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded"
                    >
                      {link.skills?.name}
                    </span>
                  ))}
                  {(job.job_skill_links?.length || 0) > 5 && (
                    <span className="text-xs text-muted-foreground">
                      +{(job.job_skill_links?.length || 0) - 5}
                    </span>
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
