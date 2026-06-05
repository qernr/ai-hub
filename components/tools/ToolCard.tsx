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
  const tNames = useTranslations('categoryNames')
  const tp = useTranslations('pricing')
  const locale = useLocale()

  const translations = tool.translations as TranslationMap | null
  const description = translations?.[locale]?.description ?? tool.description

  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 dark:bg-slate-800 dark:border-slate-700">
      <CardContent className="flex flex-col flex-1 p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm">
            {tool.logo ? (
              <Image
                src={tool.logo}
                alt={`${tool.name} logo`}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-950 dark:to-cyan-950 text-sky-500 dark:text-sky-300 font-bold text-lg">
                {tool.name[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors truncate">
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

        <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed flex-1 mb-4">
          {truncate(description, 120)}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {tool.categories.slice(0, 3).map(({ category }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const catName = (tNames as any)(category.slug) ?? category.name
            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Badge variant="secondary" className="text-xs hover:bg-sky-100 dark:hover:bg-sky-950 hover:text-sky-600 dark:hover:text-sky-300 cursor-pointer transition-colors dark:bg-slate-700 dark:text-slate-300">
                  {catName}
                </Badge>
              </Link>
            )
          })}
          {tool.categories.length > 3 && (
            <Badge variant="outline" className="text-xs dark:border-slate-600 dark:text-slate-400">
              +{tool.categories.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Link href={`/tools/${tool.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
              {t('details')}
            </Button>
          </Link>
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" className="w-full gap-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
              <ExternalLink className="h-3.5 w-3.5" />
              {t('visit')}
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
