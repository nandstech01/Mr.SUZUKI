import { createClient } from '@/lib/supabase/server'
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

    // Get company profile
    const { data: companyProfile } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!companyProfile) {
      return NextResponse.json(
        { error: '企業プロフィールを先に作成してください' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      engagement,
      location,
      remote_ok,
      weekly_hours_min,
      weekly_hours_max,
      duration_months,
      budget_min_monthly_yen,
      budget_max_monthly_yen,
      must_have,
      nice_to_have,
      skills,
    } = body

    if (!title || !description || !engagement) {
      return NextResponse.json(
        { error: 'タイトル、説明、契約形態は必須です' },
        { status: 400 }
      )
    }

    const { data: jobPost, error } = await supabase
      .from('job_posts')
      .insert({
        company_profile_id: companyProfile.id,
        title,
        description,
        engagement,
        status: 'draft',
        location,
        remote_ok,
        weekly_hours_min,
        weekly_hours_max,
        duration_months,
        budget_min_monthly_yen,
        budget_max_monthly_yen,
        must_have,
        nice_to_have,
      })
      .select()
      .single()

    if (error) throw error

    // Add skills if provided
    if (skills && Array.isArray(skills) && skills.length > 0) {
      const skillLinks = skills.map((skill: { skill_id: string; weight: number }) => ({
        job_post_id: jobPost.id,
        skill_id: skill.skill_id,
        weight: skill.weight || 3,
      }))

      await supabase.from('job_skill_links').insert(skillLinks)
    }

    return NextResponse.json(jobPost)
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: '案件の作成に失敗しました' },
      { status: 500 }
    )
  }
}
