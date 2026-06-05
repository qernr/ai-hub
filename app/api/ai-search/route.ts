import Anthropic from '@anthropic-ai/sdk'

const CATEGORIES = [
  'text-generation',
  'image-generation',
  'video-generation',
  'music-generation',
  'presentation-creation',
  'programming',
  'translation',
  'voice-speech',
  'document-processing',
  'chatbots',
  'data-analytics',
  'photo-editing',
  'design',
  'education',
  'meetings',
  'automation',
  'avatar',
]

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json({ intent: null, categories: [], keywords: [] })
  }

  let query: string
  let locale: string
  try {
    const body = await req.json()
    query = body.query?.trim()
    locale = body.locale ?? 'en'
  } catch {
    return Response.json({ intent: null, categories: [], keywords: [] })
  }

  if (!query) {
    return Response.json({ intent: null, categories: [], keywords: [] })
  }

  const client = new Anthropic({ apiKey })

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `You are a search assistant for an AI tools directory. Analyze the user query and return JSON.

User query: "${query}"
UI language: ${locale}

Available categories: ${CATEGORIES.join(', ')}

Return ONLY valid JSON (no markdown, no code blocks, no explanation):
{
  "intent": "very short description of what the user wants, written in the same language as the query, max 60 chars",
  "categories": ["most-relevant-category-slug"],
  "keywords": ["english-keyword1", "english-keyword2"]
}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const clean = text.replace(/```json\n?|```\n?/g, '').trim()
    const result = JSON.parse(clean)
    return Response.json({
      intent: result.intent ?? null,
      categories: Array.isArray(result.categories) ? result.categories : [],
      keywords: Array.isArray(result.keywords) ? result.keywords : [],
    })
  } catch {
    return Response.json({ intent: null, categories: [], keywords: [] })
  }
}
