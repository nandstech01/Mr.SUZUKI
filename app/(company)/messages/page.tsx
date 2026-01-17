'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Conversation {
  id: string
  created_at: string
  engineer_profiles: {
    headline: string | null
    profiles: {
      display_name: string
      avatar_url: string | null
    }
  }
  job_posts: {
    title: string
  } | null
}

export default function CompanyMessagesPage() {
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">メッセージ</h1>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              まだメッセージはありません。
              <br />
              応募者に連絡すると、ここにメッセージが表示されます。
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Link key={conversation.id} href={`/company/messages/${conversation.id}`}>
              <Card className="hover:bg-slate-50 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={conversation.engineer_profiles?.profiles?.avatar_url || undefined}
                      />
                      <AvatarFallback>
                        {conversation.engineer_profiles?.profiles?.display_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">
                        {conversation.engineer_profiles?.profiles?.display_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {conversation.engineer_profiles?.headline || '未設定'}
                      </div>
                      {conversation.job_posts && (
                        <div className="text-xs text-muted-foreground mt-1">
                          案件: {conversation.job_posts.title}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(conversation.created_at).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
