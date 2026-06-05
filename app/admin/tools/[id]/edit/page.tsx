export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ToolForm } from '../../ToolForm'
import { Button } from '@/components/ui/button'

interface EditToolPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Edit Tool' }

export default async function EditToolPage({ params }: EditToolPageProps) {
  const { id } = await params
  const [tool, categories] = await Promise.all([
    prisma.tool.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!tool) notFound()

  return (
    <div>
      <Link href="/admin/tools">
        <Button variant="ghost" size="sm" className="mb-6 gap-2 text-gray-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Button>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit: {tool.name}</h1>
      <ToolForm tool={tool} categories={categories} />
    </div>
  )
}
