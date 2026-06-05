'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

interface SearchBarProps {
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchBar({ placeholder, className, autoFocus }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('search')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const resolvedPlaceholder = placeholder ?? t('placeholder')

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim()) {
        params.set('q', query.trim())
      } else {
        params.delete('q')
      }
      params.delete('page')
      router.push(`/search?${params.toString()}`)
    },
    [query, router, searchParams]
  )

  const handleClear = useCallback(() => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    router.push(`/search?${params.toString()}`)
  }, [router, searchParams])

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={resolvedPlaceholder}
            className="pl-10 pr-10 h-12 text-base"
            autoFocus={autoFocus}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          {t('searchBtn')}
        </Button>
      </div>
    </form>
  )
}
