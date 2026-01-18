import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
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
    // Get user counts
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: totalEngineers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'engineer')

    const { count: totalCompanies } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'company')

    // Get job counts
    const { count: totalJobs } = await supabase
      .from('job_posts')
      .select('*', { count: 'exact', head: true })

    const { count: openJobs } = await supabase
      .from('job_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open')

    // Get contract counts
    const { count: totalContracts } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })

    const { count: activeContracts } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get total revenue from paid invoices
    type InvoiceResult = { data: { amount_yen: number }[] | null }
    const invoiceResult = await supabase
      .from('invoices')
      .select('amount_yen')
      .eq('status', 'paid') as unknown as InvoiceResult

    const totalRevenue = invoiceResult.data?.reduce((sum, inv) => sum + inv.amount_yen, 0) || 0

    // Get recent users
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('id, display_name, role, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    // Get jobs by status
    type JobStatusResult = { data: { status: string }[] | null }
    const jobsResult = await supabase
      .from('job_posts')
      .select('status') as unknown as JobStatusResult

    const statusCounts: Record<string, number> = {}
    jobsResult.data?.forEach(job => {
      statusCounts[job.status] = (statusCounts[job.status] || 0) + 1
    })

    const jobsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status: status === 'draft' ? '下書き' : status === 'open' ? '公開中' : status === 'paused' ? '一時停止' : '終了',
      count,
    }))

    // Mock monthly revenue data (in real app, aggregate from invoices by month)
    const monthlyRevenue = [
      { month: '7月', revenue: 0 },
      { month: '8月', revenue: 0 },
      { month: '9月', revenue: 0 },
      { month: '10月', revenue: 0 },
      { month: '11月', revenue: 0 },
      { month: '12月', revenue: totalRevenue },
    ]

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalEngineers: totalEngineers || 0,
      totalCompanies: totalCompanies || 0,
      totalJobs: totalJobs || 0,
      openJobs: openJobs || 0,
      totalContracts: totalContracts || 0,
      activeContracts: activeContracts || 0,
      totalRevenue,
      monthlyRevenue,
      recentUsers: recentUsers || [],
      jobsByStatus,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
