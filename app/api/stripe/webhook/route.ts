import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const clientSlug = session.metadata?.clientSlug
        if (clientSlug) {
          await prisma.client.update({
            where: { slug: clientSlug },
            data: {
              paymentStatus: "paid",
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
            },
          })
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined
        if (subscriptionId) {
          await prisma.client.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { paymentStatus: "paid" },
          })
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined
        if (subscriptionId) {
          await prisma.client.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { paymentStatus: "overdue" },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.client.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { paymentStatus: "cancelled" },
        })
        break
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
