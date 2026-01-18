import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  try {
    const { data: engineer, error } = await supabase
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
        github_url,
        linkedin_url,
        portfolio_url,
        profiles!inner(display_name),
        engineer_skill_links(
          level,
          years,
          skills(name)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'エンジニアが見つかりません' }, { status: 404 })
      }
      throw error
    }

    // Get review stats
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_profile_id', engineer.owner_id)

    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

    const skillLinks = engineer.engineer_skill_links as { level: number; years: number | null; skills: { name: string } }[]
    const skills = skillLinks?.map((link) => ({
      name: link.skills?.name || '',
      level: link.level,
      years: link.years,
    })).filter(s => s.name) || []

    const formattedEngineer = {
      id: engineer.id,
      owner_id: engineer.owner_id,
      headline: engineer.headline,
      bio: engineer.bio,
      years_of_experience: engineer.years_of_experience,
      location: engineer.location,
      remote_ok: engineer.remote_ok,
      availability_hours_per_week: engineer.availability_hours_per_week,
      desired_engagement: engineer.desired_engagement,
      desired_min_monthly_yen: engineer.desired_min_monthly_yen,
      github_url: engineer.github_url,
      linkedin_url: engineer.linkedin_url,
      portfolio_url: engineer.portfolio_url,
      display_name: (engineer.profiles as { display_name: string }).display_name,
      skills,
      avg_rating: avgRating,
      review_count: reviews?.length || 0,
    }

    return NextResponse.json({ engineer: formattedEngineer })
  } catch (error) {
    console.error('Engineer fetch error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
