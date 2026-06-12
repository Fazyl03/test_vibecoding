import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'
import { z } from 'zod'

const Schema = z.object({
  title:    z.string().min(3, 'Минимум 3 символа'),
  subject:  z.string().min(1, 'Укажите предмет'),
  type:     z.enum(['ENT', 'PBB', 'COMBO']),
  duration: z.number().min(5).max(180),
  courseId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const { error, user } = await requireTeacher()
  if (error) return error

  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const { title, subject, type, duration, courseId } = parsed.data

    const quiz = await prisma.quiz.create({
      data: {
        teacherId: user!.id,
        title,
        subject,
        type,
        duration,
        courseId: courseId ?? null,
        isPublished: false,
      },
    })

    return NextResponse.json({ id: quiz.id }, { status: 201 })
  } catch (err) {
    console.error('[teacher/quizzes POST]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function GET() {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quizzes = await prisma.quiz.findMany({
    where: { teacherId: user!.id },
    include: { _count: { select: { questions: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(quizzes)
}
