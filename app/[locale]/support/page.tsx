import type { Metadata } from 'next'
import { Heart, Star, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'support' })
  return { title: t('title') }
}

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('support')

  const benefits = [
    { icon: '🚀', title: t('benefit1Title'), description: t('benefit1Desc') },
    { icon: '✨', title: t('benefit2Title'), description: t('benefit2Desc') },
    { icon: '🔄', title: t('benefit3Title'), description: t('benefit3Desc') },
    { icon: '🌍', title: t('benefit4Title'), description: t('benefit4Desc') },
  ]

  return (
    <div className="container py-16 max-w-3xl">
      <div className="text-center mb-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 mx-auto mb-4">
          <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{t('subtitle')}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">{t('whatEnables')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <Card key={b.title} className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="flex items-start gap-3 p-5">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{b.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{b.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 p-8 text-white text-center mb-8">
        <Star className="h-10 w-10 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-3">{t('donateTitle')}</h2>
        <p className="text-sky-50 mb-6 leading-relaxed">{t('donateDesc')}</p>
        <a href="https://www.donationalerts.com" target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-50 font-semibold gap-2 text-base px-8">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            {t('donateBtn')}
          </Button>
        </a>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <Coffee className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('otherWays')}</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>⭐ {t('share')}</li>
            <li>📢 {t('recommend')}</li>
            <li>🐛 {t('report')}</li>
            <li>💡 {t('suggest')}</li>
          </ul>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8 flex items-center justify-center gap-1">
        {t('madeWith')}
      </p>
    </div>
  )
}
