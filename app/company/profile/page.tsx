'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CompanyProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    company_name: '',
    website_url: '',
    industry: '',
    company_size: '',
    description: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/company')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setForm({
              company_name: data.company_name || '',
              website_url: data.website_url || '',
              industry: data.industry || '',
              company_size: data.company_size || '',
              description: data.description || '',
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
      const res = await fetch('/api/profile/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('保存に失敗しました')
      }

      router.push('/company/dashboard')
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
      <h1 className="text-3xl font-bold mb-8">企業プロフィール編集</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>企業の基本情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">会社名 *</Label>
              <Input
                id="company_name"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                placeholder="株式会社○○"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">WebサイトURL</Label>
              <Input
                id="website_url"
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">業種</Label>
                <Select
                  value={form.industry}
                  onValueChange={(v) => setForm({ ...form, industry: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT・通信">IT・通信</SelectItem>
                    <SelectItem value="金融">金融</SelectItem>
                    <SelectItem value="製造">製造</SelectItem>
                    <SelectItem value="小売">小売</SelectItem>
                    <SelectItem value="医療・ヘルスケア">医療・ヘルスケア</SelectItem>
                    <SelectItem value="教育">教育</SelectItem>
                    <SelectItem value="メディア・エンタメ">メディア・エンタメ</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_size">会社規模</Label>
                <Select
                  value={form.company_size}
                  onValueChange={(v) => setForm({ ...form, company_size: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10名</SelectItem>
                    <SelectItem value="11-50">11-50名</SelectItem>
                    <SelectItem value="51-200">51-200名</SelectItem>
                    <SelectItem value="201-500">201-500名</SelectItem>
                    <SelectItem value="501-1000">501-1000名</SelectItem>
                    <SelectItem value="1001+">1001名以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">会社紹介</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="会社の事業内容、ミッション、カルチャーなどを記載してください"
                rows={5}
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
