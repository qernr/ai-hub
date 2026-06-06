'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Plus, X, Trophy, ExternalLink, Trash2, GitCompare, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
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

function ToolLogo({ logo, name, size = 8 }: { logo: string | null; name: string; size?: number }) {
  const cls = `relative h-${size} w-${size} shrink-0 overflow-hidden rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700`
  return (
    <div className={cls}>
      {logo
        ? <Image src={logo} alt={name} fill className="object-contain p-1" unoptimized />
        : <span className="flex h-full items-center justify-center text-xs font-bold text-sky-500">{name[0]}</span>
      }
    </div>
  )
}

function CompareSummary({ items }: { items: CompareItem[] }) {
  const t = useTranslations('compare')
  const tp = useTranslations('pricing')

  const scores = items.map(i => i.pros.length - i.cons.length)
  const bestIdx = scores.indexOf(Math.max(...scores))
  const mostProsIdx = items.map(i => i.pros.length).indexOf(Math.max(...items.map(i => i.pros.length)))
  const leastConsIdx = items.map(i => i.cons.length).indexOf(Math.min(...items.map(i => i.cons.length)))
  const freeIdx = items.findIndex(i => i.pricingType === 'FREE')

  const stats = [
    { label: t('summaryBestOverall'), tool: items[bestIdx], icon: '🏆', desc: `${scores[bestIdx] >= 0 ? '+' : ''}${scores[bestIdx]} ${t('summaryScore')}` },
    { label: t('summaryMostPros'), tool: items[mostProsIdx], icon: '✅', desc: `${items[mostProsIdx].pros.length} ${t('summaryPros')}` },
    { label: t('summaryFewestCons'), tool: items[leastConsIdx], icon: '⚡', desc: `${items[leastConsIdx].cons.length} ${t('summaryCons')}` },
    { label: t('summaryBestFree'), tool: freeIdx >= 0 ? items[freeIdx] : null, icon: '💰', desc: freeIdx >= 0 ? tp('FREE' as never) : t('summaryNone') },
  ]

  // Determine what each tool is best for based on its pros vs others
  const toolAnalysis = items.map((tool, idx) => {
    const otherScores = scores.filter((_, i) => i !== idx)
    const maxOtherScore = otherScores.length ? Math.max(...otherScores) : 0
    const isWinner = scores[idx] > maxOtherScore
    const isFree = tool.pricingType === 'FREE'
    const hasMostPros = tool.pros.length === Math.max(...items.map(i => i.pros.length))
    const hasLeastCons = tool.cons.length === Math.min(...items.map(i => i.cons.length))

    const highlights: string[] = []
    if (isWinner) highlights.push(t('summaryBestOverall'))
    if (hasMostPros && !isWinner) highlights.push(t('summaryMostPros'))
    if (hasLeastCons) highlights.push(t('summaryFewestCons'))
    if (isFree) highlights.push(t('summaryBestFree'))

    return { tool, highlights, score: scores[idx], isBest: idx === bestIdx }
  })

  return (
    <div className="mb-8 rounded-2xl border dark:border-slate-700 bg-gradient-to-br from-slate-50 to-sky-50/30 dark:from-slate-800/60 dark:to-sky-950/10 overflow-hidden">
      {/* Summary header */}
      <div className="px-6 py-4 border-b dark:border-slate-700/60 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-sky-500" />
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t('summary')}</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b dark:border-slate-700/60">
        {stats.map((stat, i) => (
          <div key={i} className={cn('px-4 py-4 flex flex-col gap-2', i < 3 && 'border-r dark:border-slate-700/60')}>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 flex items-center gap-1">
              <span>{stat.icon}</span> {stat.label}
            </div>
            {stat.tool ? (
              <div className="flex items-center gap-2">
                <ToolLogo logo={stat.tool.logo} name={stat.tool.name} size={6} />
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{stat.tool.name}</div>
                  <div className="text-xs text-gray-400 dark:text-slate-500">{stat.desc}</div>
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-400 dark:text-slate-500">{stat.desc}</span>
            )}
          </div>
        ))}
      </div>

      {/* Per-tool analysis */}
      <div className="px-6 py-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {toolAnalysis.map(({ tool, highlights, score, isBest }, idx) => (
            <div key={tool.slug} className={cn(
              'rounded-xl border p-4',
              isBest
                ? 'border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20'
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
            )}>
              <div className="flex items-center gap-3 mb-3">
                <ToolLogo logo={tool.logo} name={tool.name} size={10} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/tools/${tool.slug}`} className="font-semibold text-gray-900 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 text-sm flex items-center gap-1">
                      {tool.name} <ExternalLink className="h-3 w-3 opacity-40" />
                    </Link>
                    {isBest && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-full px-1.5 py-0.5">
                        <Trophy className="h-2.5 w-2.5" /> {t('summaryBestOverall')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{tool.pros.length} {t('summaryPros')}</span>
                    <span className="text-gray-300 dark:text-slate-600">·</span>
                    <span className="text-red-500 dark:text-red-400 font-medium">{tool.cons.length} {t('summaryCons')}</span>
                  </div>
                </div>
              </div>

              {/* Top pros */}
              {tool.pros.slice(0, 2).length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">{t('summaryStrengths')}</div>
                  {tool.pros.slice(0, 2).map((pro, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-slate-300 mb-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      {pro}
                    </div>
                  ))}
                </div>
              )}

              {/* Top cons */}
              {tool.cons.slice(0, 1).length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-red-500 dark:text-red-400 mb-1">{t('summaryWeaknesses')}</div>
                  {tool.cons.slice(0, 1).map((con, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-slate-400 mb-0.5">
                      <XCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                      {con}
                    </div>
                  ))}
                </div>
              )}

              {/* Highlights badges */}
              {highlights.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t dark:border-slate-700/60">
                  {highlights.map((h, i) => (
                    <span key={i} className="text-[10px] font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full px-2 py-0.5">{h}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
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

  const prosRows = items.length ? Math.min(Math.max(...items.map(i => i.pros.length)), 6) : 0
  const consRows = items.length ? Math.min(Math.max(...items.map(i => i.cons.length)), 5) : 0
  const bestIdx = items.length
    ? items.map(i => i.pros.length - i.cons.length).indexOf(Math.max(...items.map(i => i.pros.length - i.cons.length)))
    : -1

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
          </div>
        </div>
      )}

      {/* States */}
      {items.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed dark:border-slate-700 rounded-2xl">
          <GitCompare className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-slate-400 mb-2">{t('empty')}</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500">{t('emptyDesc')}</p>
        </div>
      )}

      {items.length === 1 && (
        <div className="text-center py-8 text-sm text-gray-400 dark:text-slate-500 border dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/30">
          {t('selectAtLeast2')}
        </div>
      )}

      {/* Summary + Table */}
      {items.length >= 2 && (
        <>
          <CompareSummary items={items} />

          <div className="overflow-x-auto rounded-xl border dark:border-slate-700 shadow-sm">
            <table className="w-full text-sm" style={{ minWidth: `${160 + items.length * 180}px` }}>
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="px-4 py-3 w-40 bg-gray-50 dark:bg-slate-800/60" />
                  {items.map((tool, idx) => {
                    const isBest = idx === bestIdx
                    return (
                      <th key={tool.slug} className={cn('px-4 py-5 text-center font-semibold border-l dark:border-slate-700', isBest ? 'bg-sky-50 dark:bg-sky-950/30' : 'bg-gray-50 dark:bg-slate-800/60')}>
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
                      <CheckCircle2 className="h-3.5 w-3.5" /> {tt('pros')}
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
                      <XCircle className="h-3.5 w-3.5" /> {tt('cons')}
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
        </>
      )}
    </div>
  )
}
