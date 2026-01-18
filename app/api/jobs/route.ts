import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sanitizeSearchQuery } from '@/lib/utils/sanitize'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const engagement = searchParams.get('engagement')
    const remote = searchParams.get('remote')
    const budgetMin = searchParams.get('budget_min')
    const budgetMax = searchParams.get('budget_max')
    const skillIds = searchParams.get('skills')?.split(',').filter(Boolean)
    const query = sanitizeSearchQuery(searchParams.get('q'))
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let dbQuery = supabase
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
      `, { count: 'exact' })
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (engagement) {
      dbQuery = dbQuery.eq('engagement', engagement)
    }

    if (remote === 'true') {
      dbQuery = dbQuery.eq('remote_ok', true)
    }

    if (budgetMin) {
      dbQuery = dbQuery.gte('budget_max_monthly_yen', parseInt(budgetMin))
    }

    if (budgetMax) {
      dbQuery = dbQuery.lte('budget_min_monthly_yen', parseInt(budgetMax))
    }

    if (query) {
      dbQuery = dbQuery.or(`title.ilike.*${query}*,description.ilike.*${query}*`)
    }

    type JobWithSkillLinks = {
      job_skill_links?: { skill_id: string }[]
      [key: string]: unknown
    }
    const { data, error, count } = await dbQuery as { data: JobWithSkillLinks[] | null; error: Error | null; count: number | null }

    if (error) throw error

    // Filter by skills if provided
    let filteredData = data
    if (skillIds && skillIds.length > 0) {
      filteredData = data?.filter((job) =>
        job.job_skill_links?.some((link) =>
          skillIds.includes(link.skill_id)
        )
      ) || []
    }

    return NextResponse.json({
      data: filteredData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: '案件一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}
