import OpenAI from 'openai'

export const config = { runtime: 'edge' }

const PREMIUM_KEY = 'Incubator'
const CHAT_LIMIT = 10

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { message, history, tripContext, premiumKey, chatCount } = await req.json()

  // Server-side premium check
  if (premiumKey !== PREMIUM_KEY) {
    return new Response(JSON.stringify({ error: 'Premium access required' }), { status: 403 })
  }

  // Server-side usage limit check
  if (typeof chatCount === 'number' && chatCount >= CHAT_LIMIT) {
    return new Response(JSON.stringify({ error: 'Chat limit reached (10/10). Upgrade to continue.' }), { status: 429 })
  }

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 })
  }

  // API key read from OPENAI_API_KEY environment variable — never exposed to the frontend
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const packingListSummary = tripContext || ''

  const systemPrompt = `You are a friendly, expert packing assistant for PackPerfect, a travel packing list app. You help users pack smart and make the most of their trip.

${packingListSummary ? `The user's current trip details and packing list:\n${packingListSummary}\n` : ''}
Your rules:
- Only answer questions about packing, luggage, travel gear, TSA/customs rules, clothing for different weather or trip types, trip preparation, and general travel advice
- If asked anything clearly off-topic (politics, coding, recipes, math homework, etc.), warmly decline and redirect: "I'm only here to help you pack and travel! Ask me about luggage, clothing choices, TSA rules, what to wear on the plane..."
- Be specific and practical — give real, actionable advice
- Reference the user's specific trip details and packing list when relevant
- Keep answers concise (2-4 sentences usually) unless a detailed breakdown is genuinely helpful
- Be warm and encouraging`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(Array.isArray(history) ? history.slice(-10) : []),
    { role: 'user', content: message },
  ]

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    stream: true,
    messages,
  })

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ''
          if (text) {
            controller.enqueue(enc.encode(`data: ${JSON.stringify({ text })}\n\n`))
          }
        }
        controller.enqueue(enc.encode('data: [DONE]\n\n'))
      } catch (err) {
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
