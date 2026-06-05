export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { Wrench, Tag, Plus, TrendingUp } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboardPage() {
  const [toolCount, categoryCount, featuredCount, recentTools] = await Promise.all([
    prisma.tool.count(),
    prisma.category.count(),
    prisma.tool.count({ where: { featured: true } }),
    prisma.tool.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { categories: { include: { category: true } } },
    }),
  ])

  const stats = [
    { label: 'Total Tools', value: toolCount, icon: Wrench, href: '/admin/tools' },
    { label: 'Categories', value: categoryCount, icon: Tag, href: '/admin/categories' },
    { label: 'Featured Tools', value: featuredCount, icon: TrendingUp, href: '/admin/tools' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your AI tool directory</p>
        </div>
        <Link href="/admin/tools/new">
          <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <Plus className="h-4 w-4" />
            Add Tool
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                  <s.icon className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent tools */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recently Added</CardTitle>
            <Link href="/admin/tools">
              <Button variant="ghost" size="sm" className="text-violet-600">
                View all
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm text-gray-900">{tool.name}</p>
                  <p className="text-xs text-gray-500">
                    {tool.categories.map((c) => c.category.name).join(', ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/tools/${tool.slug}`}>
                    <Button variant="ghost" size="sm" className="text-xs h-7">View</Button>
                  </Link>
                  <Link href={`/admin/tools/${tool.id}/edit`}>
                    <Button variant="outline" size="sm" className="text-xs h-7">Edit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
