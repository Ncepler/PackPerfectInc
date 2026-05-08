import OpenAI, { toFile } from 'openai'

// Sequential gpt-image-1 edits can take ~2 min total
export const maxDuration = 120

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageBase64, imageMimeType, packingList, premiumKey, layerCount } = req.body

  if (premiumKey !== 'Incubator') {
    return res.status(403).json({ error: 'Premium access required' })
  }
  if (typeof layerCount === 'number' && layerCount >= 2) {
    return res.status(429).json({ error: 'Layer generation limit reached (2/2).' })
  }
  if (!imageBase64 || !packingList) {
    return res.status(400).json({ error: 'Missing imageBase64 or packingList' })
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const packingText = Object.entries(packingList)
    .map(([category, items]) => {
      const itemList = items.map(i => `${i.name} (x${i.qty})`).join(', ')
      return `${category}: ${itemList}`
    })
    .join('\n')

  // Step 1: GPT-4o vision — analyze the suitcase photo and split items into 3 stages
  let layerBreakdown
  try {
    const visionResponse = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${imageMimeType};base64,${imageBase64}` } },
          {
            type: 'text',
            text: `You are an expert packing consultant. Look at this suitcase image to gauge its approximate size and shape.

Divide ALL items from the packing list into exactly 3 progressive packing stages for a clamshell suitcase. The suitcase has two sides — a deep main compartment and a shallower lid compartment — and you pack 2 layers into the main side before filling the lid side:

- Stage 1 (Main side — Layer 1): The heaviest and bulkiest items placed flat against the back panel of the main compartment, near the wheels. Think shoes, jeans, heavy jackets, boots. This is the foundation.
- Stage 2 (Main side — Layer 2): Medium-weight items packed directly on top of Stage 1, filling the rest of the main compartment. Think shirts, pants, folded clothes, toiletries bag.
- Stage 3 (Lid side): Light, delicate, or frequently-needed items that go in the lid/flip side. Think electronics, documents, underwear, socks, accessories, chargers.

Every item must appear in exactly one stage. Main side (Stages 1+2) should hold ~65% of items; lid side (Stage 3) ~35%.

Packing list:
${packingText}

Respond ONLY with valid JSON in this exact shape — no markdown, no extra text:
{
  "suitcaseNote": "one sentence about the suitcase size/type you see",
  "layers": [
    {
      "label": "Main Side — Layer 1",
      "items": ["item name x qty", ...],
      "packingTip": "one practical tip for packing this base layer"
    },
    {
      "label": "Main Side — Layer 2",
      "items": ["item name x qty", ...],
      "packingTip": "one practical tip for packing on top of Layer 1"
    },
    {
      "label": "Lid Side",
      "items": ["item name x qty", ...],
      "packingTip": "one practical tip for packing the lid side"
    }
  ]
}`,
          },
        ],
      }],
    })
    const raw = visionResponse.choices[0]?.message?.content || ''
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    layerBreakdown = JSON.parse(cleaned)
  } catch (err) {
    return res.status(500).json({ error: `Failed to analyze packing list: ${err.message}` })
  }

  // Step 2: Stream SSE — generate images sequentially, each editing the previous result
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.status(200)

  const sse = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)

  // Send breakdown first so the client can render the layer list while images generate
  sse({
    type: 'breakdown',
    suitcaseNote: layerBreakdown.suitcaseNote,
    layers: layerBreakdown.layers.map(l => ({ label: l.label, items: l.items, packingTip: l.packingTip })),
  })

  const [s1, s2, s3] = layerBreakdown.layers
  const s1Items = s1.items.slice(0, 10).join(', ')
  const s2Items = s2.items.slice(0, 10).join(', ')
  const s3Items = s3.items.slice(0, 10).join(', ')

  // Each prompt edits the result of the previous stage — truly builds inside the suitcase
  const stagePrompts = [
    `Pack the bottom layer of this suitcase's main compartment with these items laid flat and neatly arranged: ${s1Items}. The lid side and the rest of the main compartment should remain empty. Keep the suitcase exterior identical.`,
    `Add a second layer directly on top of the existing packed items in the main compartment: ${s2Items}, neatly folded and stacked. The lid side should still be empty. Keep the suitcase exterior identical.`,
    `Pack the lid/flip side of the suitcase with these items neatly arranged: ${s3Items}. The main compartment already has two layers packed. The suitcase is now fully loaded. Keep the suitcase exterior identical.`,
  ]

  // Start from the user's actual suitcase photo; each stage feeds into the next
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
}
