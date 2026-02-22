# WhileUWaitWebsite.com — Build Spec for Claude Code

## Overview

Build the hub site for "While U Wait Website" — a service where I build custom websites for small businesses at flea markets and local events. This Next.js app serves as:

1. A marketing landing page to sell the service
2. A Stripe-powered checkout for collecting payments
3. A simple admin dashboard to manage client sites

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Payments:** Stripe (Checkout + Subscriptions)
- **Database:** Vercel Postgres (via @vercel/postgres) or Prisma with Postgres
- **Auth:** NextAuth.js (just for admin login — single admin user is fine)
- **Deployment:** Vercel

## Environment Variables Needed

```env
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SETUP_PRICE_ID=        # $100 one-time setup fee
STRIPE_ANNUAL_PRICE_ID=       # $50/year hosting subscription
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
```

---

## Page Structure

### 1. Landing Page (`/`)

A clean, bold, single-page marketing site. Tone: friendly, approachable, a little fun. Target audience: small business owners at flea markets, farmers markets, local events.

**Sections:**

- **Hero:** Big headline like "Your Website, Built While You Wait." Subtext explaining the concept — I come to you at the market, build a custom site on the spot, you walk away with a live website. CTA button: "Get Your Site Today — $100"
- **How It Works:** 3 steps — (1) I visit your booth or you visit mine, (2) I snap photos and get your details, (3) Your custom site goes live before you leave. Use icons or simple illustrations.
- **What You Get:** Custom designed single-page site, mobile responsive, your own subdomain (yourname.whileuwaitwebsite.com), option to connect your own domain, hosting included for one year, $50/year after that.
- **Examples:** A grid/gallery section. For now, use placeholder cards that say "Coming Soon" — I'll add screenshots of real client sites later. Structure it so I can easily add example site cards with a screenshot, business name, and link.
- **Pricing:** Simple pricing card. $100 one-time setup. Includes first year of hosting. $50/year renewal. Mention the future "Store" tier as "Coming Soon."
- **FAQ:** Collapsible accordion. Pre-populate with:
  - "How long does it take?" → "Most sites are done in 15-20 minutes."
  - "What do I need to provide?" → "Just your business name, contact info, a logo if you have one, and a few photos. I'll handle the rest."
  - "Can I update my site later?" → "Yes! Reach out anytime and I'll make updates for you."
  - "Can I use my own domain name?" → "Absolutely. I'll help you connect it."
  - "What if I want a full online store?" → "Store packages are coming soon. Leave your info and I'll reach out when they're ready."
- **Contact/Footer:** My email, a simple contact form (or just a mailto link for now), and social links placeholders.

### 2. Checkout Page (`/checkout/[clientSlug]`)

This is where I send a client to pay after building their site.

- Display: client business name, a preview link to their site, what they're paying for
- Stripe Checkout session: $100 one-time + $50/year subscription (first year included in the $100, so subscription starts billing 12 months from now)
- On success, redirect to a thank-you page showing their live site URL
- On cancel, redirect back with a message

### 3. Thank You Page (`/checkout/success`)

- "Your site is live!" message
- Link to their site
- Reminder about annual renewal
- My contact info for future updates

### 4. Admin Dashboard (`/admin`) — Protected Route

Simple dashboard for me to manage everything. Protected by NextAuth (single admin user).

**Features:**

- **Client List:** Table showing all clients with columns: business name, slug/subdomain, site URL, Stripe status (paid/overdue/none), date created, actions
- **Add New Client:** Form with fields:
  - Business name
  - Client name
  - Client email
  - Client phone
  - Slug (auto-generated from business name, editable)
  - Site URL (their vercel deployment URL or subdomain)
  - Custom domain (optional)
  - Notes (freeform text)
- **Edit Client:** Same form, pre-populated
- **Client Detail View:** Shows all client info plus:
  - Stripe payment history
  - Link to send/resend checkout link
  - Button to generate a checkout link I can text/email them
- **Quick Actions:**
  - Generate checkout link for a client (copies to clipboard)
  - Mark site as live/suspended
  - Send renewal reminder (future feature — just put a placeholder button)

---

## Database Schema

```sql
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  slug VARCHAR(255) UNIQUE NOT NULL,
  site_url VARCHAR(500),
  custom_domain VARCHAR(255),
  notes TEXT,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, paid, overdue, cancelled
  site_status VARCHAR(50) DEFAULT 'building', -- building, live, suspended
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Stripe Integration Details

### Products & Prices

Set up in Stripe (I'll create these manually in the Stripe dashboard, just need the price IDs in env vars):

- **Product:** "While U Wait Website"
  - **Price 1:** $100 one-time (setup fee)
  - **Price 2:** $50/year recurring (annual hosting)

### Checkout Flow

When I generate a checkout link for a client:

1. Create a Stripe Checkout Session via API route (`/api/stripe/checkout`)
2. Include both the $100 one-time price and the $50/year subscription
3. Set the subscription to start billing 12 months from now (trial_period_days: 365 or use `subscription_data.trial_end`)
4. Pass the client slug as metadata so the webhook can match it
5. Return the checkout URL

### Webhook (`/api/stripe/webhook`)

Listen for:
- `checkout.session.completed` — Update client payment_status to 'paid', store stripe_customer_id and stripe_subscription_id
- `invoice.payment_succeeded` — Update payment_status to 'paid'
- `invoice.payment_failed` — Update payment_status to 'overdue'
- `customer.subscription.deleted` — Update payment_status to 'cancelled'

---

## API Routes

```
POST /api/stripe/checkout       — Create checkout session for a client
POST /api/stripe/webhook        — Stripe webhook handler
GET  /api/clients               — List all clients (admin only)
POST /api/clients               — Create a client (admin only)
GET  /api/clients/[slug]        — Get client details (admin only)
PUT  /api/clients/[slug]        — Update client (admin only)
DELETE /api/clients/[slug]      — Delete client (admin only)
```

---

## Design Notes

- Keep it clean and modern. Not overly corporate — this is a flea market business, it should feel approachable and fun.
- Use a color palette that feels creative/energetic. Maybe a bold accent color (electric blue, coral, or bright green) against white/dark backgrounds.
- Mobile-first — many clients will view the checkout page on their phone.
- The admin dashboard doesn't need to be pretty, just functional and clean.

---

## What NOT to Build Yet

- Client self-service portal (future)
- Store/e-commerce tier (future)
- Automated domain provisioning (I'll do this manually in Vercel for now)
- Email notifications (future — I'll text clients manually at first)
- Analytics or reporting

---

## Getting Started

1. Set up the database schema
2. Build the landing page
3. Build the admin dashboard with client CRUD
4. Wire up Stripe checkout and webhooks
5. Build the checkout and thank-you pages
6. Test the full flow: create client → generate checkout link → pay → webhook updates status
