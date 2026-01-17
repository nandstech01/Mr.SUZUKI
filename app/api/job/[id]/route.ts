import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('job_posts')
      .select(`
        *,
        company_profiles (
          company_name,
          website_url,
          industry
        ),
        job_skill_links (
          skill_id,
          weight,
          skills (
            id,
            name,
            category
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '案件が見つかりません' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get job error:', error)
    return NextResponse.json(
      { error: '案件の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

    // Verify ownership
    const { data: companyProfile } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!companyProfile) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
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

    const { data: jobPost, error } = await supabase
      .from('job_posts')
      .update({
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
      })
      .eq('id', params.id)
      .eq('company_profile_id', companyProfile.id)
      .select()
      .single()

    if (error) throw error

    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      await supabase
        .from('job_skill_links')
        .delete()
        .eq('job_post_id', params.id)

      if (skills.length > 0) {
        const skillLinks = skills.map((skill: { skill_id: string; weight: number }) => ({
          job_post_id: params.id,
          skill_id: skill.skill_id,
          weight: skill.weight || 3,
        }))

        await supabase.from('job_skill_links').insert(skillLinks)
      }
    }

    return NextResponse.json(jobPost)
  } catch (error) {
    console.error('Update job error:', error)
    return NextResponse.json(
      { error: '案件の更新に失敗しました' },
      { status: 500 }
    )
  }
}
