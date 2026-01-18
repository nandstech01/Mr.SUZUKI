'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, Loader2, MessageSquare } from 'lucide-react'

interface Message {
  id: string
  body: string
  created_at: string
  sender_profile_id: string
  profiles: {
    display_name: string
    avatar_url: string | null
  }
}

export default function CompanyMessageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const meRes = await fetch('/api/me')
        if (meRes.ok) {
          const meData = await meRes.json()
          setCurrentUserId(meData.id)
        }

        // Get messages
        const res = await fetch(`/api/conversations/${params.id}/messages`)
        if (!res.ok) {
          router.push('/company/messages')
          return
        }
        const data = await res.json()
        setMessages(data)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const res = await fetch(`/api/conversations/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newMessage }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, data])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-gold-bright animate-spin" />
            <p className="text-midnight-400">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-midnight-400 hover:text-gold-bright transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        戻る
      </button>

      {/* Chat Container */}
      <div className="glass-card rounded-2xl h-[600px] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-midnight-500" />
              </div>
              <p className="text-midnight-400">メッセージを送信して会話を始めましょう</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_profile_id === currentUserId
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-semibold text-sm ${
                    isOwn
                      ? 'bg-gold-bright/20 text-gold-bright'
                      : 'bg-cyan-glow/20 text-cyan-bright'
                  }`}>
                    {message.profiles?.display_name?.slice(0, 1).toUpperCase()}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      isOwn
                        ? 'bg-gradient-to-r from-gold-bright to-yellow-500 text-midnight-900'
                        : 'bg-midnight-800/50 border border-midnight-700/50 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.body}</p>
                    <p
                      className={`text-xs mt-2 ${
                        isOwn ? 'text-midnight-700' : 'text-midnight-500'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-midnight-700/50 bg-midnight-800/30">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="メッセージを入力..."
              disabled={sending}
              className="flex-1 px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-600/50 text-white placeholder:text-midnight-500 focus:outline-none focus:border-gold-bright/50 focus:ring-2 focus:ring-gold-bright/20 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-bright to-yellow-500 text-midnight-900 font-semibold hover:from-yellow-400 hover:to-gold-bright disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-gold-bright/20"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  送信
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
