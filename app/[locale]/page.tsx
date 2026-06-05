export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowRight, Zap, Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search/SearchBar'
import { ToolCard } from '@/components/tools/ToolCard'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

async function getFeaturedTools() {
  return prisma.tool.findMany({
    where: { featured: true },
    include: { categories: { include: { category: true } } },
    orderBy: { name: 'asc' },
    take: 6,
  })
}

async function getRecentTools() {
  return prisma.tool.findMany({
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { tools: true } } },
    orderBy: { name: 'asc' },
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  const [featuredTools, recentTools, categories] = await Promise.all([
    getFeaturedTools(),
    getRecentTools(),
    getCategories(),
  ])

  const examples = [
    { label: t('example1'), href: '/search?category=image-generation' },
    { label: t('example2'), href: '/search?category=programming' },
    { label: t('example3'), href: '/search?category=translation' },
    { label: t('example4'), href: '/search?category=voice-speech' },
    { label: t('example5'), href: '/search?category=presentation-creation' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-cyan-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/50 dark:from-sky-900/20 via-transparent to-transparent" />
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-900/40 px-4 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-300 mb-6">
            <Zap className="h-3.5 w-3.5" />
            {t('badge')}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
              {t('highlight')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            {t('subtitle')}
          </p>

          <Suspense>
            <SearchBar placeholder={t('placeholder')} className="max-w-2xl mx-auto mb-6" />
          </Suspense>

          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('tryLabel')}</span>
            {examples.map((ex) => (
              <Link
                key={ex.href}
                href={ex.href}
                className="text-sm text-sky-500 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-200 hover:underline transition-colors"
              >
                {ex.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('browseCategories')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{t('browseCategoriesDesc')}</p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" className="gap-2 text-sky-500 dark:text-sky-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featuredTools.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('featured')}</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{t('featuredDesc')}</p>
              </div>
              <Link href="/search">
                <Button variant="ghost" className="gap-2 text-sky-500 dark:text-sky-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                  {t('browseAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('recent')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{t('recentDesc')}</p>
            </div>
            <Link href="/search">
              <Button variant="ghost" className="gap-2 text-sky-500 dark:text-sky-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                {t('seeAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
        <div className="container text-center">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-sky-50 mb-8 max-w-md mx-auto">{t('ctaDesc')}</p>
          <Link href="/search">
            <Button size="lg" variant="outline" className="bg-white text-sky-600 hover:bg-gray-50 border-0 font-semibold gap-2">
              <Search className="h-5 w-5" />
              {t('ctaBtn')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
