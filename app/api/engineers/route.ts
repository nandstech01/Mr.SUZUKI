import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type EngineerListItem = {
  id: string
  owner_id: string
  headline: string | null
  bio: string | null
  years_of_experience: number | null
  location: string | null
  remote_ok: boolean
  availability_hours_per_week: number | null
  desired_engagement: string | null
  desired_min_monthly_yen: number | null
  profiles: { display_name: string }
  engineer_skill_links: { level: number; skills: { name: string } }[]
}

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)

  const skills = searchParams.get('skills')?.split(',').filter(Boolean) || []
  const minYears = searchParams.get('minYears')
  const maxBudget = searchParams.get('maxBudget')
  const minHours = searchParams.get('minHours')
  const engagement = searchParams.get('engagement')
  const remoteOnly = searchParams.get('remoteOnly') === 'true'

  try {
    let query = supabase
      .from('engineer_profiles')
      .select(`
        id,
        owner_id,
        headline,
        bio,
        years_of_experience,
        location,
        remote_ok,
        availability_hours_per_week,
        desired_engagement,
        desired_min_monthly_yen,
        profiles!inner(display_name),
        engineer_skill_links(
          level,
          skills(name)
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (minYears) {
      query = query.gte('years_of_experience', parseInt(minYears))
    }

    if (maxBudget) {
      query = query.lte('desired_min_monthly_yen', parseInt(maxBudget) * 10000)
    }

    if (minHours) {
      query = query.gte('availability_hours_per_week', parseInt(minHours))
    }

    if (engagement && engagement !== 'all') {
      query = query.eq('desired_engagement', engagement)
    }

    if (remoteOnly) {
      query = query.eq('remote_ok', true)
    }

    const { data: engineers, error } = await query.limit(50) as { data: EngineerListItem[] | null; error: Error | null }

    if (error) throw error

    // Format and filter by skills
    let formattedEngineers = engineers?.map((eng) => {
      const skillLinks = eng.engineer_skill_links
      const engineerSkills = skillLinks?.map((link) => ({
        name: link.skills?.name || '',
        level: link.level,
      })).filter(s => s.name) || []

      return {
        id: eng.id,
        owner_id: eng.owner_id,
        headline: eng.headline,
        bio: eng.bio,
        years_of_experience: eng.years_of_experience,
        location: eng.location,
        remote_ok: eng.remote_ok,
        availability_hours_per_week: eng.availability_hours_per_week,
        desired_engagement: eng.desired_engagement,
        desired_min_monthly_yen: eng.desired_min_monthly_yen,
        display_name: (eng.profiles as { display_name: string }).display_name,
        skills: engineerSkills,
        avg_rating: null, // TODO: Calculate from reviews
      }
    }) || []

    // Filter by skills if specified
    if (skills.length > 0) {
      formattedEngineers = formattedEngineers.filter((eng) =>
        skills.some((skill) =>
          eng.skills.some((s) => s.name.toLowerCase().includes(skill.toLowerCase()))
        )
      )
    }

    return NextResponse.json({ engineers: formattedEngineers })
  } catch (error) {
    console.error('Engineers fetch error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
