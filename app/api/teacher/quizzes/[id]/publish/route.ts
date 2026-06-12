import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: { _count: { select: { questions: true } } },
  })

  if (!quiz)
    return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })

  if (quiz.teacherId !== user!.id)
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })

  if (quiz._count.questions === 0)
    return NextResponse.json({ error: 'Нельзя опубликовать квиз без вопросов' }, { status: 400 })

  const updated = await prisma.quiz.update({
    where: { id: params.id },
    data: { isPublished: true },
  })

  return NextResponse.json({ id: updated.id, isPublished: updated.isPublished })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findUnique({ where: { id: params.id } })

  if (!quiz)
    return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })

  if (quiz.teacherId !== user!.id)
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })

  await prisma.quiz.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Удалено' })
}
