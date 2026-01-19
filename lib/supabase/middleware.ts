import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 認証が必要なパスのリスト
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/jobs',
    '/applications',
    '/messages',
    '/contracts',
    '/billing',
    '/admin',
    '/onboarding',
  ]

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.includes(path)
  )

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ログイン済みユーザーが認証ページにアクセスした場合
  // ロールに応じて適切なダッシュボードにリダイレクト
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const url = request.nextUrl.clone()
    // user_metadataからロールを取得（サインアップ時に設定されている場合）
    const role = user.user_metadata?.role || 'engineer'
    if (role === 'admin') {
      url.pathname = '/admin/dashboard'
    } else if (role === 'company') {
      url.pathname = '/company/dashboard'
    } else {
      url.pathname = '/engineer/dashboard'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
