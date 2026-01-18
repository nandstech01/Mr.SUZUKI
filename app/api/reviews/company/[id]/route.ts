import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  try {
    // Get company's owner_id
    const { data: companyProfile, error: profileError } = await supabase
      .from('company_profiles')
      .select('owner_id')
      .eq('id', params.id)
      .single<{ owner_id: string }>()

    if (profileError || !companyProfile) {
      return NextResponse.json({ error: '企業が見つかりません' }, { status: 404 })
    }

    // Get reviews
    type ReviewResult = { id: string; rating: number; comment: string | null; created_at: string; reviewer: { display_name: string } | null }
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
        )
      `)
      .eq('reviewee_profile_id', companyProfile.owner_id)
      .order('created_at', { ascending: false }) as { data: ReviewResult[] | null; error: Error | null }

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
