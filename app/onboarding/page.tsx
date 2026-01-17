'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProfileWithDetails } from '@/types'

export default function OnboardingPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/me')
        if (!res.ok) {
          router.push('/login')
          return
        }
        const data = await res.json()
        setProfile(data)

        // If profile already complete, redirect to dashboard
        if (data.role === 'engineer' && data.engineer_profile) {
          router.push('/engineer/dashboard')
        } else if (data.role === 'company' && data.company_profile) {
          router.push('/company/dashboard')
        }
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">読み込み中...</div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const handleContinue = () => {
    if (profile.role === 'engineer') {
      router.push('/engineer/profile')
    } else {
      router.push('/company/profile')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ようこそ、{profile.display_name}さん!</CardTitle>
          <CardDescription>
            {profile.role === 'engineer'
              ? 'エンジニアプロフィールを設定して、案件を探しましょう'
              : '企業プロフィールを設定して、エンジニアを探しましょう'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-100 rounded-lg p-4">
            <h3 className="font-medium mb-2">次のステップ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {profile.role === 'engineer' ? (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                    プロフィールを作成
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs">2</span>
                    スキルを登録
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs">3</span>
                    案件に応募
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                    企業プロフィールを作成
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs">2</span>
                    案件を投稿
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs">3</span>
                    応募者を確認
                  </li>
                </>
              )}
            </ul>
          </div>
          <Button onClick={handleContinue} className="w-full">
            プロフィールを設定する
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
