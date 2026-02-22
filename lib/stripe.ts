import Stripe from "stripe"

let _stripe: Stripe

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!_stripe) {
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        typescript: true,
      })
    }
    return Reflect.get(_stripe, prop)
  },
})
