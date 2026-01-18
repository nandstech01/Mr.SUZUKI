import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase.from('skills').select('*').order('name')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get skills error:', error)
    return NextResponse.json(
      { error: 'スキル一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, category } = body

    if (!name) {
      return NextResponse.json(
        { error: 'スキル名は必須です' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('skills')
      .insert({ name, category } as never)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'このスキルは既に存在します' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create skill error:', error)
    return NextResponse.json(
      { error: 'スキルの作成に失敗しました' },
      { status: 500 }
    )
  }
}
