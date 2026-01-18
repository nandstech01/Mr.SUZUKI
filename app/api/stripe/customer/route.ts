import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('profile_id', user.id)
      .single<{ stripe_customer_id: string }>()

    if (existingCustomer) {
      return NextResponse.json({
        stripe_customer_id: existingCustomer.stripe_customer_id,
      })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, email')
      .eq('id', user.id)
      .single<{ display_name: string | null; email: string | null }>()

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: profile?.email || user.email || undefined,
      name: profile?.display_name || undefined,
      metadata: {
        supabase_user_id: user.id,
      },
    })

    // Save to database
    const { error } = await supabase
      .from('stripe_customers')
      .insert({
        profile_id: user.id,
        stripe_customer_id: customer.id,
      } as never)

    if (error) throw error

    return NextResponse.json({
      stripe_customer_id: customer.id,
    })
  } catch (error) {
    console.error('Create Stripe customer error:', error)
    return NextResponse.json(
      { error: 'Stripe顧客の作成に失敗しました' },
      { status: 500 }
    )
  }
}
