import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'

export async function PUT(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findFirst({
    where: { id: params.id, teacherId: user!.id },
    include: { _count: { select: { questions: true } } },
  })
  if (!quiz) return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })
  if (quiz._count.questions === 0) return NextResponse.json({ error: 'Нужен минимум 1 вопрос' }, { status: 400 })

  await prisma.quiz.update({ where: { id: params.id }, data: { isPublished: true } })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findFirst({ where: { id: params.id, teacherId: user!.id } })
  if (!quiz) return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })

  await prisma.quiz.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
