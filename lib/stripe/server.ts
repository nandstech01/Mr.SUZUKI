import Stripe from 'stripe'

// Stripe instance will be null during build if STRIPE_SECRET_KEY is not set
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : (null as unknown as Stripe)
