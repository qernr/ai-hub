export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ComparePageContent } from '@/components/tools/ComparePageContent'
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Compare AI Tools — AI Hub',
  description: 'Compare AI tools side by side. See pros, cons, and pricing.',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ComparePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const tools = await prisma.tool.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      logo: true,
      pricingType: true,
      pros: true,
      cons: true,
      featured: true,
    },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  })

  return <ComparePageContent tools={tools} />
}
