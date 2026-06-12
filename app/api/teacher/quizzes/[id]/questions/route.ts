import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'
import { z } from 'zod'

const Schema = z.object({
  text:          z.string().min(1, 'Введите текст вопроса'),
  options:       z.array(z.object({ id: z.string(), text: z.string() })).length(4),
  correctOption: z.string().min(1),
  order:         z.number().int().min(0),
  imageUrl:      z.string().optional(),
})

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findFirst({ where: { id: params.id, teacherId: user!.id } })
  if (!quiz) return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const question = await prisma.question.create({
    data: { quizId: params.id, ...parsed.data },
  })
  return NextResponse.json(question, { status: 201 })
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findFirst({ where: { id: params.id, teacherId: user!.id } })
  if (!quiz) return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })

  const questions = await prisma.question.findMany({
    where: { quizId: params.id },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(questions)
}
