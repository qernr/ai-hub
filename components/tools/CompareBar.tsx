'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, GitCompare, Trash2, Trophy, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompare } from '@/hooks/useCompare'
import { cn, pricingColor } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'

export function CompareBar() {
  const t = useTranslations('tool')
  const tp = useTranslations('pricing')
  const { items, removeTool, clearAll } = useCompare()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const toggle = () => setOpen(v => !v)
    window.addEventListener('aihub_compare_open', toggle)
    return () => window.removeEventListener('aihub_compare_open', toggle)
  }, [])

  useEffect(() => { if (items.length === 0) setOpen(false) }, [items.length])

  if (!mounted || items.length === 0 || pathname === '/compare') return null

  // Calculate score: pros.length - cons.length
  const scores = items.map(t => t.pros.length - t.cons.length)
  const bestScore = Math.max(...scores)
  const bestIdx = scores.indexOf(bestScore)

  return (
    <>
      {/* Overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Full comparison panel */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl"
          style={{ maxHeight: '85vh' }}>
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-700 shrink-0">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-sky-500" />
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t('compareTitle')}</h2>
              <span className="text-sm text-gray-400 dark:text-slate-400">({items.length} {t('compareToolsCount')})</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 text-gray-400 hover:text-red-500 text-xs">
                <Trash2 className="h-3.5 w-3.5" /> {t('clearComparison')}
              </Button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1">
            {/* Tool cards row */}
            <div className="grid border-b dark:border-slate-700" style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}>
              <div className="px-4 py-5 bg-gray-50 dark:bg-slate-800/50" />
              {items.map((tool, idx) => {
                const isBest = idx === bestIdx
                return (
                  <div key={tool.slug} className={cn(
                    'px-4 py-5 flex flex-col items-center gap-2 text-center border-l dark:border-slate-700',
                    isBest && 'bg-sky-50 dark:bg-sky-950/20'
                  )}>
                    {isBest && items.length > 1 && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-full px-2 py-0.5">
                        <Trophy className="h-3 w-3" /> {t('bestChoice')}
                      </div>
                    )}
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                      {tool.logo ? (
                        <Image src={tool.logo} alt={tool.name} fill className="object-contain p-1.5" unoptimized />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xl font-bold text-sky-500">{tool.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <Link href={`/tools/${tool.slug}`} className="font-semibold text-sm text-gray-900 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 flex items-center gap-1 justify-center">
                        {tool.name} <ExternalLink className="h-3 w-3 opacity-50" />
                      </Link>
                    </div>
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', pricingColor(tool.pricingType as never))}>
                      {tp(tool.pricingType as never)}
                    </span>
                    {/* Score */}
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ {tool.pros.length}</span>
                      <span className="text-gray-300 dark:text-slate-600">|</span>
                      <span className="text-red-500 dark:text-red-400 font-semibold">✗ {tool.cons.length}</span>
                    </div>
                    <button onClick={() => removeTool(tool.slug)} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-0.5 mt-1 transition-colors">
                      <X className="h-3 w-3" /> {t('removeFromCompare')}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Pricing row */}
            <div className="grid border-b dark:border-slate-700" style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}>
              <div className="px-4 py-4 bg-gray-50 dark:bg-slate-800/50 flex items-center">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">{t('pricing')}</span>
              </div>
              {items.map((tool, idx) => (
                <div key={tool.slug} className={cn('px-4 py-4 flex items-center justify-center border-l dark:border-slate-700', idx === bestIdx && 'bg-sky-50/50 dark:bg-sky-950/10')}>
                  <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', pricingColor(tool.pricingType as never))}>
                    {tp(tool.pricingType as never)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pros section */}
            <div className="border-b dark:border-slate-700">
              {/* Pros header */}
              <div className="grid bg-emerald-50 dark:bg-emerald-950/20 border-b dark:border-slate-700" style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}>
                <div className="px-4 py-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{t('pros')}</span>
                </div>
                {items.map((tool, idx) => (
                  <div key={tool.slug} className={cn('px-4 py-2.5 border-l dark:border-slate-700 text-center', idx === bestIdx && 'bg-sky-50/30 dark:bg-sky-950/10')}>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 rounded-full px-2 py-0.5">
                      {tool.pros.length}
                    </span>
                  </div>
                ))}
              </div>
              {/* Pros rows */}
              {Array.from({ length: Math.min(Math.max(...items.map(t => t.pros.length)), 6) }).map((_, i) => (
                <div key={`pro-${i}`} className={cn('grid border-b dark:border-slate-700/50', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/40 dark:bg-slate-800/20')} style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}>
                  <div className="px-4 py-2.5 text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/30 flex items-center">{i + 1}.</div>
                  {items.map((tool, idx) => (
                    <div key={tool.slug} className={cn('px-4 py-2.5 border-l dark:border-slate-700/40 text-xs', idx === bestIdx && 'bg-sky-50/20 dark:bg-sky-950/5')}>
                      {tool.pros[i] ? (
                        <span className="flex items-start gap-1.5 text-gray-700 dark:text-slate-300 leading-relaxed">
                          <span className="mt-0.5 text-emerald-500 shrink-0">✓</span>
                          {tool.pros[i]}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-slate-600">—</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Cons section */}
            <div className="border-b dark:border-slate-700">
              {/* Cons header */}
              <div className="grid bg-red-50 dark:bg-red-950/20 border-b dark:border-slate-700" style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}>
                <div className="px-4 py-2.5 flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">{t('cons')}</span>
                </div>
                {items.map((tool, idx) => (
                  <div key={tool.slug} className={cn('px-4 py-2.5 border-l dark:border-slate-700 text-center', idx === bestIdx && 'bg-sky-50/30 dark:bg-sky-950/10')}>
                    <span className="text-xs font-semibold text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/40 rounded-full px-2 py-0.5">
                      {tool.cons.length}
                    </span>
                  </div>
                ))}
              </div>
              {/* Cons rows */}
              {Array.from({ length: Math.min(Math.max(...items.map(t => t.cons.length)), 5) }).map((_, i) => (
                <div key={`con-${i}`} className={cn('grid border-b last:border-0 dark:border-slate-700/50', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/40 dark:bg-slate-800/20')} style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}>
                  <div className="px-4 py-2.5 text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/30 flex items-center">{i + 1}.</div>
                  {items.map((tool, idx) => (
                    <div key={tool.slug} className={cn('px-4 py-2.5 border-l dark:border-slate-700/40 text-xs', idx === bestIdx && 'bg-sky-50/20 dark:bg-sky-950/5')}>
                      {tool.cons[i] ? (
                        <span className="flex items-start gap-1.5 text-gray-700 dark:text-slate-300 leading-relaxed">
                          <span className="mt-0.5 text-red-400 shrink-0">✗</span>
                          {tool.cons[i]}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-slate-600">—</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar — always visible when 1+ tools */}
      {!open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-lg">
          <div className="container max-w-5xl py-3 flex items-center gap-3 flex-wrap">
            <GitCompare className="h-4 w-4 text-sky-500 shrink-0" />
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {items.map((tool) => (
                <div key={tool.slug} className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 rounded-full pl-1 pr-2 py-1">
                  <div className="relative h-5 w-5 overflow-hidden rounded-full border dark:border-slate-600 bg-white dark:bg-slate-700 shrink-0">
                    {tool.logo
                      ? <Image src={tool.logo} alt={tool.name} fill className="object-contain p-0.5" unoptimized />
                      : <span className="flex h-full items-center justify-center text-[8px] font-bold text-sky-500">{tool.name[0]}</span>
                    }
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-200">{tool.name}</span>
                  <button onClick={() => removeTool(tool.slug)} className="ml-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {items.length < 4 && (
                <span className="text-xs text-gray-400 dark:text-slate-500">{t('addMoreToCompare')}</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 text-gray-400 hover:text-red-500 text-xs">
                <Trash2 className="h-3.5 w-3.5" /> {t('clearComparison')}
              </Button>
              {items.length >= 2 && (
                <Button size="sm" className="gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white" onClick={() => setOpen(true)}>
                  <GitCompare className="h-4 w-4" />
                  {t('compareSelected')} ({items.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
