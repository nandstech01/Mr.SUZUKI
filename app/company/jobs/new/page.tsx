'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function NewJobPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    engagement: '',
    location: '',
    remote_ok: true,
    weekly_hours_min: '',
    weekly_hours_max: '',
    duration_months: '',
    budget_min_monthly_yen: '',
    budget_max_monthly_yen: '',
    must_have: '',
    nice_to_have: '',
  })

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Create job
      const createRes = await fetch('/api/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          weekly_hours_min: form.weekly_hours_min ? parseInt(form.weekly_hours_min) : null,
          weekly_hours_max: form.weekly_hours_max ? parseInt(form.weekly_hours_max) : null,
          duration_months: form.duration_months ? parseInt(form.duration_months) : null,
          budget_min_monthly_yen: form.budget_min_monthly_yen ? parseInt(form.budget_min_monthly_yen) : null,
          budget_max_monthly_yen: form.budget_max_monthly_yen ? parseInt(form.budget_max_monthly_yen) : null,
        }),
      })

      if (!createRes.ok) {
        const data = await createRes.json()
        throw new Error(data.error || '案件の作成に失敗しました')
      }

      const job = await createRes.json()

      // Publish if requested
      if (publish) {
        const publishRes = await fetch(`/api/job/${job.id}/publish`, {
          method: 'POST',
        })

        if (!publishRes.ok) {
          alert('案件は作成されましたが、公開に失敗しました')
        }
      }

      router.push('/company/jobs')
    } catch (error) {
      alert(error instanceof Error ? error.message : '案件の作成に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">案件を作成</h1>

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>案件の基本情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="例: 生成AIを活用したチャットボット開発"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">案件詳細 *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="案件の詳細、求める役割、チーム構成などを記載してください"
                rows={6}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engagement">契約形態 *</Label>
                <Select
                  value={form.engagement}
                  onValueChange={(v) => setForm({ ...form, engagement: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freelance">フリーランス</SelectItem>
                    <SelectItem value="sidejob">副業</SelectItem>
                    <SelectItem value="fulltime">正社員</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">勤務地</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="東京都渋谷区"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="remote_ok">リモートワーク可</Label>
              <Switch
                id="remote_ok"
                checked={form.remote_ok}
                onCheckedChange={(checked) => setForm({ ...form, remote_ok: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>稼働条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weekly_hours_min">最低稼働時間/週</Label>
                <Input
                  id="weekly_hours_min"
                  type="number"
                  value={form.weekly_hours_min}
                  onChange={(e) => setForm({ ...form, weekly_hours_min: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekly_hours_max">最大稼働時間/週</Label>
                <Input
                  id="weekly_hours_max"
                  type="number"
                  value={form.weekly_hours_max}
                  onChange={(e) => setForm({ ...form, weekly_hours_max: e.target.value })}
                  placeholder="40"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_months">契約期間（月）</Label>
              <Input
                id="duration_months"
                type="number"
                value={form.duration_months}
                onChange={(e) => setForm({ ...form, duration_months: e.target.value })}
                placeholder="6"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>報酬</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min_monthly_yen">月額下限（円）</Label>
                <Input
                  id="budget_min_monthly_yen"
                  type="number"
                  value={form.budget_min_monthly_yen}
                  onChange={(e) => setForm({ ...form, budget_min_monthly_yen: e.target.value })}
                  placeholder="600000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_max_monthly_yen">月額上限（円）</Label>
                <Input
                  id="budget_max_monthly_yen"
                  type="number"
                  value={form.budget_max_monthly_yen}
                  onChange={(e) => setForm({ ...form, budget_max_monthly_yen: e.target.value })}
                  placeholder="1200000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>スキル要件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="must_have">必須スキル・条件</Label>
              <Textarea
                id="must_have"
                value={form.must_have}
                onChange={(e) => setForm({ ...form, must_have: e.target.value })}
                placeholder="- Python 3年以上&#10;- 機械学習の実務経験&#10;- LLMを使った開発経験"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nice_to_have">歓迎スキル・条件</Label>
              <Textarea
                id="nice_to_have"
                value={form.nice_to_have}
                onChange={(e) => setForm({ ...form, nice_to_have: e.target.value })}
                placeholder="- MLOps経験&#10;- AWS/GCPでのデプロイ経験&#10;- チームリード経験"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            variant="outline"
            className="flex-1"
          >
            下書き保存
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="flex-1"
          >
            {saving ? '保存中...' : '公開する'}
          </Button>
        </div>
      </form>
    </div>
  )
}
