import OpenAI from 'openai'

// Increase timeout for DALL-E 3 image generation (3 images in parallel)
export const maxDuration = 60

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageBase64, imageMimeType, packingList } = req.body

  if (!imageBase64 || !packingList) {
    return res.status(400).json({ error: 'Missing imageBase64 or packingList' })
  }

  // API key read from OPENAI_API_KEY environment variable — never exposed to the frontend
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Flatten packing list into a readable string
  const packingText = Object.entries(packingList)
    .map(([category, items]) => {
      const itemList = items.map(i => `${i.name} (x${i.qty})`).join(', ')
      return `${category}: ${itemList}`
    })
    .join('\n')

  // Step 1: Use gpt-4o vision to analyze the suitcase and split items into 3 layers
  let layerBreakdown
  try {
    const visionResponse = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1200,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${imageMimeType};base64,${imageBase64}` },
            },
            {
              type: 'text',
              text: `You are an expert packing consultant. Look at this suitcase image to gauge its approximate size and shape.

Then take the packing list below and divide ALL items into exactly 3 packing layers, following these rules:
- Bottom layer: heavy and bulky items (shoes, jeans, heavy jackets) — packed first, near the wheels
- Middle layer: medium-weight clothing and accessories (shirts, pants, toiletries bag)
- Top layer: light, delicate, or frequently-needed items (electronics, documents, underwear, socks)

Packing list:
${packingText}

Respond ONLY with valid JSON in this exact shape — no markdown, no extra text:
{
  "suitcaseNote": "one sentence about the suitcase size/type you see",
  "layers": [
    {
      "label": "Bottom Layer",
      "items": ["item name x qty", ...],
      "packingTip": "one practical tip for this layer"
    },
    {
      "label": "Middle Layer",
      "items": ["item name x qty", ...],
      "packingTip": "one practical tip for this layer"
    },
    {
      "label": "Top Layer",
      "items": ["item name x qty", ...],
      "packingTip": "one practical tip for this layer"
    }
  ]
}`,
            },
          ],
        },
      ],
    })

    const raw = visionResponse.choices[0]?.message?.content || ''
    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    layerBreakdown = JSON.parse(cleaned)
  } catch (err) {
    return res.status(500).json({ error: `Failed to analyze packing list: ${err.message}` })
  }

  // Step 2: Generate one DALL-E 3 image per layer (all 3 in parallel)
  const imagePrompts = layerBreakdown.layers.map((layer) => {
    const itemsText = layer.items.slice(0, 12).join(', ')
    return `A clean, professional flat-lay photograph on a white background. Travel items arranged neatly from a top-down bird's-eye view. Items shown: ${itemsText}. Minimalist styling, soft shadows, even lighting. Each item clearly visible and spaced apart. No text, no labels, no people.`
  })

  let layerImages
  try {
    layerImages = await Promise.all(
      imagePrompts.map((prompt) =>
        client.images.generate({
          model: 'dall-e-3',
          prompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        })
      )
    )
  } catch (err) {
    return res.status(500).json({ error: `Failed to generate layer images: ${err.message}` })
  }

  // Combine layer breakdown with generated image URLs
  const layers = layerBreakdown.layers.map((layer, i) => ({
    label: layer.label,
    items: layer.items,
    packingTip: layer.packingTip,
    imageUrl: layerImages[i]?.data?.[0]?.url || null,
  }))

  return res.status(200).json({
    suitcaseNote: layerBreakdown.suitcaseNote,
    layers,
  })
}
