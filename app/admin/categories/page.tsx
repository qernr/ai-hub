export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { DeleteCategoryButton } from './DeleteCategoryButton'

export const metadata: Metadata = { title: 'Manage Categories' }

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { tools: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Tools</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 font-medium text-gray-900">
                    {cat.icon && <span>{cat.icon}</span>}
                    {cat.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{cat.slug}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-gray-600">{cat._count.tools} tools</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/admin/categories/${cat.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <DeleteCategoryButton categoryId={cat.id} categoryName={cat.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No categories yet.{' '}
            <Link href="/admin/categories/new" className="text-sky-500 hover:underline">
              Add the first one.
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
