import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') || ''

    if (!signature) {
      console.warn('[Stripe Webhook] No signature header')
    }

    let event
    try {
      event = JSON.parse(body)
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    console.log(`[Stripe Webhook] Received event: ${event.type} (id: ${event.id})`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Stripe Webhook] Supabase credentials not configured')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object
        console.log(`[Stripe Webhook] PaymentIntent ${pi.id} succeeded (${pi.amount} ${pi.currency})`)

        if (pi.metadata?.order_number) {
          const res = await fetch(
            `${supabaseUrl}/rest/v1/rpc/update_payment_status`,
            {
              method: 'POST',
              headers,
              body: JSON.stringify({
                p_order_number: pi.metadata.order_number,
                p_payment_status: 'paid',
              }),
            }
          )

          if (!res.ok) {
            const errText = await res.text()
            console.error(`[Stripe Webhook] Failed to update order: ${errText}`)
          } else {
            console.log(`[Stripe Webhook] Order ${pi.metadata.order_number} marked as paid`)
          }
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object
        console.log(`[Stripe Webhook] Checkout session ${session.id} completed`)

        if (session.metadata?.order_number) {
          const res = await fetch(
            `${supabaseUrl}/rest/v1/rpc/update_order_status`,
            {
              method: 'POST',
              headers,
              body: JSON.stringify({
                p_order_number: session.metadata.order_number,
                p_status: 'confirmed',
              }),
            }
          )

          if (!res.ok) {
            const errText = await res.text()
            console.error(`[Stripe Webhook] Failed to confirm order: ${errText}`)
          } else {
            console.log(`[Stripe Webhook] Order ${session.metadata.order_number} confirmed`)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const failed = event.data.object
        console.error(`[Stripe Webhook] Payment failed: ${failed.id} - ${failed.last_payment_error?.message}`)

        if (failed.metadata?.order_number) {
          await fetch(
            `${supabaseUrl}/rest/v1/rpc/update_payment_status`,
            {
              method: 'POST',
              headers,
              body: JSON.stringify({
                p_order_number: failed.metadata.order_number,
                p_payment_status: 'failed',
              }),
            }
          )
        }
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[Stripe Webhook] Error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
