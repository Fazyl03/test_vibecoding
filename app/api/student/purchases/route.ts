import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ error: 'Не найден' }, { status: 401 })

  const purchases = await prisma.purchase.findMany({
    where: { studentId: user.id, status: 'COMPLETED' },
    include: {
      product: { select: { id: true, name: true, type: true, fileUrl: true } },
      course:  { select: { id: true, title: true, type: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(purchases)
}
