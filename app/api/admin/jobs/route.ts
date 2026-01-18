import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface JobWithCompany {
  id: string
  title: string
  status: string
  engagement: string
  budget_min_monthly_yen: number
  budget_max_monthly_yen: number
  created_at: string
  company_profiles: { company_name: string }
}

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  try {
    let query = supabase
      .from('job_posts')
      .select(`
        id,
        title,
        status,
        engagement,
        budget_min_monthly_yen,
        budget_max_monthly_yen,
        created_at,
        company_profiles!inner(company_name)
      `)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: jobs, error } = await query.limit(100)

    if (error) throw error

    const formattedJobs = (jobs as JobWithCompany[] | null)?.map(job => ({
      id: job.id,
      title: job.title,
      company_name: job.company_profiles.company_name,
      status: job.status,
      engagement: job.engagement,
      budget_min_monthly_yen: job.budget_min_monthly_yen,
      budget_max_monthly_yen: job.budget_max_monthly_yen,
      created_at: job.created_at,
    })) || []

    return NextResponse.json({ jobs: formattedJobs })
  } catch (error) {
    console.error('Jobs fetch error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const supabase = createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  try {
    const { jobId, status } = await request.json()

    if (!jobId || !status) {
      return NextResponse.json({ error: 'パラメータが不足しています' }, { status: 400 })
    }

    type UpdateResult = { error: { message: string } | null }
    const result = await supabase
      .from('job_posts')
      // eslint-disable-next-line
      .update({ status } as never)
      .eq('id', jobId) as unknown as UpdateResult

    if (result.error) throw result.error

    return NextResponse.json({ message: 'ステータスを更新しました' })
  } catch (error) {
    console.error('Job update error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  if (!jobId) {
    return NextResponse.json({ error: 'jobIdが必要です' }, { status: 400 })
  }

  try {
    type DeleteResult = { error: { message: string } | null }
    const result = await supabase
      .from('job_posts')
      .delete()
      .eq('id', jobId) as unknown as DeleteResult

    if (result.error) throw result.error

    return NextResponse.json({ message: '案件を削除しました' })
  } catch (error) {
    console.error('Job delete error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
