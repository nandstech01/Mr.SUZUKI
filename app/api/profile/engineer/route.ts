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

    const body = await request.json()
    const {
      headline,
      bio,
      years_of_experience,
      location,
      remote_ok,
      availability_hours_per_week,
      desired_engagement,
      desired_min_monthly_yen,
      github_url,
      linkedin_url,
      portfolio_url,
      skills,
    } = body

    // Check if profile already exists
    const { data: existing } = await supabase
      .from('engineer_profiles')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    let engineerProfile: { id: string } | null = null
    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('engineer_profiles')
        .update({
          headline,
          bio,
          years_of_experience,
          location,
          remote_ok,
          availability_hours_per_week,
          desired_engagement,
          desired_min_monthly_yen,
          github_url,
          linkedin_url,
          portfolio_url,
        } as never)
        .eq('owner_id', user.id)
        .select()
        .single<{ id: string }>()

      if (error) throw error
      engineerProfile = data
    } else {
      // Insert
      const { data, error } = await supabase
        .from('engineer_profiles')
        .insert({
          owner_id: user.id,
          headline,
          bio,
          years_of_experience,
          location,
          remote_ok,
          availability_hours_per_week,
          desired_engagement,
          desired_min_monthly_yen,
          github_url,
          linkedin_url,
          portfolio_url,
        } as never)
        .select()
        .single<{ id: string }>()

      if (error) throw error
      engineerProfile = data
    }

    // Update skills if provided
    if (skills && Array.isArray(skills) && engineerProfile) {
      // Delete existing skill links
      await supabase
        .from('engineer_skill_links')
        .delete()
        .eq('engineer_profile_id', engineerProfile.id)

      // Insert new skill links
      if (skills.length > 0) {
        const skillLinks = skills.map((skill: { skill_id: string; level: number; years?: number }) => ({
          engineer_profile_id: engineerProfile!.id,
          skill_id: skill.skill_id,
          level: skill.level,
          years: skill.years,
        }))

        await supabase.from('engineer_skill_links').insert(skillLinks as never)
      }
    }

    return NextResponse.json(engineerProfile)
  } catch (error) {
    console.error('Engineer profile error:', error)
    return NextResponse.json(
      { error: 'プロフィールの保存に失敗しました' },
      { status: 500 }
    )
  }
}

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

    const { data, error } = await supabase
      .from('engineer_profiles')
      .select(`
        *,
        engineer_skill_links (
          skill_id,
          level,
          years,
          skills (
            id,
            name,
            category
          )
        )
      `)
      .eq('owner_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get engineer profile error:', error)
    return NextResponse.json(
      { error: 'プロフィールの取得に失敗しました' },
      { status: 500 }
    )
  }
}
