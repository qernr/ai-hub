'use client'

import { useState, useEffect, useCallback } from 'react'

export interface CompareItem {
  slug: string
  name: string
  logo: string | null
  pricingType: string
  pros: string[]
  cons: string[]
}

const STORAGE_KEY = 'aihub_compare'
export const MAX_COMPARE = 4

function load(): CompareItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CompareItem[]) : []
  } catch {
    return []
  }
}

export function useCompare() {
  const [items, setItems] = useState<CompareItem[]>([])

  useEffect(() => {
    setItems(load())
    const handler = () => setItems(load())
    window.addEventListener('aihub_compare_change', handler)
    return () => window.removeEventListener('aihub_compare_change', handler)
  }, [])

  const persist = useCallback((next: CompareItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setItems(next)
    window.dispatchEvent(new Event('aihub_compare_change'))
  }, [])

  const addTool = useCallback((item: CompareItem) => {
    const cur = load()
    if (cur.find(i => i.slug === item.slug) || cur.length >= MAX_COMPARE) return
    persist([...cur, item])
  }, [persist])

  const removeTool = useCallback((slug: string) => {
    persist(load().filter(i => i.slug !== slug))
  }, [persist])

  const clearAll = useCallback(() => persist([]), [persist])

  const isAdded = useCallback((slug: string) => items.some(i => i.slug === slug), [items])

  return { items, addTool, removeTool, clearAll, isAdded }
}
