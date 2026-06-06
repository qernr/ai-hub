'use client'

import { useEffect, useState } from 'react'
import { GitCompare } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function CompareNavButton() {
  const t = useTranslations('tool')
  const { items } = useCompare()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isActive = pathname === '/compare'

  useEffect(() => setMounted(true), [])

  return (
    <Link
      href="/compare"
      className={cn(
        'text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-sky-500 dark:hover:text-sky-400',
        isActive
          ? 'text-sky-500 dark:text-sky-400'
          : 'text-gray-600 dark:text-slate-300'
      )}
    >
      <GitCompare className="h-4 w-4" />
      {t('compareNav')}
      {mounted && items.length > 0 && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-500 text-white text-[10px] font-bold px-1">
          {items.length}
        </span>
      )}
    </Link>
  )
}
