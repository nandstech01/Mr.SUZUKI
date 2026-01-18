import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type ConversationWithParticipants = {
  id: string
  company_profiles: { owner_id: string } | null
  engineer_profiles: { owner_id: string } | null
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // Verify user is part of the conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .select(`
        id,
        company_profiles (
          owner_id
        ),
        engineer_profiles (
          owner_id
        )
      `)
      .eq('id', params.id)
      .single<ConversationWithParticipants>()

    if (!conversation) {
      return NextResponse.json(
        { error: '会話が見つかりません' },
        { status: 404 }
      )
    }

    const isParticipant =
      conversation.company_profiles?.owner_id === user.id ||
      conversation.engineer_profiles?.owner_id === user.id

    if (!isParticipant) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:sender_profile_id (
          display_name,
          avatar_url
        )
      `)
      .eq('conversation_id', params.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'メッセージの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { body: messageBody } = body

    if (!messageBody || !messageBody.trim()) {
      return NextResponse.json(
        { error: 'メッセージ内容は必須です' },
        { status: 400 }
      )
    }

    // Verify user is part of the conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .select(`
        id,
        company_profiles (
          owner_id
        ),
        engineer_profiles (
          owner_id
        )
      `)
      .eq('id', params.id)
      .single<ConversationWithParticipants>()

    if (!conversation) {
      return NextResponse.json(
        { error: '会話が見つかりません' },
        { status: 404 }
      )
    }

    const isParticipant =
      conversation.company_profiles?.owner_id === user.id ||
      conversation.engineer_profiles?.owner_id === user.id

    if (!isParticipant) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: params.id,
        sender_profile_id: user.id,
        body: messageBody.trim(),
      } as never)
      .select(`
        *,
        profiles:sender_profile_id (
          display_name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました' },
      { status: 500 }
    )
  }
}
