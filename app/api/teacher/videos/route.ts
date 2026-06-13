import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'
import { z } from 'zod'

const Schema = z.object({
  title:      z.string().min(3, 'Минимум 3 символа'),
  subject:    z.string().min(1, 'Укажите предмет'),
  youtubeUrl: z.string().url('Введите корректную ссылку'),
  duration:   z.string().optional(),
  courseId:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const { title, subject, youtubeUrl, duration, courseId } = parsed.data

  // Проверяем что курс (если указан) принадлежит учителю
  if (courseId) {
    const course = await prisma.course.findFirst({ where: { id: courseId, teacherId: user!.id } })
    if (!course) return NextResponse.json({ error: 'Курс не найден' }, { status: 404 })
  }

  const video = await prisma.video.create({
    data: {
      teacherId: user!.id,
      title,
      subject,
      youtubeUrl,
      duration: duration || null,
      courseId: courseId || null,
      isPublished: false,
    },
  })

  return NextResponse.json({ id: video.id }, { status: 201 })
}

export async function GET() {
  const { error, user } = await requireTeacher()
  if (error) return error

  const videos = await prisma.video.findMany({
    where: { teacherId: user!.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(videos)
}
