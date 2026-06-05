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
  const tNames = useTranslations('categoryNames')
  const count = category._count.tools

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localizedName = (tNames as any)(category.slug) ?? category.name

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 h-full dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/40 dark:to-cyan-900/40 text-2xl border border-sky-100 dark:border-sky-800">
            {category.icon ?? '🤖'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors truncate">
              {localizedName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {count} {count !== 1 ? t('tools') : t('tool')}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 dark:text-slate-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all shrink-0" />
        </CardContent>
      </Card>
    </Link>
  )
}
