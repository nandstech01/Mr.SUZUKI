import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // Get profile with role-specific data
    type Profile = { id: string; role: string; display_name: string; email: string | null; avatar_url: string | null }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single<Profile>()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      )
    }

    // Fetch role-specific profile
    let roleProfile = null
    if (profile.role === 'engineer') {
      const { data } = await supabase
        .from('engineer_profiles')
        .select('*')
        .eq('owner_id', user.id)
        .single()
      roleProfile = data
    } else if (profile.role === 'company') {
      const { data } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('owner_id', user.id)
        .single()
      roleProfile = data
    }

    return NextResponse.json({
      ...profile,
      engineer_profile: profile.role === 'engineer' ? roleProfile : null,
      company_profile: profile.role === 'company' ? roleProfile : null,
    })
  } catch (error) {
    console.error('Get me error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
