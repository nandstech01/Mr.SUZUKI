import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  try {
    const { contractId, rating, comment } = await request.json()

    if (!contractId || !rating) {
      return NextResponse.json({ error: 'パラメータが不足しています' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: '評価は1〜5の範囲で指定してください' }, { status: 400 })
    }

    // Get contract details
    type ContractWithProfiles = {
      id: string
      status: string
      company_profile_id: string
      engineer_profile_id: string
      company_profiles: { owner_id: string }
      engineer_profiles: { owner_id: string }
    }
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select(`
        id,
        status,
        company_profile_id,
        engineer_profile_id,
        company_profiles!inner(owner_id),
        engineer_profiles!inner(owner_id)
      `)
      .eq('id', contractId)
      .single<ContractWithProfiles>()

    if (contractError || !contract) {
      return NextResponse.json({ error: '契約が見つかりません' }, { status: 404 })
    }

    // Check if contract is completed
    if (contract.status !== 'completed') {
      return NextResponse.json({ error: '完了した契約のみ評価できます' }, { status: 400 })
    }

    // Determine reviewer and reviewee
    const companyOwnerId = contract.company_profiles.owner_id
    const engineerOwnerId = contract.engineer_profiles.owner_id

    let revieweeProfileId: string

    if (user.id === companyOwnerId) {
      // Company reviewing engineer
      revieweeProfileId = engineerOwnerId
    } else if (user.id === engineerOwnerId) {
      // Engineer reviewing company
      revieweeProfileId = companyOwnerId
    } else {
      return NextResponse.json({ error: 'この契約を評価する権限がありません' }, { status: 403 })
    }

    // Check if already reviewed
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('contract_id', contractId)
      .eq('reviewer_profile_id', user.id)
      .maybeSingle()

    if (existingReview) {
      return NextResponse.json({ error: 'この契約は既に評価済みです' }, { status: 400 })
    }

    // Create review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        contract_id: contractId,
        reviewer_profile_id: user.id,
        reviewee_profile_id: revieweeProfileId,
        rating,
        comment,
      } as never)
      .select()
      .single()

    if (reviewError) throw reviewError

    return NextResponse.json({
      message: '評価を投稿しました',
      review,
    })
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
