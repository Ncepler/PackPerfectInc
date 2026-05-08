import OpenAI from 'openai'

// Increase timeout for DALL-E 3 image generation (3 images in parallel)
export const maxDuration = 60

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageBase64, imageMimeType, packingList, premiumKey, layerCount } = req.body

  // Server-side premium check
  if (premiumKey !== 'Incubator') {
    return res.status(403).json({ error: 'Premium access required' })
  }

  // Server-side usage limit check
  if (typeof layerCount === 'number' && layerCount >= 2) {
    return res.status(429).json({ error: 'Layer generation limit reached (2/2).' })
  }

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

  // Step 1: Use gpt-4o vision to analyze the suitcase and split items into 3 progressive packing stages
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

  // Step 2: Build progressive DALL-E prompts — each image shows the suitcase more packed than the last
  const [s1, s2, s3] = layerBreakdown.layers
  const s1Items = s1.items.slice(0, 10).join(', ')
  const s2Items = s2.items.slice(0, 10).join(', ')
  const s3Items = s3.items.slice(0, 10).join(', ')

  const imagePrompts = [
    `An open clamshell travel suitcase photographed from slightly above at a 45-degree angle. The deep main compartment shows only the first packing layer laid flat against the back panel: ${s1Items}. Items are neatly arranged. The rest of the main compartment and the entire lid side are completely empty. Realistic product photography, clean neutral background, soft even lighting. No text, no people.`,

    `An open clamshell travel suitcase photographed from slightly above at a 45-degree angle. The main compartment is now fully packed with two layers: ${s1Items} form the flat base layer against the back panel, and ${s2Items} are packed neatly on top filling the compartment. The lid side is still completely empty. Realistic product photography, clean neutral background, soft even lighting. No text, no people.`,

    `An open clamshell travel suitcase photographed from slightly above at a 45-degree angle, both sides visible. The main compartment is fully packed (base layer: ${s1Items}; top layer: ${s2Items}). The lid side is now also packed with ${s3Items}. The suitcase is completely packed and ready to close. Realistic product photography, clean neutral background, soft even lighting. No text, no people.`,
  ]

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
