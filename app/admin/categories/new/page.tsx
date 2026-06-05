import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryForm } from '../CategoryForm'

export const metadata: Metadata = { title: 'New Category' }

export default function NewCategoryPage() {
  return (
    <div>
      <Link href="/admin/categories">
        <Button variant="ghost" size="sm" className="mb-6 gap-2 text-gray-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h1>
      <CategoryForm />
    </div>
  )
}
