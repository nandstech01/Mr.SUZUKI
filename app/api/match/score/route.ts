import { createClient } from '@/lib/supabase/server'
import { calculateMatchScore } from '@/lib/utils/match-score'
import { NextResponse } from 'next/server'

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
    const { job_id, engineer_id } = body

    if (!job_id || !engineer_id) {
      return NextResponse.json(
        { error: '案件IDとエンジニアIDは必須です' },
        { status: 400 }
      )
    }

    // Get job post
    const { data: jobPost } = await supabase
      .from('job_posts')
      .select(`
        *,
        job_skill_links (
          skill_id,
          weight
        )
      `)
      .eq('id', job_id)
      .single()

    if (!jobPost) {
      return NextResponse.json(
        { error: '案件が見つかりません' },
        { status: 404 }
      )
    }

    // Get engineer profile
    const { data: engineerProfile } = await supabase
      .from('engineer_profiles')
      .select(`
        *,
        engineer_skill_links (
          skill_id,
          level
        )
      `)
      .eq('id', engineer_id)
      .single()

    if (!engineerProfile) {
      return NextResponse.json(
        { error: 'エンジニアプロフィールが見つかりません' },
        { status: 404 }
      )
    }

    const score = calculateMatchScore({
      engineer_skills: engineerProfile.engineer_skill_links || [],
      job_skills: jobPost.job_skill_links || [],
      engineer_desired_monthly: engineerProfile.desired_min_monthly_yen,
      job_budget_min: jobPost.budget_min_monthly_yen,
      job_budget_max: jobPost.budget_max_monthly_yen,
      engineer_remote_ok: engineerProfile.remote_ok,
      job_remote_ok: jobPost.remote_ok,
      engineer_availability_hours: engineerProfile.availability_hours_per_week,
      job_weekly_hours_min: jobPost.weekly_hours_min,
      job_weekly_hours_max: jobPost.weekly_hours_max,
    })

    // Update application if exists
    await supabase
      .from('applications')
      .update({ match_score: score })
      .eq('job_post_id', job_id)
      .eq('engineer_profile_id', engineer_id)

    return NextResponse.json({ score })
  } catch (error) {
    console.error('Calculate match score error:', error)
    return NextResponse.json(
      { error: 'マッチスコアの計算に失敗しました' },
      { status: 500 }
    )
  }
}
