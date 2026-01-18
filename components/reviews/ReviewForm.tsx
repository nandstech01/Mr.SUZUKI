'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  contractId: string
  onSuccess?: () => void
}

export function ReviewForm({ contractId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('評価を選択してください')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '評価の投稿に失敗しました')
      }

      setRating(0)
      setComment('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <Label className="mb-2 block">評価</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  value <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {rating === 0 && '星をクリックして評価'}
          {rating === 1 && '非常に不満'}
          {rating === 2 && 'やや不満'}
          {rating === 3 && '普通'}
          {rating === 4 && '満足'}
          {rating === 5 && '非常に満足'}
        </p>
      </div>

      <div>
        <Label htmlFor="comment">コメント（任意）</Label>
        <Textarea
          id="comment"
          placeholder="一緒に働いた感想を書いてください..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={submitting || rating === 0}>
        {submitting ? '送信中...' : '評価を送信'}
      </Button>
    </form>
  )
}
