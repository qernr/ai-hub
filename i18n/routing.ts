import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ru', 'es', 'fr', 'de', 'pt', 'ja', 'zh', 'ar', 'ko', 'it', 'tr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
