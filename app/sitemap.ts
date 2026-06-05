import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getBaseUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl()

  const [tools, categories] = await Promise.all([
    prisma.tool.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, createdAt: true } }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: c.createdAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...toolPages, ...categoryPages]
}
