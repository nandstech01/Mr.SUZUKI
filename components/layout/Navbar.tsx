'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { ProfileWithDetails } from '@/types'

interface NavbarProps {
  variant?: 'default' | 'engineer' | 'company'
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/me')
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const engineerLinks = [
    { href: '/engineer/dashboard', label: 'ダッシュボード' },
    { href: '/engineer/jobs', label: '案件を探す' },
    { href: '/engineer/applications', label: '応募一覧' },
    { href: '/engineer/messages', label: 'メッセージ' },
  ]

  const companyLinks = [
    { href: '/company/dashboard', label: 'ダッシュボード' },
    { href: '/company/jobs', label: '案件管理' },
    { href: '/company/applications', label: '応募者一覧' },
    { href: '/company/messages', label: 'メッセージ' },
    { href: '/company/contracts', label: '契約' },
    { href: '/company/billing', label: '請求・支払い' },
  ]

  const links = variant === 'engineer' ? engineerLinks : variant === 'company' ? companyLinks : []

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AIMatch Pro
          </Link>
          {!loading && profile && links.length > 0 && (
            <nav className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-blue-600 font-medium'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
          ) : profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
                    <AvatarFallback>
                      {profile.display_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile.display_name}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={profile.role === 'engineer' ? '/engineer/profile' : '/company/profile'}>
                    プロフィール
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={profile.role === 'engineer' ? '/engineer/dashboard' : '/company/dashboard'}>
                    ダッシュボード
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">ログイン</Button>
              </Link>
              <Link href="/signup">
                <Button>新規登録</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
