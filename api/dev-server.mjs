import http from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import OpenAI from 'openai'

const __dir = dirname(fileURLToPath(import.meta.url))

// Load .env.local from repo root
const envPath = join(__dir, '../.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq !== -1) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
  }
}

const PREMIUM_KEY = 'Incubator'
const CHAT_LIMIT = 10

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', c => (data += c))
    req.on('end', () => { try { resolve(JSON.parse(data)) } catch (e) { reject(e) } })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.url === '/api/premium-chat' && req.method === 'POST') {
    let body
    try { body = await readBody(req) } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Invalid JSON' }))
    }

    const { message, history, tripContext, premiumKey, chatCount } = body

    if (premiumKey !== PREMIUM_KEY) {
      res.writeHead(403, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Premium access required' }))
    }
    if (typeof chatCount === 'number' && chatCount >= CHAT_LIMIT) {
      res.writeHead(429, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Chat limit reached (10/10).' }))
    }
    if (!message?.trim()) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'No message provided' }))
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const packingListSummary = tripContext || ''
    const systemPrompt = `You are a friendly, expert packing assistant for PackPerfect, a travel packing list app. You help users pack smart and make the most of their trip.

${packingListSummary ? `The user's current trip details and packing list:\n${packingListSummary}\n` : ''}Your rules:
- Only answer questions about packing, luggage, travel gear, TSA/customs rules, clothing for different weather or trip types, trip preparation, and general travel advice
- If asked anything clearly off-topic (politics, coding, recipes, math homework, etc.), warmly decline and redirect
- Be specific and practical — give real, actionable advice
- Reference the user's specific trip details and packing list when relevant
- Keep answers concise (2-4 sentences usually) unless a detailed breakdown is genuinely helpful
- Be warm and encouraging`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(history) ? history.slice(-10) : []),
      { role: 'user', content: message },
    ]

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    try {
      const stream = await client.chat.completions.create({ model: 'gpt-4o-mini', max_tokens: 1024, stream: true, messages })
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
      res.write('data: [DONE]\n\n')
    } catch (err) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    }
    res.end()
    return
  }

  res.writeHead(404)
  res.end()
})

const PORT = 3001
server.listen(PORT, () => console.log(`API dev server running on http://localhost:${PORT}`))
