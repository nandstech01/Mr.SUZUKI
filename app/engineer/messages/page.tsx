'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Building2, Briefcase, ChevronRight, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Conversation {
  id: string
  created_at: string
  company_profiles: {
    company_name: string
    profiles: {
      display_name: string
      avatar_url: string | null
    }
  }
  job_posts: {
    title: string
  } | null
}

export default function EngineerMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/conversations')
        if (res.ok) {
          const data = await res.json()
          setConversations(data)
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-cyan-bright animate-spin" />
            <p className="text-midnight-400">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          メッセージ
        </h1>
        <p className="text-midnight-400">
          企業とのやり取りを管理
        </p>
      </div>

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-midnight-500" />
          </div>
          <p className="text-midnight-400 mb-2">
            まだメッセージはありません
          </p>
          <p className="text-midnight-500 text-sm">
            案件に応募すると、企業とやり取りできるようになります
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-midnight-700/50">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/engineer/messages/${conversation.id}`}
              className="flex items-center gap-4 p-4 hover:bg-midnight-800/30 transition-colors group"
            >
              <Avatar className="h-12 w-12 ring-2 ring-midnight-600">
                <AvatarImage
                  src={conversation.company_profiles?.profiles?.avatar_url || undefined}
                />
                <AvatarFallback className="bg-gradient-to-br from-cyan-glow to-cyan-bright text-midnight-900 font-semibold">
                  {conversation.company_profiles?.company_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-midnight-500" />
                  <span className="font-medium text-white group-hover:text-cyan-bright transition-colors">
                    {conversation.company_profiles?.company_name}
                  </span>
                </div>
                {conversation.job_posts && (
                  <div className="flex items-center gap-2 text-sm text-midnight-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="truncate">{conversation.job_posts.title}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-midnight-500">
                  {new Date(conversation.created_at).toLocaleDateString('ja-JP')}
                </span>
                <ChevronRight className="w-5 h-5 text-midnight-500 group-hover:text-cyan-bright group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
