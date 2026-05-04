import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { message, history, tripContext } = await req.json()

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 })
  }

  // Add your Anthropic API key here — set ANTHROPIC_API_KEY in your environment
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const systemPrompt = `You are a friendly, expert packing assistant for PackPerfect, a travel packing list app. Help users pack smart for their trips.

${tripContext ? `The user's current trip:\n${tripContext}\n` : ''}
Your rules:
- Only answer questions about packing, luggage, travel gear, TSA/customs rules, clothing for different weather or trip types, and general trip preparation
- If asked anything off-topic (politics, coding, recipes, etc.), warmly decline and redirect: "I'm only here to help you pack! Ask me about luggage, clothing, TSA rules..."
- Be specific and practical — give real advice, not vague tips
- Keep answers concise (2-4 sentences usually) unless a detailed list is genuinely helpful
- Reference the user's trip details when relevant`

  const messages = [
    ...(Array.isArray(history) ? history.slice(-10) : []),
    { role: 'user', content: message },
  ]

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
            controller.enqueue(enc.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
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
