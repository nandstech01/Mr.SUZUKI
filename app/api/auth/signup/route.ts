import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, displayName, role } = await request.json()

    if (!email || !password || !displayName || !role) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    if (!['engineer', 'company'].includes(role)) {
      return NextResponse.json(
        { error: '無効なロールです' },
        { status: 400 }
      )
    }

    // Use admin client to create user
    // In production, set AUTO_CONFIRM_EMAIL=false to require email verification
    const supabase = createAdminClient()
    const autoConfirmEmail = process.env.AUTO_CONFIRM_EMAIL === 'true'

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: autoConfirmEmail,
      user_metadata: {
        display_name: displayName,
        role,
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Profile is automatically created by database trigger
    return NextResponse.json({
      message: '登録が完了しました。ログインしてください。',
      user: authData.user,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
