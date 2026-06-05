'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

interface SearchBarProps {
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

function isNaturalLanguage(query: string): boolean {
  return query.length > 10 && query.includes(' ')
}

// Fallback: detect category from keywords without AI
function detectCategoryLocally(query: string): string | null {
  const q = query.toLowerCase()
  if (/рисо|изображен|картин|нарисо|image|picture|draw|арт\b|photo|фото|визуал|генер.*изо/.test(q)) return 'image-generation'
  if (/видео|video|film|ролик|клип|анимац/.test(q)) return 'video-generation'
  if (/музык|music|song|песн|трек|мелоди|compose/.test(q)) return 'music-generation'
  if (/код|code|program|разработ|debug|script|програ|frontend|backend/.test(q)) return 'programming'
  if (/перевод|translat|перевести|язык|язык/.test(q)) return 'translation'
  if (/голос|voice|речь|speech|озвучи|говор|аудио|audio/.test(q)) return 'voice-speech'
  if (/презентац|presentation|слайд|slide|powerpoint/.test(q)) return 'presentation-creation'
  if (/текст|написа|write|story|рассказ|эссе|статью|контент/.test(q)) return 'text-generation'
  if (/чат|chat|помощник|assistant|разговор|поговор|отвечал/.test(q)) return 'chatbots'
  if (/документ|document|файл|pdf|резюм|summary/.test(q)) return 'document-processing'
  if (/данн|data|аналит|analytic|таблиц|график|отчёт/.test(q)) return 'data-analytics'
  return null
}

export function SearchBar({ placeholder, className, autoFocus }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('search')
  const locale = useLocale()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const resolvedPlaceholder = placeholder ?? t('placeholder')

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = query.trim()

      const params = new URLSearchParams(searchParams.toString())
      params.delete('page')
      params.delete('ai_intent')
      params.delete('category')

      if (!trimmed) {
        params.delete('q')
        router.push(`/search?${params.toString()}`)
        return
      }

      params.set('q', trimmed)

      if (isNaturalLanguage(trimmed)) {
        setIsAnalyzing(true)
        let aiSucceeded = false
        try {
          const res = await fetch('/api/ai-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: trimmed, locale }),
          })
          const data = await res.json()
          if (data.intent) {
            params.set('ai_intent', data.intent)
            aiSucceeded = true
          }
          if (data.categories?.[0]) params.set('category', data.categories[0])
        } catch {
          // ignore, fallback below
        } finally {
          setIsAnalyzing(false)
        }

        // Fallback: local keyword detection when AI is not available
        if (!aiSucceeded) {
          const localCategory = detectCategoryLocally(trimmed)
          params.delete('q') // don't text-search a NL query
          if (localCategory) params.set('category', localCategory)
        }
      }

      router.push(`/search?${params.toString()}`)
    },
    [query, router, searchParams, locale]
  )

  const handleClear = useCallback(() => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    params.delete('ai_intent')
    params.delete('category')
    router.push(`/search?${params.toString()}`)
  }, [router, searchParams])

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          {isAnalyzing ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={resolvedPlaceholder}
            className="pl-10 pr-10 h-12 text-base"
            autoFocus={autoFocus}
            disabled={isAnalyzing}
          />
          {query && !isAnalyzing && (
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
          disabled={isAnalyzing}
          className="h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-70"
        >
          {isAnalyzing ? t('aiAnalyzing') : t('searchBtn')}
        </Button>
      </div>
    </form>
  )
}
