'use client'

import { Brain } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('footer')

  const footerLinks = {
    [t('categoriesTitle')]: [
      { label: 'Text Generation', href: '/categories/text-generation' },
      { label: 'Image Generation', href: '/categories/image-generation' },
      { label: 'Video Generation', href: '/categories/video-generation' },
      { label: 'Programming', href: '/categories/programming' },
      { label: 'Translation', href: '/categories/translation' },
    ],
    [t('popularTitle')]: [
      { label: 'ChatGPT', href: '/tools/chatgpt' },
      { label: 'Midjourney', href: '/tools/midjourney' },
      { label: 'Claude', href: '/tools/claude' },
      { label: 'Cursor', href: '/tools/cursor' },
      { label: 'ElevenLabs', href: '/tools/elevenlabs' },
    ],
    [t('siteTitle')]: [
      { label: t('exploreAll'), href: '/search' },
      { label: 'Categories', href: '/categories' },
      { label: t('supportUs'), href: '/support' },
    ],
  }

  return (
    <footer className="border-t border-border bg-gray-50 dark:bg-slate-900">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                AI Hub
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{t('tagline')}</p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            © {new Date().getFullYear()} AI Hub. {t('rights')}
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1">
            {t('madeWith')}
          </p>
        </div>
      </div>
    </footer>
  )
}
