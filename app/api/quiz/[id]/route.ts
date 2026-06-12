import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id, isPublished: true },
    select: {
      id: true,
      title: true,
      subject: true,
      type: true,
      duration: true,
      teacher: { select: { name: true } },
      questions: {
        select: {
          id: true,
          text: true,
          options: true,
          order: true,
          imageUrl: true,
          // correctOption намеренно НЕ включаем
        },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!quiz) return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 })

  return NextResponse.json(quiz)
}
