import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const course = await prisma.course.findFirst({
    where: { id: params.id, teacherId: user!.id },
    include: { _count: { select: { quizzes: true, videos: true } } },
  })
  if (!course) return NextResponse.json({ error: 'Курс не найден' }, { status: 404 })

  if (course._count.quizzes === 0 && course._count.videos === 0) {
    return NextResponse.json({ error: 'Добавьте минимум 1 квиз или видео' }, { status: 400 })
  }

  await prisma.course.update({ where: { id: params.id }, data: { isPublished: true } })
  return NextResponse.json({ ok: true })
}
