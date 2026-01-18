import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', params.id)
      .eq('profile_id', user.id)

    if (error) throw error

    return NextResponse.json({ message: '既読にしました' })
  } catch (error) {
    console.error('Notification read error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
