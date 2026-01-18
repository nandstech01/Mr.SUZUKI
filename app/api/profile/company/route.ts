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
      company_name,
      website_url,
      industry,
      company_size,
      description,
    } = body

    if (!company_name) {
      return NextResponse.json(
        { error: '会社名は必須です' },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    let companyProfile
    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('company_profiles')
        .update({
          company_name,
          website_url,
          industry,
          company_size,
          description,
        } as never)
        .eq('owner_id', user.id)
        .select()
        .single()

      if (error) throw error
      companyProfile = data
    } else {
      // Insert
      const { data, error } = await supabase
        .from('company_profiles')
        .insert({
          owner_id: user.id,
          company_name,
          website_url,
          industry,
          company_size,
          description,
        } as never)
        .select()
        .single()

      if (error) throw error
      companyProfile = data
    }

    return NextResponse.json(companyProfile)
  } catch (error) {
    console.error('Company profile error:', error)
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
      .from('company_profiles')
      .select('*')
      .eq('owner_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get company profile error:', error)
    return NextResponse.json(
      { error: 'プロフィールの取得に失敗しました' },
      { status: 500 }
    )
  }
}
