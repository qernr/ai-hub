'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, GitCompare, ChevronUp, ChevronDown, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompare } from '@/hooks/useCompare'
import { cn, pricingColor, pricingLabel } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export function CompareBar() {
  const t = useTranslations('tool')
  const tp = useTranslations('pricing')
  const { items, removeTool, clearAll } = useCompare()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  // Close table when items drop below 2
  useEffect(() => { if (items.length < 2) setOpen(false) }, [items.length])

  if (!mounted || items.length === 0) return null

  const prosRows = Math.min(Math.max(...items.map(i => i.pros.length)), 5)
  const consRows = Math.min(Math.max(...items.map(i => i.cons.length)), 4)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Comparison table — slides up */}
      {open && items.length >= 2 && (
        <div className="border-t dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl max-h-[60vh] overflow-y-auto">
          <div className="container max-w-5xl py-4">
            <div className="overflow-x-auto rounded-xl border dark:border-slate-700">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b dark:border-slate-700">
                    <th className="text-left px-4 py-3 w-24 text-gray-500 dark:text-slate-400 font-medium bg-gray-50 dark:bg-slate-800/60 text-xs uppercase tracking-wide"></th>
                    {items.map((tool) => (
                      <th key={tool.slug} className="px-4 py-3 text-center font-semibold bg-gray-50 dark:bg-slate-800/60 text-gray-700 dark:text-slate-200">
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
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Pricing */}
                  <tr className="border-b dark:border-slate-700/60">
                    <td className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400 bg-gray-50/50 dark:bg-slate-800/30 text-xs uppercase tracking-wide">
                      {t('pricing')}
                    </td>
                    {items.map((tool) => (
                      <td key={tool.slug} className="px-4 py-3 text-center">
                        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', pricingColor(tool.pricingType as never))}>
                          {tp(tool.pricingType as never)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Pros header */}
                  <tr className="border-b dark:border-slate-700/60 bg-emerald-50/40 dark:bg-emerald-950/10">
                    <td colSpan={items.length + 1} className="px-4 py-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                        <Check className="h-3.5 w-3.5" /> {t('pros')}
                      </span>
                    </td>
                  </tr>
                  {Array.from({ length: prosRows }).map((_, i) => (
                    <tr key={`pro-${i}`} className={cn('border-b dark:border-slate-700/40', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/30 dark:bg-slate-800/20')}>
                      <td className="px-4 py-2 text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/30">{i + 1}.</td>
                      {items.map((tool) => (
                        <td key={tool.slug} className="px-4 py-2.5 text-xs text-gray-700 dark:text-slate-300 align-top">
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
                    <td colSpan={items.length + 1} className="px-4 py-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                        <X className="h-3.5 w-3.5" /> {t('cons')}
                      </span>
                    </td>
                  </tr>
                  {Array.from({ length: consRows }).map((_, i) => (
                    <tr key={`con-${i}`} className={cn('border-b last:border-0 dark:border-slate-700/40', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/30 dark:bg-slate-800/20')}>
                      <td className="px-4 py-2 text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/30">{i + 1}.</td>
                      {items.map((tool) => (
                        <td key={tool.slug} className="px-4 py-2.5 text-xs text-gray-700 dark:text-slate-300 align-top">
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
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-lg">
        <div className="container max-w-5xl py-3 flex items-center gap-3 flex-wrap">
          <GitCompare className="h-4 w-4 text-sky-500 shrink-0" />
          <span className="text-sm font-medium text-gray-700 dark:text-slate-200 shrink-0">{t('comparisonBar')}:</span>

          <div className="flex items-center gap-2 flex-wrap flex-1">
            {items.map((tool) => (
              <div key={tool.slug} className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 rounded-full pl-1 pr-2 py-1">
                <div className="relative h-5 w-5 overflow-hidden rounded-full border dark:border-slate-600 bg-white dark:bg-slate-700 shrink-0">
                  {tool.logo ? (
                    <Image src={tool.logo} alt={tool.name} fill className="object-contain p-0.5" unoptimized />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[8px] font-bold text-sky-500">{tool.name[0]}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-slate-200">{tool.name}</span>
                <button
                  onClick={() => removeTool(tool.slug)}
                  className="ml-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {items.length < 4 && (
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {t('addMoreToCompare')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="gap-1.5 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t('clearComparison')}
            </Button>
            {items.length >= 2 && (
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
                onClick={() => setOpen(v => !v)}
              >
                <GitCompare className="h-4 w-4" />
                {t('compareSelected')} ({items.length})
                {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
