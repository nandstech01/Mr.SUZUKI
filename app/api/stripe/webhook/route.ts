import { getStripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const stripe = getStripe()
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const contractId = session.metadata?.contract_id
        const billingMonth = session.metadata?.billing_month

        if (contractId) {
          // Update invoice status
          await supabase
            .from('invoices')
            .update({
              status: 'paid',
              stripe_invoice_id: session.payment_intent as string,
            })
            .eq('contract_id', contractId)
            .eq('billing_month', billingMonth)

          // Update contract status if first payment
          const { data: contract } = await supabase
            .from('contracts')
            .select('status')
            .eq('id', contractId)
            .single()

          if (contract?.status === 'initiated') {
            await supabase
              .from('contracts')
              .update({ status: 'active' })
              .eq('id', contractId)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const contractId = paymentIntent.metadata?.contract_id

        if (contractId) {
          await supabase
            .from('invoices')
            .update({ status: 'failed' })
            .eq('contract_id', contractId)
            .eq('status', 'pending')
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeInvoiceId = invoice.id

        await supabase
          .from('invoices')
          .update({ status: 'paid' })
          .eq('stripe_invoice_id', stripeInvoiceId)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeInvoiceId = invoice.id

        await supabase
          .from('invoices')
          .update({ status: 'failed' })
          .eq('stripe_invoice_id', stripeInvoiceId)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
