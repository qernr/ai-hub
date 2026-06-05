'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Category } from '@prisma/client'

interface SearchFiltersProps {
  categories: Category[]
}

export function SearchFilters({ categories }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('search')
  const tp = useTranslations('pricing')

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={searchParams.get('category') ?? 'all'}
        onValueChange={(val) => updateParam('category', val)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t('allCategories')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allCategories')}</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.icon} {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('pricing') ?? 'all'}
        onValueChange={(val) => updateParam('pricing', val)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t('allPricing')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allPricing')}</SelectItem>
          <SelectItem value="FREE">{tp('FREE')}</SelectItem>
          <SelectItem value="FREEMIUM">{tp('FREEMIUM')}</SelectItem>
          <SelectItem value="PAID">{tp('PAID')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
