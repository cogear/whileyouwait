import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { clientSlug } = await req.json()

    const client = await prisma.client.findUnique({
      where: { slug: clientSlug },
    })
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    if (client.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Client has already paid" },
        { status: 400 }
      )
    }

    // Create or retrieve Stripe customer
    let customerId = client.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: client.clientEmail || undefined,
        name: client.clientName || client.businessName,
        metadata: { clientSlug: client.slug },
      })
      customerId = customer.id
      await prisma.client.update({
        where: { slug: clientSlug },
        data: { stripeCustomerId: customerId },
      })
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_SETUP_PRICE_ID!,
          quantity: 1,
        },
        {
          price: process.env.STRIPE_ANNUAL_PRICE_ID!,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 365,
        metadata: { clientSlug: client.slug },
      },
      metadata: { clientSlug: client.slug },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/${client.slug}?cancelled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
