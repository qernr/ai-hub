import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

// Process 5 tools per run — full cycle through all 58 tools every ~12 weeks
const TOOLS_PER_RUN = 5

type ToolTranslations = Record<string, {
  description?: string
  pros?: string[]
  cons?: string[]
  usageInstructions?: string
}>

export async function POST(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.get('authorization')

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  const client = apiKey ? new Anthropic({ apiKey }) : null

  // Pick the oldest-updated tools first so every tool rotates through
  const tools = await prisma.tool.findMany({
    orderBy: { updatedAt: 'asc' },
    take: TOOLS_PER_RUN,
  })

  const results: { slug: string; status: string; error?: string }[] = []

  for (const tool of tools) {
    try {
      const existing = (tool.translations ?? {}) as ToolTranslations
      let ruTranslation = existing.ru ?? {}

      if (client) {
        const message = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          messages: [
            {
              role: 'user',
              content: `You are updating the Russian content for an AI tool directory.
Review and improve the Russian translation for "${tool.name}".

English description: ${tool.description}
English pros: ${tool.pros.join(' | ')}
English cons: ${tool.cons.join(' | ')}
English usage: ${tool.usageInstructions ?? ''}

Return ONLY valid JSON (no markdown):
{
  "description": "engaging Russian description, 2-3 sentences, present tense",
  "pros": ["Russian advantage 1", "Russian advantage 2", "Russian advantage 3", "Russian advantage 4", "Russian advantage 5"],
  "cons": ["Russian drawback 1", "Russian drawback 2", "Russian drawback 3"],
  "usageInstructions": "concise instructions in Russian, 1-2 sentences"
}`,
            },
          ],
        })

        const text =
          message.content[0].type === 'text' ? message.content[0].text : '{}'
        const clean = text.replace(/```json\n?|```\n?/g, '').trim()
        ruTranslation = JSON.parse(clean)
      }

      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          translations: { ...existing, ru: ruTranslation },
        },
      })

      results.push({ slug: tool.slug, status: client ? 'ai-refreshed' : 'touched' })
    } catch (err) {
      results.push({ slug: tool.slug, status: 'error', error: String(err) })
    }
  }

  const summary = {
    success: true,
    timestamp: new Date().toISOString(),
    processed: results.length,
    aiEnabled: !!client,
    results,
  }

  console.log('[cron/update]', JSON.stringify(summary))
  return Response.json(summary)
}
