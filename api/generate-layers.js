import OpenAI, { toFile } from 'openai'

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

  // Step 1: GPT-4o extracts a forensic visual description of the suitcase
  // AND splits the packing list into 3 stages — one call, two jobs
  let analysis
  try {
    const visionResponse = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${imageMimeType};base64,${imageBase64}` } },
          {
            type: 'text',
            text: `You are doing two jobs at once. First, describe this suitcase in exhaustive photorealistic detail so that an AI image generator can recreate it identically. Second, plan a packing strategy for the provided list.

JOB 1 — SUITCASE DESCRIPTION:
Extract every visual detail. Be forensically precise. Your description will be copy-pasted directly into an AI image generation prompt, so it must be complete enough that the generator has zero ambiguity.

JOB 2 — PACKING PLAN:
Divide ALL items into exactly 3 stages for a clamshell suitcase:
- Stage 1 (Main side — Layer 1): heaviest/bulkiest items flat against the back panel (shoes, jeans, heavy jackets, boots)
- Stage 2 (Main side — Layer 2): medium items stacked on top of Layer 1 (shirts, pants, folded clothes, toiletries)
- Stage 3 (Lid side): light/delicate/frequent-access items in the lid (electronics, docs, underwear, socks, chargers)
Main side holds ~65% of items; lid side ~35%. Every item appears in exactly one stage.

Packing list:
${packingText}

Respond ONLY with valid JSON, no markdown:
{
  "suitcase": {
    "exterior": "One dense paragraph covering: exact color with precise shade description (e.g. 'deep slate grey with a subtle blue undertone'), surface material and texture (e.g. 'hard polycarbonate shell with a fine crosshatch emboss pattern'), finish (matte/semi-gloss/glossy), any visible brand name or logo with exact color and placement, zipper color and pull style, wheel type (4-wheel spinner / 2-wheel inline) and color, carry handle color and material (top and side), telescoping handle color, any corner guards, straps, latches, or exterior pockets",
    "interior": "Lining color exact shade (e.g. 'charcoal grey polyester with a subtle herringbone weave'), any visible mesh panels, elastic cross-straps, compression pad, zipper pocket on lid side, divider panel, overall interior organization",
    "shape": "Apparent size (carry-on / medium checked / large checked), aspect ratio (taller vs wider), depth of main compartment, lid compartment depth ratio",
    "cameraAngle": "Exact viewing angle and perspective (e.g. 'overhead bird's-eye view looking straight down, suitcase lying flat open'), lighting description (soft diffuse studio light / natural window light from left / etc.), background surface and color"
  },
  "suitcaseNote": "One plain sentence summarizing the suitcase",
  "layers": [
    { "label": "Main Side — Layer 1", "items": ["item x qty", ...], "packingTip": "practical tip" },
    { "label": "Main Side — Layer 2", "items": ["item x qty", ...], "packingTip": "practical tip" },
    { "label": "Lid Side",            "items": ["item x qty", ...], "packingTip": "practical tip" }
  ]
}`,
          },
        ],
      }],
    })
    const raw = visionResponse.choices[0]?.message?.content || ''
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    analysis = JSON.parse(cleaned)
  } catch (err) {
    return res.status(500).json({ error: `Failed to analyze suitcase: ${err.message}` })
  }

  const { suitcase, suitcaseNote, layers } = analysis
  const sc = suitcase

  // Anchor sentence — injected into every image prompt to lock the suitcase appearance
  const suitcaseAnchor = `The suitcase: ${sc.exterior}. Interior lining: ${sc.interior}. Size/shape: ${sc.shape}. Camera: ${sc.cameraAngle}.`

  const [s1, s2, s3] = layers
  const s1Items = s1.items.slice(0, 12).join(', ')
  const s2Items = s2.items.slice(0, 12).join(', ')
  const s3Items = s3.items.slice(0, 12).join(', ')

  const stagePrompts = [
    `Hyper-realistic product photograph of an open suitcase. ${suitcaseAnchor} PACKING STATE — Layer 1 only: the main compartment has its first packing layer placed flat and neatly against the back panel: ${s1Items}. Each item clearly identifiable, visible, neatly spaced. The lid compartment and the upper portion of the main compartment are completely empty, bare lining showing. Nothing else packed anywhere. Photorealistic, sharp detail, professional product photography.`,

    `Hyper-realistic product photograph of an open suitcase. ${suitcaseAnchor} PACKING STATE — Two layers in main compartment: the base layer against the back panel has ${s1Items} (partially visible underneath). On top of that, neatly stacked and folded: ${s2Items}. Main compartment is now full. Lid compartment is still completely empty, bare lining showing. Photorealistic, sharp detail, professional product photography.`,

    `Hyper-realistic product photograph of an open fully packed suitcase. ${suitcaseAnchor} PACKING STATE — Fully packed: main compartment has two layers (base: ${s1Items}; top layer: ${s2Items}). Lid compartment is packed with ${s3Items} neatly arranged. The suitcase looks ready to zip closed. Photorealistic, sharp detail, professional product photography.`,
  ]

  // Step 2: Stream SSE — generate all 3 images in parallel, send each as it completes
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.status(200)

  const sse = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)

  sse({
    type: 'breakdown',
    suitcaseNote,
    layers: layers.map(l => ({ label: l.label, items: l.items, packingTip: l.packingTip })),
  })

  // Fire all 3 in parallel; each sends its SSE event the moment it finishes
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
}
