import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const Schema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    chosen:     z.string(),
  })),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  })
  if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 })

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id, isPublished: true },
    include: { questions: { select: { id: true, correctOption: true } } },
  })
  if (!quiz) return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { answers } = parsed.data

  // Считаем правильные ответы
  const correctMap = new Map(quiz.questions.map(q => [q.id, q.correctOption]))
  let score = 0
  const enrichedAnswers = answers.map(a => {
    const correctOption = correctMap.get(a.questionId) ?? ''
    const isCorrect = a.chosen === correctOption
    if (isCorrect) score++
    return { ...a, correct: isCorrect, correctOption }
  })

  // Сохраняем попытку
  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId:     params.id,
      studentId:  user.id,
      score,
      total:      quiz.questions.length,
      finishedAt: new Date(),
      answers: {
        create: answers.map(a => ({
          questionId: a.questionId,
          chosen:     a.chosen,
        })),
      },
    },
  })

  return NextResponse.json({
    attemptId: attempt.id,
    score,
    total:   quiz.questions.length,
    answers: enrichedAnswers,
  }, { status: 201 })
}
