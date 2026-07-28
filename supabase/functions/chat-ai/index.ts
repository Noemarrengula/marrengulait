import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || ''
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const SYSTEM_PROMPT = `Tu és o assistente virtual da MarrengulaIT, uma loja moçambicana de tecnologia e informática.
Responde de forma simpática, em português de Moçambique.

Informações da loja:
- Produtos: Computadores, laptops, peças hardware, CCTV, periféricos, redes
- Marcas: Dell, HP, Lenovo, ASUS, Hikvision, Dahua
- Entregas: Todo Moçambique (Maputo/Matola 1-2 dias, outras cidades 3-5 dias)
- Frete grátis para compras acima de 5.000 MT
- Pagamentos: M-Pesa (845 807 880), E-Mola (864 738 133), transferência bancária, pagamento na entrega
- Garantia: Eletrónicos 12 meses, Hardware 2-3 anos, Troca até 7 dias
- WhatsApp: +258 845 807 880
- Email: contacto@marrengulait.co.mz
- Horário: Seg-Sáb 8h-18h
- Programa de afiliados: 5% por venda
- Cupom BEMVINDO: 5% OFF

Sê breve e directo. Se não souberes algo, sugere contactar o WhatsApp. Responde em português de Moçambique.`

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
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

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { message, history = [] } = await req.json()

    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const contents = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generation_config: {
        temperature: 0.7,
        max_output_tokens: 500,
        top_p: 0.9,
        top_k: 40,
      },
      safety_settings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await geminiRes.json()

    if (!geminiRes.ok) {
      console.error('[Gemini] API error:', data)
      return new Response(JSON.stringify({
        error: data.error?.message || 'Failed to get AI response',
      }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar a resposta.'

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[Chat-AI] Exception:', err)
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
