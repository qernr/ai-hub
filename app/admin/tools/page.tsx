export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, ExternalLink, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { pricingLabel, pricingColor, cn } from '@/lib/utils'
import { DeleteToolButton } from './DeleteToolButton'

export const metadata: Metadata = { title: 'Manage Tools' }

export default async function AdminToolsPage() {
  const tools = await prisma.tool.findMany({
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tools</h1>
          <p className="text-gray-500 text-sm mt-1">{tools.length} tools in directory</p>
        </div>
        <Link href="/admin/tools/new">
          <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <Plus className="h-4 w-4" />
            Add Tool
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Categories</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Pricing</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{tool.name}</span>
                    {tool.featured && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                  </div>
                  <span className="text-xs text-gray-400">{tool.slug}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {tool.categories.slice(0, 2).map(({ category }) => (
                      <Badge key={category.id} variant="secondary" className="text-xs">
                        {category.name}
                      </Badge>
                    ))}
                    {tool.categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">+{tool.categories.length - 2}</Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', pricingColor(tool.pricingType))}>
                    {pricingLabel(tool.pricingType)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                    <Link href={`/admin/tools/${tool.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <DeleteToolButton toolId={tool.id} toolName={tool.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tools.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tools yet. <Link href="/admin/tools/new" className="text-violet-600 hover:underline">Add the first one.</Link>
          </div>
        )}
      </div>
    </div>
  )
}
