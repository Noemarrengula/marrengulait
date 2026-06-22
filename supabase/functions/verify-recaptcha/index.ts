import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY') || ''

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { token, action } = await req.json()

    if (!token) {
      return new Response(JSON.stringify({ valid: false, error: 'Token ausente' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const params = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token,
    })

    const googleRes = await fetch(verifyUrl, {
      method: 'POST',
      body: params,
    })

    const data = await googleRes.json()

    if (!data.success) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'reCAPTCHA inválido',
        'error-codes': data['error-codes'] || [],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (data.score < 0.5) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'Score baixo (possível bot)',
        score: data.score,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (action && data.action !== action) {
      return new Response(JSON.stringify({
        valid: false,
        error: `Ação inválida: esperado "${action}", recebido "${data.action}"`,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      valid: true,
      score: data.score,
      action: data.action,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ valid: false, error: err instanceof Error ? err.message : 'Erro interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
