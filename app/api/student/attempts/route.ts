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

  const attempts = await prisma.quizAttempt.findMany({
    where: { studentId: user.id },
    include: {
      quiz: { select: { title: true, subject: true, type: true } },
    },
    orderBy: { startedAt: 'desc' },
    take: 20,
  })

  return NextResponse.json(attempts)
}
