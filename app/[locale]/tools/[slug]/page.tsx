export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, CheckCircle2, XCircle, BookOpen, Lightbulb } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ToolCard } from '@/components/tools/ToolCard'
import { CompareTable } from '@/components/tools/CompareTable'
import { AddToCompareButton } from '@/components/tools/AddToCompareButton'
import { cn, pricingLabel, pricingColor, formatDate } from '@/lib/utils'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface ToolPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await prisma.tool.findUnique({ where: { slug } })
  if (!tool) return {}
  return {
    title: `${tool.name} — AI Tool Review`,
    description: tool.description.slice(0, 160),
    openGraph: {
      title: `${tool.name} | AI Hub`,
      description: tool.description.slice(0, 160),
      images: tool.logo ? [{ url: tool.logo }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | AI Hub`,
      description: tool.description.slice(0, 160),
    },
  }
}

async function getAlternativeTools(slugs: string[]) {
  if (!slugs.length) return []
  return prisma.tool.findMany({
    where: { slug: { in: slugs } },
    include: { categories: { include: { category: true } } },
    take: 3,
  })
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('tool')

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { categories: { include: { category: true } } },
  })

  if (!tool) notFound()

  const alternativeTools = await getAlternativeTools(tool.alternatives)

  type TranslationEntry = { description?: string; usageInstructions?: string; pros?: string[]; cons?: string[] }
  type TranslationMap = Record<string, TranslationEntry>
  const translations = tool.translations as TranslationMap | null
  const localeTr = translations?.[locale]
  const description = localeTr?.description ?? tool.description
  const usageInstructions = localeTr?.usageInstructions ?? tool.usageInstructions
  const pros = localeTr?.pros ?? tool.pros
  const cons = localeTr?.cons ?? tool.cons

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: description,
    url: tool.websiteUrl,
    applicationCategory: 'AIApplication',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-10 max-w-4xl">
        <Link href="/search">
          <Button variant="ghost" size="sm" className="mb-6 gap-2 text-gray-600 dark:text-gray-400">
            <ArrowLeft className="h-4 w-4" />
            {t('backToTools')}
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-8">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
            {tool.logo ? (
              <Image
                src={tool.logo}
                alt={`${tool.name} logo`}
                fill
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-950 dark:to-cyan-950 text-sky-600 dark:text-sky-300 font-bold text-3xl">
                {tool.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-sm font-medium', pricingColor(tool.pricingType))}>
                {pricingLabel(tool.pricingType)}
              </span>
              {tool.categories.map(({ category }) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Badge variant="secondary" className="hover:bg-sky-100 dark:hover:bg-sky-950 hover:text-sky-600 dark:hover:text-sky-300 cursor-pointer">
                    {category.icon} {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <AddToCompareButton
              tool={{
                slug: tool.slug,
                name: tool.name,
                logo: tool.logo,
                pricingType: tool.pricingType,
                pros,
                cons,
              }}
            />
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 w-full sm:w-auto">
                <ExternalLink className="h-4 w-4" />
                {t('visitWebsite')}
              </Button>
            </a>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t('about')} {tool.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{description}</p>
        </section>

        <Separator className="my-8 dark:border-gray-700" />

        {/* Pros & Cons */}
        {(pros.length > 0 || cons.length > 0) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('prosAndCons')}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {pros.length > 0 && (
                <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5" />
                    {t('pros')}
                    <span className="ml-auto text-xs font-normal bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full px-2 py-0.5">{pros.length}</span>
                  </h3>
                  <ul className="space-y-3">
                    {pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-0.5">{i + 1}</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cons.length > 0 && (
                <div className="rounded-xl border border-red-100 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 p-5">
                  <h3 className="font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2 text-base">
                    <XCircle className="h-5 w-5" />
                    {t('cons')}
                    <span className="ml-auto text-xs font-normal bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full px-2 py-0.5">{cons.length}</span>
                  </h3>
                  <ul className="space-y-3">
                    {cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-red-800 dark:text-red-300 leading-relaxed">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400 text-xs font-bold mt-0.5">{i + 1}</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Usage Instructions */}
        {usageInstructions && (
          <>
            <Separator className="my-8 dark:border-gray-700" />
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                {t('howToUse')} {tool.name}
              </h2>
              <div className="rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{usageInstructions}</p>
              </div>
            </section>
          </>
        )}

        {/* Alternatives */}
        {alternativeTools.length > 0 && (
          <>
            <Separator className="my-8 dark:border-gray-700" />
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                {t('alternatives')} {tool.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t('alternativesDesc')}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                {alternativeTools.map((alt) => (
                  <ToolCard key={alt.id} tool={alt} />
                ))}
              </div>
              <CompareTable
                current={{
                  slug: tool.slug,
                  name: tool.name,
                  logo: tool.logo,
                  pricingType: tool.pricingType,
                  pros,
                  cons,
                }}
                alternatives={alternativeTools.map((alt) => {
                  const altTr = (alt.translations as Record<string, { pros?: string[]; cons?: string[] }> | null)?.[locale]
                  return {
                    slug: alt.slug,
                    name: alt.name,
                    logo: alt.logo,
                    pricingType: alt.pricingType,
                    pros: altTr?.pros ?? alt.pros,
                    cons: altTr?.cons ?? alt.cons,
                  }
                })}
              />
            </section>
          </>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">{t('lastUpdated')}: {formatDate(tool.updatedAt)}</p>
      </div>
    </>
  )
}
