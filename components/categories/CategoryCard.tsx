'use client'

import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { CategoryWithCount } from '@/types'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface CategoryCardProps {
  category: CategoryWithCount
}

export function CategoryCard({ category }: CategoryCardProps) {
  const t = useTranslations('categories')
  const count = category._count.tools

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 h-full dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/40 dark:to-indigo-900/40 text-2xl border border-violet-100 dark:border-violet-800">
            {category.icon ?? '🤖'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {count} {count !== 1 ? t('tools') : t('tool')}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0" />
        </CardContent>
      </Card>
    </Link>
  )
}
