import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { notifyScout } from '@/lib/notifications'

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  try {
    const { engineerProfileId, jobPostId, message } = await request.json()

    if (!engineerProfileId || !message) {
      return NextResponse.json({ error: 'パラメータが不足しています' }, { status: 400 })
    }

    // Get company profile
    const { data: companyProfile, error: companyError } = await supabase
      .from('company_profiles')
      .select('id, company_name')
      .eq('owner_id', user.id)
      .single<{ id: string; company_name: string }>()

    if (companyError || !companyProfile) {
      return NextResponse.json({ error: '企業プロフィールが見つかりません' }, { status: 400 })
    }

    // Get engineer's owner_id for notification
    const { data: engineerProfile, error: engineerError } = await supabase
      .from('engineer_profiles')
      .select('owner_id')
      .eq('id', engineerProfileId)
      .single<{ owner_id: string }>()

    if (engineerError || !engineerProfile) {
      return NextResponse.json({ error: 'エンジニアが見つかりません' }, { status: 404 })
    }

    // Get job title if job is specified
    let jobTitle: string | undefined
    if (jobPostId) {
      const { data: job } = await supabase
        .from('job_posts')
        .select('title')
        .eq('id', jobPostId)
        .single<{ title: string }>()
      jobTitle = job?.title
    }

    // Create scout record
    const { data: scout, error: scoutError } = await supabase
      .from('scouts')
      .insert({
        company_profile_id: companyProfile.id,
        engineer_profile_id: engineerProfileId,
        job_post_id: jobPostId || null,
        message,
      } as never)
      .select()
      .single<{ id: string }>()

    if (scoutError) throw scoutError

    // Create conversation if not exists
    const { data: existingConvo } = await supabase
      .from('conversations')
      .select('id')
      .eq('company_profile_id', companyProfile.id)
      .eq('engineer_profile_id', engineerProfileId)
      .maybeSingle() as { data: { id: string } | null }

    let conversationId = existingConvo?.id

    if (!conversationId) {
      const { data: newConvo, error: convoError } = await supabase
        .from('conversations')
        .insert({
          company_profile_id: companyProfile.id,
          engineer_profile_id: engineerProfileId,
          job_post_id: jobPostId || null,
        } as never)
        .select()
        .single<{ id: string }>()

      if (convoError) throw convoError
      conversationId = newConvo.id
    }

    // Send scout message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_profile_id: user.id,
        body: `【スカウト】\n\n${message}`,
      } as never)

    if (messageError) throw messageError

    // Send notification
    await notifyScout(engineerProfile.owner_id, companyProfile.company_name, jobTitle)

    return NextResponse.json({
      message: 'スカウトを送信しました',
      scout,
    })
  } catch (error) {
    console.error('Scout error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  try {
    // Get company profile
    const { data: companyProfile } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('owner_id', user.id)
      .single<{ id: string }>()

    if (!companyProfile) {
      return NextResponse.json({ error: '企業プロフィールが見つかりません' }, { status: 400 })
    }

    const { data: scouts, error } = await supabase
      .from('scouts')
      .select(`
        id,
        message,
        status,
        created_at,
        engineer_profiles!inner(
          id,
          headline,
          profiles:owner_id(display_name)
        ),
        job_posts(title)
      `)
      .eq('company_profile_id', companyProfile.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ scouts: scouts || [] })
  } catch (error) {
    console.error('Scouts fetch error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
