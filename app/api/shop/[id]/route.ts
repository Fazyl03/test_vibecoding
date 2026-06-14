import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findFirst({
    where: { id: params.id, isPublished: true },
    include: { teacher: { select: { name: true } } },
  })

  if (!product) return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })

  let hasPurchased = false
  const session = await getServerSession()
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
    if (user) {
      const purchase = await prisma.purchase.findFirst({
        where: { studentId: user.id, productId: params.id, status: 'COMPLETED' },
      })
      hasPurchased = !!purchase
    }
  }

  // Похожие товары (тот же тип, исключая текущий)
  const similar = await prisma.product.findMany({
    where: { isPublished: true, type: product.type, id: { not: product.id } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ ...product, hasPurchased, similar })
}
