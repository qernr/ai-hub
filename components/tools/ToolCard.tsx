'use client'

import Image from 'next/image'
import { ExternalLink, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, pricingColor, truncate } from '@/lib/utils'
import type { ToolWithCategories } from '@/types'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface ToolCardProps {
  tool: ToolWithCategories
}

type TranslationMap = Record<string, { description?: string }>

export function ToolCard({ tool }: ToolCardProps) {
  const t = useTranslations('tool')
  const tp = useTranslations('pricing')
  const locale = useLocale()

  const translations = tool.translations as TranslationMap | null
  const description = translations?.[locale]?.description ?? tool.description

  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="flex flex-col flex-1 p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
            {tool.logo ? (
              <Image
                src={tool.logo}
                alt={`${tool.name} logo`}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 text-violet-600 dark:text-violet-300 font-bold text-lg">
                {tool.name[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                {tool.name}
              </h3>
              {tool.featured && (
                <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {t('featured')}
                </span>
              )}
            </div>
            <span className={cn('inline-flex mt-0.5 items-center rounded-full px-2 py-0.5 text-xs font-medium', pricingColor(tool.pricingType))}>
              {tp(tool.pricingType)}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1 mb-4">
          {truncate(description, 120)}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {tool.categories.slice(0, 3).map(({ category }) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Badge variant="secondary" className="text-xs hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer transition-colors dark:bg-gray-700 dark:text-gray-300">
                {category.name}
              </Badge>
            </Link>
          ))}
          {tool.categories.length > 3 && (
            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
              +{tool.categories.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Link href={`/tools/${tool.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              {t('details')}
            </Button>
          </Link>
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" className="w-full gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              <ExternalLink className="h-3.5 w-3.5" />
              {t('visit')}
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
