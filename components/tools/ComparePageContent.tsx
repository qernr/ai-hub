'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Plus, X, Trophy, TrendingUp, TrendingDown, ExternalLink, Trash2, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompare, type CompareItem, MAX_COMPARE } from '@/hooks/useCompare'
import { cn, pricingColor } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface AvailableTool {
  id: string
  slug: string
  name: string
  logo: string | null
  pricingType: string
  pros: string[]
  cons: string[]
  featured: boolean
}

interface Props {
  tools: AvailableTool[]
}

export function ComparePageContent({ tools }: Props) {
  const t = useTranslations('compare')
  const tt = useTranslations('tool')
  const tp = useTranslations('pricing')
  const { items, addTool, removeTool, clearAll, isAdded } = useCompare()
  const [search, setSearch] = useState('')

  const available = useMemo(() => {
    const q = search.toLowerCase()
    return tools.filter(tool =>
      !isAdded(tool.slug) && (!q || tool.name.toLowerCase().includes(q))
    )
  }, [tools, search, items])

  const scores = items.map(i => i.pros.length - i.cons.length)
  const bestIdx = scores.length ? scores.indexOf(Math.max(...scores)) : -1

  const prosRows = items.length ? Math.min(Math.max(...items.map(i => i.pros.length)), 6) : 0
  const consRows = items.length ? Math.min(Math.max(...items.map(i => i.cons.length)), 5) : 0

  return (
    <div className="container max-w-6xl py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
            <GitCompare className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        </div>
        <p className="text-gray-500 dark:text-slate-400 ml-13">{t('subtitle')}</p>
      </div>

      {/* Selected tools chips */}
      {items.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">
              {t('selected')}: {items.length}/{MAX_COMPARE}
            </span>
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> {t('clearAll')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center gap-2 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-full pl-1.5 pr-3 py-1.5 shadow-sm">
                <div className="relative h-6 w-6 overflow-hidden rounded-full border dark:border-slate-500 bg-gray-100 dark:bg-slate-600 shrink-0">
                  {item.logo
                    ? <Image src={item.logo} alt={item.name} fill className="object-contain p-0.5" unoptimized />
                    : <span className="flex h-full items-center justify-center text-[9px] font-bold text-sky-500">{item.name[0]}</span>
                  }
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-slate-200">{item.name}</span>
                <button onClick={() => removeTool(item.slug)} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add tools section */}
      {items.length < MAX_COMPARE && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('addTools')}</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {available.slice(0, 20).map(tool => (
              <button
                key={tool.slug}
                onClick={() => addTool({ slug: tool.slug, name: tool.name, logo: tool.logo, pricingType: tool.pricingType, pros: tool.pros, cons: tool.cons })}
                className="flex items-center gap-2 p-2.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-all text-left group"
              >
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border dark:border-slate-600 bg-gray-100 dark:bg-slate-700">
                  {tool.logo
                    ? <Image src={tool.logo} alt={tool.name} fill className="object-contain p-1" unoptimized />
                    : <span className="flex h-full items-center justify-center text-xs font-bold text-sky-500">{tool.name[0]}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 dark:text-slate-200 truncate">{tool.name}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500">{tp(tool.pricingType as never)}</div>
                </div>
                <Plus className="h-4 w-4 text-gray-300 group-hover:text-sky-500 shrink-0 transition-colors" />
              </button>
            ))}
            {available.length === 0 && (
              <div className="col-span-full text-sm text-gray-400 dark:text-slate-500 py-4 text-center">
                {items.length >= MAX_COMPARE ? t('selectAtLeast2') : '—'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison table */}
      {items.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed dark:border-slate-700 rounded-2xl">
          <GitCompare className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-slate-400 mb-2">{t('empty')}</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500">{t('emptyDesc')}</p>
        </div>
      )}

      {items.length === 1 && (
        <div className="text-center py-10 text-sm text-gray-400 dark:text-slate-500 border dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/30">
          {t('selectAtLeast2')}
        </div>
      )}

      {items.length >= 2 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{tt('compareTitle')}</h2>
          <div className="overflow-x-auto rounded-xl border dark:border-slate-700 shadow-sm">
            <table className="w-full text-sm" style={{ minWidth: `${160 + items.length * 180}px` }}>
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="px-4 py-3 w-40 bg-gray-50 dark:bg-slate-800/60" />
                  {items.map((tool, idx) => {
                    const isBest = idx === bestIdx
                    return (
                      <th key={tool.slug} className={cn('px-4 py-4 text-center font-semibold border-l dark:border-slate-700', isBest ? 'bg-sky-50 dark:bg-sky-950/30' : 'bg-gray-50 dark:bg-slate-800/60')}>
                        <div className="flex flex-col items-center gap-2">
                          {isBest && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-full px-2 py-0.5">
                              <Trophy className="h-3 w-3" /> {tt('bestChoice')}
                            </span>
                          )}
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm">
                            {tool.logo
                              ? <Image src={tool.logo} alt={tool.name} fill className="object-contain p-1.5" unoptimized />
                              : <span className="flex h-full items-center justify-center text-lg font-bold text-sky-500">{tool.name[0]}</span>
                            }
                          </div>
                          <Link href={`/tools/${tool.slug}`} className="font-semibold text-sm text-gray-900 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 flex items-center gap-1">
                            {tool.name} <ExternalLink className="h-3 w-3 opacity-40" />
                          </Link>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <TrendingUp className="h-3.5 w-3.5" />{tool.pros.length}
                            </span>
                            <span className="text-gray-300 dark:text-slate-600">|</span>
                            <span className="flex items-center gap-0.5 text-red-500 dark:text-red-400 font-semibold">
                              <TrendingDown className="h-3.5 w-3.5" />{tool.cons.length}
                            </span>
                          </div>
                          <button onClick={() => removeTool(tool.slug)} className="text-[11px] text-gray-400 hover:text-red-500 flex items-center gap-0.5 transition-colors">
                            <X className="h-3 w-3" /> {tt('removeFromCompare')}
                          </button>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Pricing */}
                <tr className="border-b dark:border-slate-700/60">
                  <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400 bg-gray-50/50 dark:bg-slate-800/30">{tt('pricing')}</td>
                  {items.map((tool, idx) => (
                    <td key={tool.slug} className={cn('px-4 py-3 text-center border-l dark:border-slate-700/60', idx === bestIdx && 'bg-sky-50/40 dark:bg-sky-950/10')}>
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', pricingColor(tool.pricingType as never))}>
                        {tp(tool.pricingType as never)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Pros header */}
                <tr className="border-b dark:border-slate-700/60 bg-emerald-50/40 dark:bg-emerald-950/10">
                  <td colSpan={items.length + 1} className="px-4 py-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      <TrendingUp className="h-3.5 w-3.5" /> {tt('pros')}
                    </span>
                  </td>
                </tr>
                {Array.from({ length: prosRows }).map((_, i) => (
                  <tr key={`pro-${i}`} className={cn('border-b dark:border-slate-700/40', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/30 dark:bg-slate-800/20')}>
                    <td className="px-4 py-2.5 text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/30">{i + 1}.</td>
                    {items.map((tool, idx) => (
                      <td key={tool.slug} className={cn('px-4 py-2.5 text-xs border-l dark:border-slate-700/40', idx === bestIdx && 'bg-sky-50/20 dark:bg-sky-950/5')}>
                        {tool.pros[i]
                          ? <span className="flex items-start gap-1.5 text-gray-700 dark:text-slate-300 leading-relaxed"><span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{tool.pros[i]}</span>
                          : <span className="text-gray-300 dark:text-slate-600">—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Cons header */}
                <tr className="border-b dark:border-slate-700/60 bg-red-50/40 dark:bg-red-950/10">
                  <td colSpan={items.length + 1} className="px-4 py-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                      <TrendingDown className="h-3.5 w-3.5" /> {tt('cons')}
                    </span>
                  </td>
                </tr>
                {Array.from({ length: consRows }).map((_, i) => (
                  <tr key={`con-${i}`} className={cn('border-b last:border-0 dark:border-slate-700/40', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/30 dark:bg-slate-800/20')}>
                    <td className="px-4 py-2.5 text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/30">{i + 1}.</td>
                    {items.map((tool, idx) => (
                      <td key={tool.slug} className={cn('px-4 py-2.5 text-xs border-l dark:border-slate-700/40', idx === bestIdx && 'bg-sky-50/20 dark:bg-sky-950/5')}>
                        {tool.cons[i]
                          ? <span className="flex items-start gap-1.5 text-gray-700 dark:text-slate-300 leading-relaxed"><span className="text-red-400 mt-0.5 shrink-0">✗</span>{tool.cons[i]}</span>
                          : <span className="text-gray-300 dark:text-slate-600">—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
