export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ToolForm } from '../ToolForm'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'New Tool' }

export default async function NewToolPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div>
      <Link href="/admin/tools">
        <Button variant="ghost" size="sm" className="mb-6 gap-2 text-gray-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Button>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Tool</h1>
      <ToolForm categories={categories} />
    </div>
  )
}
