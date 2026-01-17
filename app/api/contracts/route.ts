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
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      )
    }

    let contracts

    if (profile.role === 'engineer') {
      const { data: engineerProfile } = await supabase
        .from('engineer_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!engineerProfile) {
        return NextResponse.json([])
      }

      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          company_profiles (
            company_name
          ),
          applications (
            job_posts (
              title
            )
          )
        `)
        .eq('engineer_profile_id', engineerProfile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      contracts = data
    } else if (profile.role === 'company') {
      const { data: companyProfile } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!companyProfile) {
        return NextResponse.json([])
      }

      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          engineer_profiles (
            headline,
            profiles:owner_id (
              display_name,
              avatar_url
            )
          ),
          applications (
            job_posts (
              title
            )
          )
        `)
        .eq('company_profile_id', companyProfile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      contracts = data
    }

    return NextResponse.json(contracts || [])
  } catch (error) {
    console.error('Get contracts error:', error)
    return NextResponse.json(
      { error: '契約一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

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
      application_id,
      start_date,
      end_date,
      monthly_fee_yen,
    } = body

    if (!application_id) {
      return NextResponse.json(
        { error: '応募IDは必須です' },
        { status: 400 }
      )
    }

    // Get application and verify ownership
    const { data: application } = await supabase
      .from('applications')
      .select(`
        *,
        job_posts (
          company_profile_id,
          company_profiles (
            id,
            owner_id
          )
        ),
        engineer_profiles (
          id
        )
      `)
      .eq('id', application_id)
      .single()

    if (!application) {
      return NextResponse.json(
        { error: '応募が見つかりません' },
        { status: 404 }
      )
    }

    if (application.job_posts?.company_profiles?.owner_id !== user.id) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    if (application.status !== 'accepted') {
      return NextResponse.json(
        { error: '応募が承認されていません' },
        { status: 400 }
      )
    }

    // Check if contract already exists
    const { data: existingContract } = await supabase
      .from('contracts')
      .select('id')
      .eq('application_id', application_id)
      .single()

    if (existingContract) {
      return NextResponse.json(
        { error: 'この応募に対する契約は既に存在します' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('contracts')
      .insert({
        application_id,
        company_profile_id: application.job_posts?.company_profiles?.id,
        engineer_profile_id: application.engineer_profiles?.id,
        start_date,
        end_date,
        monthly_fee_yen,
        status: 'initiated',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create contract error:', error)
    return NextResponse.json(
      { error: '契約の作成に失敗しました' },
      { status: 500 }
    )
  }
}
