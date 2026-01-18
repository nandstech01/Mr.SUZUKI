'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Check,
  MessageSquare,
  FileText,
  Users,
  Zap,
  Loader2,
  CheckCheck
} from 'lucide-react'
import type { NotificationType } from '@/types/database'

interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string; border: string }> = {
  application: { icon: Users, color: 'text-cyan-bright', bg: 'bg-cyan-glow/10', border: 'border-cyan-glow/30' },
  message: { icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  contract: { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  system: { icon: Bell, color: 'text-midnight-400', bg: 'bg-midnight-700/50', border: 'border-midnight-600/50' },
  scout: { icon: Zap, color: 'text-gold-bright', bg: 'bg-gold-bright/10', border: 'border-gold-bright/30' },
}

const typeLabels: Record<NotificationType, string> = {
  application: '応募',
  message: 'メッセージ',
  contract: '契約',
  system: 'システム',
  scout: 'スカウト',
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (!res.ok) {
          router.push('/login')
          return
        }
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [router])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' })
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' })
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}分前`
    if (diffHours < 24) return `${diffHours}時間前`
    if (diffDays < 7) return `${diffDays}日前`
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="font-display text-3xl font-bold text-white mb-8">通知</h1>
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-cyan-bright animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.06),transparent_50%)]" />
      </div>

      <div className="relative container mx-auto px-4 md:px-6 py-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">通知</h1>
            {unreadCount > 0 && (
              <p className="text-midnight-400 mt-1">
                <span className="text-cyan-bright font-semibold">{unreadCount}</span>件の未読通知
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-midnight-300 hover:text-cyan-bright hover:border-cyan-glow/30 transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="font-medium">全て既読にする</span>
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {notifications.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-midnight-500" />
              </div>
              <p className="text-midnight-400">通知はありません</p>
            </div>
          ) : (
            <div className="divide-y divide-midnight-700/50">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-5 cursor-pointer transition-all hover:bg-midnight-800/30 ${
                      !notification.is_read ? 'bg-cyan-glow/5' : ''
                    }`}
                    onClick={() => handleClick(notification)}
                  >
                    <div className={`p-3 rounded-xl ${config.bg} border ${config.border} flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-medium ${!notification.is_read ? 'text-white' : 'text-midnight-300'}`}>
                          {notification.title}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-lg ${config.bg} ${config.color} border ${config.border}`}>
                          {typeLabels[notification.type]}
                        </span>
                        {!notification.is_read && (
                          <span className="w-2.5 h-2.5 bg-cyan-bright rounded-full animate-pulse" />
                        )}
                      </div>
                      {notification.body && (
                        <p className="text-sm text-midnight-400 mb-2 line-clamp-2">
                          {notification.body}
                        </p>
                      )}
                      <p className="text-xs text-midnight-500">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    {notification.link && (
                      <div className="text-midnight-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
