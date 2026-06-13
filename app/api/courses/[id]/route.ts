import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const course = await prisma.course.findFirst({
    where: { id: params.id, isPublished: true },
    include: {
      teacher: { select: { name: true } },
      quizzes: {
        where: { isPublished: true },
        select: { id: true, title: true, subject: true, duration: true },
      },
      videos: {
        where: { isPublished: true },
        select: { id: true, title: true, subject: true, duration: true, youtubeUrl: true },
      },
    },
  })

  if (!course) return NextResponse.json({ error: 'Курс не найден' }, { status: 404 })

  // Проверяем доступ, если пользователь авторизован
  let hasAccess = false
  const session = await getServerSession()
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
    if (user) {
      const purchase = await prisma.purchase.findFirst({
        where: { studentId: user.id, courseId: params.id, status: 'COMPLETED' },
      })
      hasAccess = !!purchase || course.price === 0
    }
  } else {
    hasAccess = course.price === 0
  }

  return NextResponse.json({ ...course, hasAccess })
}
