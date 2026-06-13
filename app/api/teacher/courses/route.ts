import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'
import { z } from 'zod'

const Schema = z.object({
  title:       z.string().min(3, 'Минимум 3 символа'),
  description: z.string().optional(),
  price:       z.number().int().min(0),
  type:        z.enum(['ENT', 'PBB', 'COMBO']),
})

export async function POST(req: NextRequest) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const course = await prisma.course.create({
    data: {
      teacherId: user!.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      price: parsed.data.price,
      type: parsed.data.type,
      isPublished: false,
    },
  })

  return NextResponse.json({ id: course.id }, { status: 201 })
}

export async function GET() {
  const { error, user } = await requireTeacher()
  if (error) return error

  const courses = await prisma.course.findMany({
    where: { teacherId: user!.id },
    include: { _count: { select: { quizzes: true, videos: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(courses)
}
