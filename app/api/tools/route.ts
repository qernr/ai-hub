import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import type { PricingType } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const pricing = searchParams.get('pricing') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const perPage = Math.min(50, parseInt(searchParams.get('perPage') ?? '12', 10))

  const where = {
    AND: [
      q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { description: { contains: q, mode: 'insensitive' as const } },
        ],
      } : {},
      category ? { categories: { some: { category: { slug: category } } } } : {},
      pricing ? { pricingType: pricing as PricingType } : {},
    ],
  }

  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where,
      include: { categories: { include: { category: true } } },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.tool.count({ where }),
  ])

  return NextResponse.json({ tools, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { categoryIds, ...data } = body

    const existing = await prisma.tool.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }

    const tool = await prisma.tool.create({
      data: {
        ...data,
        categories: {
          create: (categoryIds as string[]).map((id) => ({ categoryId: id })),
        },
      },
      include: { categories: { include: { category: true } } },
    })

    return NextResponse.json(tool, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 })
  }
}
