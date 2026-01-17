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

    let applications

    if (profile.role === 'engineer') {
      // Get engineer's applications
      const { data: engineerProfile } = await supabase
        .from('engineer_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!engineerProfile) {
        return NextResponse.json([])
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job_posts (
            id,
            title,
            engagement,
            status,
            budget_min_monthly_yen,
            budget_max_monthly_yen,
            company_profiles (
              company_name
            )
          )
        `)
        .eq('engineer_profile_id', engineerProfile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      applications = data
    } else if (profile.role === 'company') {
      // Get applications to company's jobs
      const { data: companyProfile } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!companyProfile) {
        return NextResponse.json([])
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job_posts!inner (
            id,
            title,
            company_profile_id
          ),
          engineer_profiles (
            id,
            headline,
            years_of_experience,
            desired_min_monthly_yen,
            profiles:owner_id (
              display_name,
              avatar_url
            )
          )
        `)
        .eq('job_posts.company_profile_id', companyProfile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      applications = data
    }

    return NextResponse.json(applications || [])
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: '応募一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}
