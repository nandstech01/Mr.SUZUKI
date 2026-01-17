'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function EngineerProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    headline: '',
    bio: '',
    years_of_experience: '',
    location: '',
    remote_ok: true,
    availability_hours_per_week: '',
    desired_engagement: '',
    desired_min_monthly_yen: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/engineer')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setForm({
              headline: data.headline || '',
              bio: data.bio || '',
              years_of_experience: data.years_of_experience?.toString() || '',
              location: data.location || '',
              remote_ok: data.remote_ok ?? true,
              availability_hours_per_week: data.availability_hours_per_week?.toString() || '',
              desired_engagement: data.desired_engagement || '',
              desired_min_monthly_yen: data.desired_min_monthly_yen?.toString() || '',
              github_url: data.github_url || '',
              linkedin_url: data.linkedin_url || '',
              portfolio_url: data.portfolio_url || '',
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/profile/engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          years_of_experience: form.years_of_experience ? parseInt(form.years_of_experience) : null,
          availability_hours_per_week: form.availability_hours_per_week ? parseInt(form.availability_hours_per_week) : null,
          desired_min_monthly_yen: form.desired_min_monthly_yen ? parseInt(form.desired_min_monthly_yen) : null,
        }),
      })

      if (!res.ok) {
        throw new Error('保存に失敗しました')
      }

      router.push('/engineer/dashboard')
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">プロフィール編集</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>あなたのスキルや経験をアピールしましょう</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headline">ヘッドライン</Label>
              <Input
                id="headline"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="例: MLエンジニア / 生成AI専門"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="あなたのスキル、経験、得意分野を記載してください"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_of_experience">経験年数</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  value={form.years_of_experience}
                  onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">所在地</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="東京都"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>希望条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="remote_ok">リモートワーク可</Label>
              <Switch
                id="remote_ok"
                checked={form.remote_ok}
                onCheckedChange={(checked) => setForm({ ...form, remote_ok: checked })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availability_hours_per_week">稼働可能時間/週</Label>
                <Input
                  id="availability_hours_per_week"
                  type="number"
                  value={form.availability_hours_per_week}
                  onChange={(e) => setForm({ ...form, availability_hours_per_week: e.target.value })}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desired_engagement">希望契約形態</Label>
                <Select
                  value={form.desired_engagement}
                  onValueChange={(v) => setForm({ ...form, desired_engagement: v })}
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="desired_min_monthly_yen">希望月額報酬（円）</Label>
              <Input
                id="desired_min_monthly_yen"
                type="number"
                value={form.desired_min_monthly_yen}
                onChange={(e) => setForm({ ...form, desired_min_monthly_yen: e.target.value })}
                placeholder="800000"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>リンク</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub</Label>
              <Input
                id="github_url"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                id="linkedin_url"
                value={form.linkedin_url}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio_url">ポートフォリオ</Label>
              <Input
                id="portfolio_url"
                value={form.portfolio_url}
                onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                placeholder="https://your-portfolio.com"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? '保存中...' : '保存する'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}
