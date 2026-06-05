import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ToolCard } from '@/components/tools/ToolCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return {}
  return {
    title: `${category.name} AI Tools`,
    description: category.description ?? `Find the best AI tools for ${category.name.toLowerCase()}.`,
    openGraph: {
      title: `${category.name} AI Tools | AI Hub`,
      description: category.description ?? `Browse AI tools in the ${category.name} category.`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('tool')
  const tCat = await getTranslations('categories')

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { tools: true } },
      tools: {
        include: {
          tool: { include: { categories: { include: { category: true } } } },
        },
        orderBy: { tool: { featured: 'desc' } },
      },
    },
  })

  if (!category) notFound()

  const tools = category.tools.map((tc) => tc.tool)
  const count = category._count.tools

  return (
    <div className="container py-10">
      <Link href="/categories">
        <Button variant="ghost" size="sm" className="mb-6 gap-2 text-gray-600 dark:text-gray-400">
          <ArrowLeft className="h-4 w-4" />
          {tCat('title')}
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {category.icon && <span className="text-3xl">{category.icon}</span>}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {count} {count !== 1 ? tCat('tools') : tCat('tool')}
        </p>
      </div>

      {tools.length === 0 ? (
        <EmptyState
          title="No tools yet"
          description="No tools have been added to this category yet."
          action={{ label: t('backToTools'), href: '/search' }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}
