import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'
import { z } from 'zod'

const Schema = z.object({
  quizIds:  z.array(z.string()).default([]),
  videoIds: z.array(z.string()).default([]),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const course = await prisma.course.findFirst({ where: { id: params.id, teacherId: user!.id } })
  if (!course) return NextResponse.json({ error: 'Курс не найден' }, { status: 404 })

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const { quizIds, videoIds } = parsed.data

  // Сначала отвязываем все квизы/видео этого курса, принадлежащие учителю
  await prisma.quiz.updateMany({
    where: { courseId: params.id, teacherId: user!.id },
    data: { courseId: null },
  })
  await prisma.video.updateMany({
    where: { courseId: params.id, teacherId: user!.id },
    data: { courseId: null },
  })

  // Затем привязываем выбранные (только свои)
  if (quizIds.length > 0) {
    await prisma.quiz.updateMany({
      where: { id: { in: quizIds }, teacherId: user!.id },
      data: { courseId: params.id },
    })
  }
  if (videoIds.length > 0) {
    await prisma.video.updateMany({
      where: { id: { in: videoIds }, teacherId: user!.id },
      data: { courseId: params.id },
    })
  }

  return NextResponse.json({ ok: true })
}
