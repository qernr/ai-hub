import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { CategoryForm } from '../../CategoryForm'

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Edit Category' }

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) notFound()

  return (
    <div>
      <Link href="/admin/categories">
        <Button variant="ghost" size="sm" className="mb-6 gap-2 text-gray-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit: {category.name}</h1>
      <CategoryForm category={category} />
    </div>
  )
}
