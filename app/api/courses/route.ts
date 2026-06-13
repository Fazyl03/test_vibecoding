import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      teacher: { select: { name: true } },
      _count: { select: { quizzes: true, videos: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(courses)
}
