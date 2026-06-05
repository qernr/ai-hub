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

function isNaturalLanguage(query: string): boolean {
  return query.length > 10 && query.includes(' ')
}

// Fallback: detect category from keywords without AI
function detectCategoryLocally(query: string): string | null {
  const q = query.toLowerCase()
  if (/рисо|изображен|картин|нарисо|image|picture|draw|арт\b|генер.*изо/.test(q)) return 'image-generation'
  if (/редактир.*фото|фильтр|ретуш|удали.*фон|убери.*фон|photo.edit|background.remov|enhance.photo/.test(q)) return 'photo-editing'
  if (/видео|video|film|ролик|клип|анимац|reels|tiktok|shorts/.test(q)) return 'video-generation'
  if (/музык|music|song|песн|трек|мелоди|compose/.test(q)) return 'music-generation'
  if (/логотип|logo|бренд|brand|дизайн|design|визитк|шрифт/.test(q)) return 'design'
  if (/аватар|портрет|avatar|portrait|selfie|селфи|фото.*себя/.test(q)) return 'avatar'
  if (/встреч|совещани|meeting|конференц|транскриб|запис.*звонк|зум|zoom/.test(q)) return 'meetings'
  if (/учёб|обучен|учит|урок|языков|learn|study|tutor|курс/.test(q)) return 'education'
  if (/автоматиз|автоматическ|automat|workflow|интеграц|connect.*app/.test(q)) return 'automation'
  if (/код|code|program|разработ|debug|script|програ|frontend|backend/.test(q)) return 'programming'
  if (/перевод|translat|перевести/.test(q)) return 'translation'
  if (/голос|voice|речь|speech|озвучи|говор|аудио|подкаст|podcast/.test(q)) return 'voice-speech'
  if (/презентац|presentation|слайд|slide|powerpoint/.test(q)) return 'presentation-creation'
  if (/текст|написа|write|story|рассказ|эссе|статью|контент|перефраз/.test(q)) return 'text-generation'
  if (/чат|chat|помощник|assistant|разговор|поговор/.test(q)) return 'chatbots'
  if (/документ|document|файл|pdf|резюм|summary/.test(q)) return 'document-processing'
  if (/данн|data|аналит|analytic|таблиц|график|отчёт/.test(q)) return 'data-analytics'
  if (/фото|photo|pic|снимок|изображен/.test(q)) return 'photo-editing'
  return null
}

export function SearchBar({ placeholder, className, autoFocus }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('search')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

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
        const localCategory = detectCategoryLocally(trimmed)
        if (localCategory) {
          params.delete('q')
          params.set('category', localCategory)
        }
      }

      router.push(`/search?${params.toString()}`)
    },
    [query, router, searchParams]
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
          className="h-12 px-6 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
        >
          {t('searchBtn')}
        </Button>
      </div>
    </form>
  )
}
