import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  try {
    // Get match weights
    const { data: matchWeights, error: weightsError } = await supabase
      .from('match_weights')
      .select('*')

    if (weightsError) throw weightsError

    // Default platform fee rate (in real app, this might be stored in a settings table)
    const defaultPlatformFeeRate = 15

    return NextResponse.json({
      defaultPlatformFeeRate,
      matchWeights: matchWeights || [],
    })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const supabase = createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  try {
    const { matchWeights } = await request.json()

    if (matchWeights && Array.isArray(matchWeights)) {
      type UpdateResult = { error: { message: string } | null }
      for (const mw of matchWeights) {
        const result = await supabase
          .from('match_weights')
          .update({ weight: mw.weight } as never)
          .eq('key', mw.key) as unknown as UpdateResult

        if (result.error) throw result.error
      }
    }

    return NextResponse.json({ message: '設定を更新しました' })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
