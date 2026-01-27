'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { Zap, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react'
import type { ProfileWithDetails } from '@/types'

interface NavbarProps {
  variant?: 'default' | 'engineer' | 'company' | 'admin'
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    { href: '/company/engineers', label: 'エンジニア検索' },
    { href: '/company/jobs', label: '案件管理' },
    { href: '/company/applications', label: '応募者一覧' },
    { href: '/company/messages', label: 'メッセージ' },
    { href: '/company/contracts', label: '契約' },
    { href: '/company/billing', label: '請求・支払い' },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'ダッシュボード' },
    { href: '/admin/users', label: 'ユーザー管理' },
    { href: '/admin/jobs', label: '案件管理' },
    { href: '/admin/contracts', label: '契約管理' },
    { href: '/admin/skills', label: 'スキル管理' },
  ]

  const links = variant === 'engineer' ? engineerLinks
    : variant === 'company' ? companyLinks
    : variant === 'admin' ? adminLinks
    : []

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 bg-midnight-900/95 backdrop-blur-xl border-b border-midnight-700/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Image
                src="/logo.png"
                alt="キャリアブリッジ"
                width={200}
                height={44}
                className="h-11 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            {!loading && profile && links.length > 0 && (
              <nav className="hidden lg:flex items-center gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? 'bg-cyan-glow/10 text-cyan-bright'
                        : 'text-midnight-300 hover:text-white hover:bg-midnight-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-9 h-9 bg-midnight-700 rounded-full animate-pulse" />
            ) : profile ? (
              <>
                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-9 w-9 rounded-full ring-2 ring-midnight-600 hover:ring-cyan-glow/50 transition-all duration-200">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-glow to-cyan-bright text-midnight-900 font-semibold text-sm">
                          {profile.display_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-midnight-800 border-midnight-600 text-white">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-white">{profile.display_name}</p>
                      <p className="text-xs text-midnight-400">{profile.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-midnight-600" />
                    {profile.role !== 'admin' && (
                      <DropdownMenuItem asChild className="hover:bg-midnight-700 focus:bg-midnight-700 cursor-pointer">
                        <Link href={profile.role === 'engineer' ? '/engineer/profile' : '/company/profile'} className="flex items-center gap-2">
                          <User className="w-4 h-4 text-midnight-400" />
                          <span>プロフィール</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="hover:bg-midnight-700 focus:bg-midnight-700 cursor-pointer">
                      <Link href={
                        profile.role === 'admin' ? '/admin/dashboard'
                          : profile.role === 'engineer' ? '/engineer/dashboard'
                          : '/company/dashboard'
                      } className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-midnight-400" />
                        <span>ダッシュボード</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-midnight-600" />
                    <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>ログアウト</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-midnight-300 hover:text-white transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <button className="px-4 py-2 text-sm text-midnight-200 hover:text-white font-medium transition-colors">
                    ログイン
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="btn-premium px-5 py-2 text-sm">
                    <span>新規登録</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && profile && links.length > 0 && (
          <nav className="lg:hidden py-4 border-t border-midnight-700/50">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-cyan-glow/10 text-cyan-bright'
                      : 'text-midnight-300 hover:text-white hover:bg-midnight-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
