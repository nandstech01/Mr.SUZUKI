import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
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

    const body = await request.json()
    const { status } = body

    const validStatuses = [
      'applied',
      'screening',
      'interview',
      'offer',
      'accepted',
      'rejected',
      'withdrawn',
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '無効なステータスです' },
        { status: 400 }
      )
    }

    // Get the application with related data
    type ApplicationResult = {
      data: {
        job_posts?: { company_profile_id: string; company_profiles?: { owner_id: string } }
        engineer_profiles?: { owner_id: string }
      } | null
    }
    const result = await supabase
      .from('applications')
      .select(`
        *,
        job_posts (
          company_profile_id,
          company_profiles (
            owner_id
          )
        ),
        engineer_profiles (
          owner_id
        )
      `)
      .eq('id', params.id)
      .single() as unknown as ApplicationResult

    if (!result.data) {
      return NextResponse.json(
        { error: '応募が見つかりません' },
        { status: 404 }
      )
    }
    const application = result.data

    // Check permissions
    const isCompany = application.job_posts?.company_profiles?.owner_id === user.id
    const isEngineer = application.engineer_profiles?.owner_id === user.id

    // Engineers can only withdraw
    if (isEngineer && status !== 'withdrawn') {
      return NextResponse.json(
        { error: 'エンジニアは応募の取り下げのみ可能です' },
        { status: 403 }
      )
    }

    // Companies can update to any status except withdrawn
    if (isCompany && status === 'withdrawn') {
      return NextResponse.json(
        { error: '企業は応募を取り下げできません' },
        { status: 403 }
      )
    }

    if (!isCompany && !isEngineer) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    type UpdateResult = { data: unknown; error: { message: string } | null }
    const updateResult = await supabase
      .from('applications')
      .update({ status } as never)
      .eq('id', params.id)
      .select()
      .single() as unknown as UpdateResult

    if (updateResult.error) throw updateResult.error

    return NextResponse.json(updateResult.data)
  } catch (error) {
    console.error('Update application error:', error)
    return NextResponse.json(
      { error: '応募の更新に失敗しました' },
      { status: 500 }
    )
  }
}
