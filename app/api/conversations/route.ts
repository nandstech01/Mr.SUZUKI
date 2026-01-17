import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      )
    }

    let conversations

    if (profile.role === 'engineer') {
      const { data: engineerProfile } = await supabase
        .from('engineer_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!engineerProfile) {
        return NextResponse.json([])
      }

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          company_profiles (
            company_name,
            profiles:owner_id (
              display_name,
              avatar_url
            )
          ),
          job_posts (
            title
          )
        `)
        .eq('engineer_profile_id', engineerProfile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      conversations = data
    } else if (profile.role === 'company') {
      const { data: companyProfile } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!companyProfile) {
        return NextResponse.json([])
      }

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          engineer_profiles (
            headline,
            profiles:owner_id (
              display_name,
              avatar_url
            )
          ),
          job_posts (
            title
          )
        `)
        .eq('company_profile_id', companyProfile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      conversations = data
    }

    return NextResponse.json(conversations || [])
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: '会話一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
    const { company_profile_id, engineer_profile_id, job_post_id } = body

    if (!company_profile_id || !engineer_profile_id) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('company_profile_id', company_profile_id)
      .eq('engineer_profile_id', engineer_profile_id)
      .eq('job_post_id', job_post_id || null)
      .single()

    if (existing) {
      return NextResponse.json(existing)
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        company_profile_id,
        engineer_profile_id,
        job_post_id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: '会話の作成に失敗しました' },
      { status: 500 }
    )
  }
}
