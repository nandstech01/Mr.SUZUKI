import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  try {
    // Get engineer's owner_id
    const { data: engineerProfile, error: profileError } = await supabase
      .from('engineer_profiles')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (profileError || !engineerProfile) {
      return NextResponse.json({ error: 'エンジニアが見つかりません' }, { status: 404 })
    }

    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewer:reviewer_profile_id(
          display_name,
          role
        ),
        contracts!inner(
          company_profiles!inner(company_name)
        )
      `)
      .eq('reviewee_profile_id', engineerProfile.owner_id)
      .order('created_at', { ascending: false })

    if (reviewsError) throw reviewsError

    // Calculate average rating
    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

    const formattedReviews = reviews?.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      reviewer_name: (review.reviewer as { display_name: string })?.display_name || '匿名',
      company_name: ((review.contracts as { company_profiles: { company_name: string } }).company_profiles as { company_name: string }).company_name,
    })) || []

    return NextResponse.json({
      reviews: formattedReviews,
      avgRating,
      totalCount: reviews?.length || 0,
    })
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
