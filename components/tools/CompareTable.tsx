'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, X, GitCompare, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, pricingColor, pricingLabel } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface CompareTool {
  slug: string
  name: string
  logo: string | null
  pricingType: string
  pros: string[]
  cons: string[]
}

interface CompareTableProps {
  current: CompareTool
  alternatives: CompareTool[]
}

export function CompareTable({ current, alternatives }: CompareTableProps) {
  const t = useTranslations('tool')
  const tp = useTranslations('pricing')
  const [open, setOpen] = useState(false)

  if (alternatives.length === 0) return null

  const tools = [current, ...alternatives.slice(0, 3)]
  const maxRows = Math.max(...tools.map(t => Math.max(t.pros.length, t.cons.length)))
  const prosRows = Math.min(Math.max(...tools.map(t => t.pros.length)), 5)
  const consRows = Math.min(Math.max(...tools.map(t => t.cons.length)), 4)

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        className="gap-2 w-full sm:w-auto"
        onClick={() => setOpen(v => !v)}
      >
        <GitCompare className="h-4 w-4" />
        {t('compareWith')} {alternatives.slice(0, 3).map(a => a.name).join(', ')}
        {open ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
      </Button>

      {open && (
        <div className="mt-4 overflow-x-auto rounded-xl border dark:border-slate-700">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="text-left px-4 py-3 w-28 text-gray-500 dark:text-slate-400 font-medium bg-gray-50 dark:bg-slate-800/60"></th>
                {tools.map((tool) => (
                  <th key={tool.slug} className={cn(
                    'px-4 py-3 text-center font-semibold',
                    tool.slug === current.slug
                      ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300'
                      : 'bg-gray-50 dark:bg-slate-800/60 text-gray-700 dark:text-slate-200'
                  )}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="relative h-8 w-8 overflow-hidden rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700">
                        {tool.logo ? (
                          <Image src={tool.logo} alt={tool.name} fill className="object-contain p-1" unoptimized />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs font-bold text-sky-500">{tool.name[0]}</span>
                        )}
                      </div>
                      <Link href={`/tools/${tool.slug}`} className="hover:underline text-xs leading-tight">
                        {tool.name}
                      </Link>
                      {tool.slug === current.slug && (
                        <span className="text-xs bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-full px-2 py-0.5">{t('current')}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Pricing row */}
              <tr className="border-b dark:border-slate-700/60">
                <td className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400 bg-gray-50/50 dark:bg-slate-800/30 text-xs uppercase tracking-wide">
                  {t('pricing')}
                </td>
                {tools.map((tool) => (
                  <td key={tool.slug} className={cn('px-4 py-3 text-center', tool.slug === current.slug && 'bg-sky-50/30 dark:bg-sky-950/10')}>
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', pricingColor(tool.pricingType as any))}>
                      {tp(tool.pricingType as any)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Pros header */}
              <tr className="border-b dark:border-slate-700/60 bg-emerald-50/40 dark:bg-emerald-950/10">
                <td colSpan={tools.length + 1} className="px-4 py-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    <Check className="h-3.5 w-3.5" /> {t('pros')}
                  </span>
                </td>
              </tr>
              {Array.from({ length: prosRows }).map((_, i) => (
                <tr key={`pro-${i}`} className={cn('border-b dark:border-slate-700/40', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/30 dark:bg-slate-800/20')}>
                  <td className="px-4 py-2 text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/30">{i + 1}.</td>
                  {tools.map((tool) => (
                    <td key={tool.slug} className={cn('px-4 py-2.5 text-xs text-gray-700 dark:text-slate-300 align-top', tool.slug === current.slug && 'bg-sky-50/20 dark:bg-sky-950/5')}>
                      {tool.pros[i] ? (
                        <span className="flex items-start gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          {tool.pros[i]}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Cons header */}
              <tr className="border-b dark:border-slate-700/60 bg-red-50/40 dark:bg-red-950/10">
                <td colSpan={tools.length + 1} className="px-4 py-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                    <X className="h-3.5 w-3.5" /> {t('cons')}
                  </span>
                </td>
              </tr>
              {Array.from({ length: consRows }).map((_, i) => (
                <tr key={`con-${i}`} className={cn('border-b last:border-0 dark:border-slate-700/40', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/30 dark:bg-slate-800/20')}>
                  <td className="px-4 py-2 text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/30">{i + 1}.</td>
                  {tools.map((tool) => (
                    <td key={tool.slug} className={cn('px-4 py-2.5 text-xs text-gray-700 dark:text-slate-300 align-top', tool.slug === current.slug && 'bg-sky-50/20 dark:bg-sky-950/5')}>
                      {tool.cons[i] ? (
                        <span className="flex items-start gap-1.5">
                          <X className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                          {tool.cons[i]}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
