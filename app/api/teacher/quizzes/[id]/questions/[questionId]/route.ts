import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; questionId: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findUnique({ where: { id: params.id } })
  if (!quiz)
    return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })
  if (quiz.teacherId !== user!.id)
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })

  const question = await prisma.question.findUnique({ where: { id: params.questionId } })
  if (!question || question.quizId !== params.id)
    return NextResponse.json({ error: 'Вопрос не найден' }, { status: 404 })

  await prisma.question.delete({ where: { id: params.questionId } })
  return NextResponse.json({ message: 'Удалено' })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; questionId: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findUnique({ where: { id: params.id } })
  if (!quiz)
    return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })
  if (quiz.teacherId !== user!.id)
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })

  const body = await req.json()
  const question = await prisma.question.update({
    where: { id: params.questionId },
    data: body,
  })

  return NextResponse.json(question)
}
