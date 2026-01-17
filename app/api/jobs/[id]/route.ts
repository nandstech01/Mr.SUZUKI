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
          id,
          company_name,
          website_url,
          industry,
          company_size,
          description
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
