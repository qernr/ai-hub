import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

interface RouteContext {
  params: { id: string }
}

export async function GET(_req: Request, { params }: RouteContext) {
  const tool = await prisma.tool.findUnique({
    where: { id: params.id },
    include: { categories: { include: { category: true } } },
  })
  if (!tool) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(tool)
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { categoryIds, ...data } = body

    const tool = await prisma.tool.update({
      where: { id: params.id },
      data: {
        ...data,
        categories: {
          deleteMany: {},
          create: (categoryIds as string[]).map((id) => ({ categoryId: id })),
        },
      },
      include: { categories: { include: { category: true } } },
    })

    return NextResponse.json(tool)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.tool.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 })
  }
}
