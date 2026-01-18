'use client'

import { Star } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer_name: string
  company_name?: string
}

interface ReviewListProps {
  reviews: Review[]
  avgRating: number | null
  totalCount: number
}

export function ReviewList({ reviews, avgRating, totalCount }: ReviewListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold">
            {avgRating ? avgRating.toFixed(1) : '-'}
          </div>
          <div className="flex gap-0.5 justify-center mt-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`w-4 h-4 ${
                  avgRating && value <= Math.round(avgRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {totalCount}件の評価
          </div>
        </div>

        {/* Rating distribution could go here */}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            まだ評価がありません
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`w-4 h-4 ${
                          value <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.reviewer_name}</span>
                  {review.company_name && (
                    <span className="text-sm text-muted-foreground">
                      @ {review.company_name}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(review.created_at)}
                </span>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
