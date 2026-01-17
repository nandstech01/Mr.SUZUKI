'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { JobPostWithCompany } from '@/types'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobPostWithCompany | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`)
        if (!res.ok) {
          throw new Error('Job not found')
        }
        const data = await res.json()
        setJob(data)
      } catch (error) {
        console.error('Failed to fetch job:', error)
        router.push('/engineer/jobs')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id, router])

  const handleApply = async () => {
    setApplying(true)
    try {
      const res = await fetch(`/api/jobs/${params.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cover_letter: coverLetter }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '応募に失敗しました')
      }

      alert('応募が完了しました')
      router.push('/engineer/applications')
    } catch (error) {
      alert(error instanceof Error ? error.message : '応募に失敗しました')
    } finally {
      setApplying(false)
      setShowApplyDialog(false)
    }
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

  if (!job) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription className="mt-2">
                {job.company_profiles?.company_name}
                {job.company_profiles?.industry && (
                  <span className="ml-2">/ {job.company_profiles.industry}</span>
                )}
              </CardDescription>
            </div>
            <Button onClick={() => setShowApplyDialog(true)} size="lg">
              応募する
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-muted-foreground">月額報酬</div>
              <div className="text-lg font-semibold text-blue-600">
                {formatBudget(job.budget_min_monthly_yen, job.budget_max_monthly_yen)}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-muted-foreground">契約形態</div>
              <div className="text-lg font-semibold">
                {engagementLabels[job.engagement]}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-muted-foreground">勤務形態</div>
              <div className="text-lg font-semibold">
                {job.remote_ok ? 'リモート可' : 'オンサイト'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">案件詳細</h3>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {job.description}
            </p>
          </div>

          {/* Must Have */}
          {job.must_have && (
            <div>
              <h3 className="font-semibold mb-2">必須スキル・条件</h3>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {job.must_have}
              </p>
            </div>
          )}

          {/* Nice to Have */}
          {job.nice_to_have && (
            <div>
              <h3 className="font-semibold mb-2">歓迎スキル・条件</h3>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {job.nice_to_have}
              </p>
            </div>
          )}

          {/* Skills */}
          {job.job_skill_links && job.job_skill_links.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">求めるスキル</h3>
              <div className="flex flex-wrap gap-2">
                {job.job_skill_links.map((link) => (
                  <span
                    key={link.skill_id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                  >
                    {link.skills?.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {job.weekly_hours_min || job.weekly_hours_max ? (
              <div>
                <span className="text-muted-foreground">稼働時間: </span>
                {job.weekly_hours_min && job.weekly_hours_max
                  ? `${job.weekly_hours_min}〜${job.weekly_hours_max}時間/週`
                  : job.weekly_hours_min
                  ? `${job.weekly_hours_min}時間〜/週`
                  : `〜${job.weekly_hours_max}時間/週`}
              </div>
            ) : null}
            {job.duration_months && (
              <div>
                <span className="text-muted-foreground">契約期間: </span>
                {job.duration_months}ヶ月
              </div>
            )}
            {job.location && (
              <div>
                <span className="text-muted-foreground">勤務地: </span>
                {job.location}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>この案件に応募する</DialogTitle>
            <DialogDescription>
              {job.title} - {job.company_profiles?.company_name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="coverLetter">カバーレター（任意）</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="自己PRやこの案件への意気込みを記載してください"
              rows={6}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleApply} disabled={applying}>
              {applying ? '応募中...' : '応募する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
