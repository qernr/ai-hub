'use client'

import { usePathname } from '@/i18n/navigation'
import { useState } from 'react'
import { Brain, Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const t = useTranslations('nav')

  const navLinks = [
    { href: '/categories' as const, label: t('categories') },
    { href: '/search' as const, label: t('explore') },
    { href: '/support' as const, label: t('support') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
            <Brain className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
            AI Hub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-sky-500 dark:hover:text-sky-400',
                pathname === link.href
                  ? 'text-sky-500 dark:text-sky-400'
                  : 'text-gray-600 dark:text-slate-300'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/search">
            <Button variant="outline" size="sm" className="gap-2 dark:border-slate-700 dark:text-slate-300">
              <Search className="h-4 w-4" />
              {t('search')}
            </Button>
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            className="p-2 rounded-md text-gray-700 dark:text-slate-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white dark:bg-slate-900 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium py-2 transition-colors',
                pathname === link.href
                  ? 'text-sky-500 dark:text-sky-400'
                  : 'text-gray-700 dark:text-slate-300'
              )}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/search" onClick={() => setMenuOpen(false)}>
            <Button className="w-full gap-2" size="sm">
              <Search className="h-4 w-4" />
              {t('search')}
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
