import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const { data: companyProfile } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('owner_id', user.id)
      .single<{ id: string }>()

    if (!companyProfile) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('job_posts')
      .update({ status: 'open' } as never)
      .eq('id', params.id)
      .eq('company_profile_id', companyProfile.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Publish job error:', error)
    return NextResponse.json(
      { error: '案件の公開に失敗しました' },
      { status: 500 }
    )
  }
}
