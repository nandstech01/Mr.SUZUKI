import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')

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
    let query = supabase
      .from('skills')
      .select('*')
      .order('name', { ascending: true })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data: skills, error } = await query

    if (error) throw error

    return NextResponse.json({ skills: skills || [] })
  } catch (error) {
    console.error('Skills fetch error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}

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
    const { name, category } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'スキル名が必要です' }, { status: 400 })
    }

    type InsertResult = { data: unknown; error: { code?: string; message: string } | null }
    const result = await supabase
      .from('skills')
      .insert({ name, category } as never)
      .select()
      .single() as unknown as InsertResult

    if (result.error) {
      if (result.error.code === '23505') {
        return NextResponse.json({ error: 'このスキルは既に存在します' }, { status: 400 })
      }
      throw result.error
    }

    return NextResponse.json({ skill: result.data })
  } catch (error) {
    console.error('Skill create error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const skillId = searchParams.get('skillId')

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

  if (!skillId) {
    return NextResponse.json({ error: 'skillIdが必要です' }, { status: 400 })
  }

  try {
    type DeleteResult = { error: { message: string } | null }
    const result = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId) as unknown as DeleteResult

    if (result.error) throw result.error

    return NextResponse.json({ message: 'スキルを削除しました' })
  } catch (error) {
    console.error('Skill delete error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
