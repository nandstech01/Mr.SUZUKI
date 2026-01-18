import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>()

    if (!profile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      )
    }

    let invoices

    if (profile.role === 'engineer') {
      const { data: engineerProfile } = await supabase
        .from('engineer_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single<{ id: string }>()

      if (!engineerProfile) {
        return NextResponse.json([])
      }

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          contracts!inner (
            engineer_profile_id,
            monthly_fee_yen,
            company_profiles (
              company_name
            )
          )
        `)
        .eq('contracts.engineer_profile_id', engineerProfile.id)
        .order('billing_month', { ascending: false })

      if (error) throw error
      invoices = data
    } else if (profile.role === 'company') {
      const { data: companyProfile } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single<{ id: string }>()

      if (!companyProfile) {
        return NextResponse.json([])
      }

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          contracts!inner (
            company_profile_id,
            monthly_fee_yen,
            engineer_profiles (
              profiles:owner_id (
                display_name
              )
            )
          )
        `)
        .eq('contracts.company_profile_id', companyProfile.id)
        .order('billing_month', { ascending: false })

      if (error) throw error
      invoices = data
    }

    return NextResponse.json(invoices || [])
  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: '請求一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}
