import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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
    const { skills } = await request.json()

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: 'スキルデータが必要です' }, { status: 400 })
    }

    // Filter out duplicates and empty names
    const validSkills = skills
      .filter((s: { name: string }) => s.name && s.name.trim())
      .map((s: { name: string; category?: string }) => ({
        name: s.name.trim(),
        category: s.category || 'other',
      }))

    if (validSkills.length === 0) {
      return NextResponse.json({ error: '有効なスキルデータがありません' }, { status: 400 })
    }

    // Insert with upsert to handle duplicates
    type UpsertResult = { data: unknown; error: { message: string } | null }
    const result = await supabase
      .from('skills')
      .upsert(validSkills as never, { onConflict: 'name', ignoreDuplicates: true })
      .select() as unknown as UpsertResult

    if (result.error) throw result.error
    const insertedSkills = result.data

    return NextResponse.json({
      message: `${validSkills.length}件のスキルをインポートしました`,
      skills: insertedSkills,
    })
  } catch (error) {
    console.error('Bulk skill import error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
