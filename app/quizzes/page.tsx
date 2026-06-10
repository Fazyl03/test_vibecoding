import { prisma } from '@/lib/prisma'
import QuizzesClient from './QuizzesClient'

export default async function QuizzesPage() {
  const quizzes = await prisma.quiz.findMany({
    where: { isPublished: true },
    include: { teacher: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return <QuizzesClient quizzes={quizzes} />
}
