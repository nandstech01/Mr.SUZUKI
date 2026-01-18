import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const stripe = getStripe()
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { contract_id, amount_yen, billing_month } = body

    if (!contract_id || !amount_yen) {
      return NextResponse.json(
        { error: '契約IDと金額は必須です' },
        { status: 400 }
      )
    }

    // Verify contract ownership
    const { data: contract } = await supabase
      .from('contracts')
      .select(`
        *,
        company_profiles (
          owner_id,
          company_name
        ),
        engineer_profiles (
          profiles:owner_id (
            display_name
          )
        )
      `)
      .eq('id', contract_id)
      .single()

    if (!contract || contract.company_profiles?.owner_id !== user.id) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    // Get or create Stripe customer
    let { data: stripeCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('profile_id', user.id)
      .single()

    if (!stripeCustomer) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('id', user.id)
        .single()

      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.display_name,
        metadata: {
          supabase_user_id: user.id,
        },
      })

      await supabase
        .from('stripe_customers')
        .insert({
          profile_id: user.id,
          stripe_customer_id: customer.id,
        })

      stripeCustomer = { stripe_customer_id: customer.id }
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripe_customer_id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `AIMatch Pro - 契約支払い`,
              description: `${contract.engineer_profiles?.profiles?.display_name || 'エンジニア'}との契約 - ${billing_month || '当月分'}`,
            },
            unit_amount: amount_yen,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/company/contracts?success=true&contract_id=${contract_id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/company/contracts?canceled=true`,
      metadata: {
        contract_id,
        billing_month: billing_month || new Date().toISOString().slice(0, 7),
      },
    })

    // Create invoice record
    await supabase
      .from('invoices')
      .insert({
        contract_id,
        amount_yen,
        billing_month,
        status: 'pending',
      })

    return NextResponse.json({
      checkout_url: session.url,
    })
  } catch (error) {
    console.error('Create checkout session error:', error)
    return NextResponse.json(
      { error: '支払いセッションの作成に失敗しました' },
      { status: 500 }
    )
  }
}
