import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'
import { z } from 'zod'

const OptionSchema = z.object({
  id:   z.string(),
  text: z.string().min(1),
})

const Schema = z.object({
  text:          z.string().min(1, 'Введите текст вопроса'),
  options:       z.array(OptionSchema).min(2, 'Минимум 2 варианта').max(6),
  correctOption: z.string().min(1, 'Укажите правильный ответ'),
  order:         z.number().int().min(0),
  imageUrl:      z.string().url().optional().or(z.literal('')),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const quiz = await prisma.quiz.findUnique({ where: { id: params.id } })
  if (!quiz)
    return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })
  if (quiz.teacherId !== user!.id)
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const { text, options, correctOption, order, imageUrl } = parsed.data

    // Validate correctOption exists in options
    const optionIds = options.map(o => o.id)
    if (!optionIds.includes(correctOption))
      return NextResponse.json({ error: 'Правильный ответ должен быть среди вариантов' }, { status: 400 })

    const question = await prisma.question.create({
      data: {
        quizId: params.id,
        text,
        options,
        correctOption,
        order,
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (err) {
    console.error('[questions POST]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function GET(
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

  const questions = await prisma.question.findMany({
    where: { quizId: params.id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(questions)
}
