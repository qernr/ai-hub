import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters } from '@/components/search/SearchFilters'
import { ToolCard } from '@/components/tools/ToolCard'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingGrid } from '@/components/common/LoadingCard'
import type { SearchParams } from '@/types'
import type { PricingType } from '@prisma/client'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'search' })
  return { title: t('title') }
}

const PER_PAGE = 12

async function SearchResults({ params, locale }: { params: SearchParams; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'search' })
  const query = params.q?.trim() ?? ''
  const category = params.category ?? ''
  const pricing = params.pricing ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  const where = {
    AND: [
      query ? { OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
      ]} : {},
      category ? { categories: { some: { category: { slug: category } } } } : {},
      pricing ? { pricingType: pricing as PricingType } : {},
    ],
  }

  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where,
      include: { categories: { include: { category: true } } },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.tool.count({ where }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  if (tools.length === 0) {
    return (
      <EmptyState
        title={t('noResults')}
        description={query ? t('noResultsQuery', { query }) : t('noResultsFilter')}
        action={{ label: t('clearFilters'), href: '/search' }}
      />
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {total === 1 ? t('toolFound', { count: total }) : t('toolsFound', { count: total })}
        {query && <span> &ldquo;<strong>{query}</strong>&rdquo;</span>}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      <Suspense>
        <Pagination totalPages={totalPages} currentPage={page} />
      </Suspense>
    </div>
  )
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('search')

  const [resolvedParams, categories] = await Promise.all([
    searchParams,
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('desc')}</p>
      </div>

      <Suspense>
        <div className="space-y-4 mb-8">
          <SearchBar placeholder={t('placeholder')} />
          <SearchFilters categories={categories} />
        </div>
      </Suspense>

      <Suspense fallback={<LoadingGrid />}>
        <SearchResults params={resolvedParams} locale={locale} />
      </Suspense>
    </div>
  )
}
