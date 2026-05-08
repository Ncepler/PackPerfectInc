import http from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import OpenAI, { toFile } from 'openai'

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

  if (req.url === '/api/generate-layers' && req.method === 'POST') {
    let body
    try { body = await readBody(req) } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Invalid JSON' }))
    }

    const { imageBase64, imageMimeType, packingList, premiumKey, layerCount } = body

    if (premiumKey !== PREMIUM_KEY) {
      res.writeHead(403, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Premium access required' }))
    }
    if (typeof layerCount === 'number' && layerCount >= 2) {
      res.writeHead(429, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Layer generation limit reached (2/2).' }))
    }
    if (!imageBase64 || !packingList) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Missing imageBase64 or packingList' }))
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const packingText = Object.entries(packingList)
      .map(([category, items]) => {
        const itemList = items.map(i => `${i.name} (x${i.qty})`).join(', ')
        return `${category}: ${itemList}`
      })
      .join('\n')

    let layerBreakdown
    try {
      const visionResponse = await client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${imageMimeType};base64,${imageBase64}` } },
            { type: 'text', text: `You are an expert packing consultant. Look at this suitcase image to gauge its approximate size and shape.\n\nDivide ALL items from the packing list into exactly 3 progressive packing stages for a clamshell suitcase. The suitcase has two sides — a deep main compartment and a shallower lid compartment — and you pack 2 layers into the main side before filling the lid side:\n\n- Stage 1 (Main side — Layer 1): The heaviest and bulkiest items placed flat against the back panel of the main compartment, near the wheels. Think shoes, jeans, heavy jackets, boots. This is the foundation.\n- Stage 2 (Main side — Layer 2): Medium-weight items packed directly on top of Stage 1, filling the rest of the main compartment. Think shirts, pants, folded clothes, toiletries bag.\n- Stage 3 (Lid side): Light, delicate, or frequently-needed items that go in the lid/flip side. Think electronics, documents, underwear, socks, accessories, chargers.\n\nEvery item must appear in exactly one stage. Main side (Stages 1+2) should hold ~65% of items; lid side (Stage 3) ~35%.\n\nPacking list:\n${packingText}\n\nRespond ONLY with valid JSON in this exact shape — no markdown, no extra text:\n{\n  "suitcaseNote": "one sentence about the suitcase size/type you see",\n  "layers": [\n    {\n      "label": "Main Side — Layer 1",\n      "items": ["item name x qty", ...],\n      "packingTip": "one practical tip for packing this base layer"\n    },\n    {\n      "label": "Main Side — Layer 2",\n      "items": ["item name x qty", ...],\n      "packingTip": "one practical tip for packing on top of Layer 1"\n    },\n    {\n      "label": "Lid Side",\n      "items": ["item name x qty", ...],\n      "packingTip": "one practical tip for packing the lid side"\n    }\n  ]\n}` },
          ],
        }],
      })
      const raw = visionResponse.choices[0]?.message?.content || ''
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      layerBreakdown = JSON.parse(cleaned)
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: `Failed to analyze packing list: ${err.message}` }))
    }

    // Stream SSE — generate images sequentially, each editing the previous result
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    const sse = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)

    sse({
      type: 'breakdown',
      suitcaseNote: layerBreakdown.suitcaseNote,
      layers: layerBreakdown.layers.map(l => ({ label: l.label, items: l.items, packingTip: l.packingTip })),
    })

    const [s1, s2, s3] = layerBreakdown.layers
    const s1Items = s1.items.slice(0, 10).join(', ')
    const s2Items = s2.items.slice(0, 10).join(', ')
    const s3Items = s3.items.slice(0, 10).join(', ')

    const stagePrompts = [
      `Pack the bottom layer of this suitcase's main compartment with these items laid flat and neatly arranged: ${s1Items}. The lid side and the rest of the main compartment should remain empty. Keep the suitcase exterior identical.`,
      `Add a second layer directly on top of the existing packed items in the main compartment: ${s2Items}, neatly folded and stacked. The lid side should still be empty. Keep the suitcase exterior identical.`,
      `Pack the lid/flip side of the suitcase with these items neatly arranged: ${s3Items}. The main compartment already has two layers packed. The suitcase is now fully loaded. Keep the suitcase exterior identical.`,
    ]

    let currentBase64 = imageBase64
    let currentType = imageMimeType

    for (let i = 0; i < stagePrompts.length; i++) {
      try {
        const imgFile = await toFile(Buffer.from(currentBase64, 'base64'), `stage${i}.png`, { type: currentType })
        const result = await client.images.edit({
          model: 'gpt-image-1',
          image: imgFile,
          prompt: stagePrompts[i],
          n: 1,
        })
        const b64 = result.data[0].b64_json
        currentBase64 = b64
        currentType = 'image/png'
        sse({ type: 'layer', index: i, layer: { ...layerBreakdown.layers[i], imageUrl: `data:image/png;base64,${b64}` } })
      } catch (err) {
        sse({ type: 'layer', index: i, layer: { ...layerBreakdown.layers[i], imageUrl: null } })
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
    return
  }

  res.writeHead(404)
  res.end()
})

const PORT = 3001
server.listen(PORT, () => console.log(`API dev server running on http://localhost:${PORT}`))
