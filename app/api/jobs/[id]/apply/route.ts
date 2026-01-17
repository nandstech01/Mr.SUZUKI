import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { calculateMatchScore } from '@/lib/utils/match-score'

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
      .eq('owner_id', user.id)
      .single()

    if (!engineerProfile) {
      return NextResponse.json(
        { error: 'エンジニアプロフィールを先に作成してください' },
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
      .eq('id', params.id)
      .eq('status', 'open')
      .single()

    if (!jobPost) {
      return NextResponse.json(
        { error: '案件が見つからないか、募集が終了しています' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { cover_letter } = body

    // Calculate match score
    const matchScore = calculateMatchScore({
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

    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_post_id: params.id,
        engineer_profile_id: engineerProfile.id,
        cover_letter,
        match_score: matchScore,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'この案件には既に応募しています' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Apply error:', error)
    return NextResponse.json(
      { error: '応募に失敗しました' },
      { status: 500 }
    )
  }
}
