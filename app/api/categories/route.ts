import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { tools: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, slug, description, icon } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }

    const category = await prisma.category.create({
      data: { name, slug, description: description || null, icon: icon || null },
    })

    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
