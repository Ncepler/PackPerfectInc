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

    let analysis
    try {
      const visionResponse = await client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${imageMimeType};base64,${imageBase64}` } },
            { type: 'text', text: `You are doing two jobs at once. First, describe this suitcase in exhaustive photorealistic detail so that an AI image generator can recreate it identically. Second, plan a packing strategy for the provided list.\n\nJOB 1 — SUITCASE DESCRIPTION:\nExtract every visual detail. Be forensically precise. Your description will be copy-pasted directly into an AI image generation prompt, so it must be complete enough that the generator has zero ambiguity.\n\nJOB 2 — PACKING PLAN:\nDivide ALL items into exactly 3 stages for a clamshell suitcase:\n- Stage 1 (Main side — Layer 1): heaviest/bulkiest items flat against the back panel (shoes, jeans, heavy jackets, boots)\n- Stage 2 (Main side — Layer 2): medium items stacked on top of Layer 1 (shirts, pants, folded clothes, toiletries)\n- Stage 3 (Lid side): light/delicate/frequent-access items in the lid (electronics, docs, underwear, socks, chargers)\nMain side holds ~65% of items; lid side ~35%. Every item appears in exactly one stage.\n\nPacking list:\n${packingText}\n\nRespond ONLY with valid JSON, no markdown:\n{\n  "suitcase": {\n    "exterior": "One dense paragraph: exact color with precise shade, surface material and texture, finish type, any brand name/logo with color and placement, zipper color and style, wheel type and color, handle color and material, telescoping handle color, any corner guards/latches/pockets",\n    "interior": "Lining color exact shade, material texture, any mesh panels, elastic straps, compression pad, zipper pockets, divider panel",\n    "shape": "Apparent size (carry-on/medium/large checked), aspect ratio, main compartment depth, lid depth ratio",\n    "cameraAngle": "Exact viewing angle and perspective, lighting description, background surface and color"\n  },\n  "suitcaseNote": "One plain sentence summarizing the suitcase",\n  "layers": [\n    { "label": "Main Side — Layer 1", "items": ["item x qty"], "packingTip": "practical tip" },\n    { "label": "Main Side — Layer 2", "items": ["item x qty"], "packingTip": "practical tip" },\n    { "label": "Lid Side",            "items": ["item x qty"], "packingTip": "practical tip" }\n  ]\n}` },
          ],
        }],
      })
      const raw = visionResponse.choices[0]?.message?.content || ''
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysis = JSON.parse(cleaned)
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: `Failed to analyze suitcase: ${err.message}` }))
    }

    const { suitcase: sc, suitcaseNote, layers } = analysis
    const suitcaseAnchor = `The suitcase: ${sc.exterior}. Interior lining: ${sc.interior}. Size/shape: ${sc.shape}. Camera: ${sc.cameraAngle}.`

    const [s1, s2, s3] = layers
    const s1Items = s1.items.slice(0, 12).join(', ')
    const s2Items = s2.items.slice(0, 12).join(', ')
    const s3Items = s3.items.slice(0, 12).join(', ')

    const stagePrompts = [
      `Hyper-realistic product photograph of an open suitcase. ${suitcaseAnchor} PACKING STATE — Layer 1 only: the main compartment has its first packing layer placed flat and neatly against the back panel: ${s1Items}. Each item clearly identifiable and neatly spaced. The lid compartment and the upper portion of the main compartment are completely empty, bare lining showing. Photorealistic, sharp detail, professional product photography.`,
      `Hyper-realistic product photograph of an open suitcase. ${suitcaseAnchor} PACKING STATE — Two layers in main compartment: the base layer against the back panel has ${s1Items} (partially visible). On top, neatly stacked and folded: ${s2Items}. Main compartment is now full. Lid compartment is still completely empty, bare lining showing. Photorealistic, sharp detail, professional product photography.`,
      `Hyper-realistic product photograph of an open fully packed suitcase. ${suitcaseAnchor} PACKING STATE — Fully packed: main compartment has two layers (base: ${s1Items}; top: ${s2Items}). Lid compartment is packed with ${s3Items} neatly arranged. The suitcase looks ready to zip closed. Photorealistic, sharp detail, professional product photography.`,
    ]

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    const sse = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)

    sse({
      type: 'breakdown',
      suitcaseNote,
      layers: layers.map(l => ({ label: l.label, items: l.items, packingTip: l.packingTip })),
    })

    await Promise.all(stagePrompts.map(async (prompt, i) => {
      try {
        const result = await client.images.generate({
          model: 'gpt-image-1',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'high',
        })
        const b64 = result.data[0].b64_json
        sse({ type: 'layer', index: i, layer: { ...layers[i], imageUrl: `data:image/png;base64,${b64}` } })
      } catch (err) {
        sse({ type: 'layer', index: i, layer: { ...layers[i], imageUrl: null } })
      }
    }))

    res.write('data: [DONE]\n\n')
    res.end()
    return
  }

  res.writeHead(404)
  res.end()
})

const PORT = 3001
server.listen(PORT, () => console.log(`API dev server running on http://localhost:${PORT}`))
